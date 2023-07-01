const axios = require('axios');
const amqp = require('amqplib');
const logger = require('loglevel');
const xml2js = require('xml2js');

logger.setLevel(logger.levels.INFO);

let solvers = [];
let request_made = {};

const RABBITMQ_HOST = 'localhost';
const RABBITMQ_PORT = 5672;
const RABBITMQ_PORT_HTTP = 15672;
const RABBITMQ_USERNAME = 'user';
const RABBITMQ_PASSWORD = 'password';

let channel, connection;

async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(`amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`);
        channel = await connection.createChannel();

        console.log("Connected to RabbitMQ");
    } catch (error) {
        logger.error('Error:', error);
    }
}

async function getExchanges(req, res) {
    try {
        const response = await axios.get(`http://${RABBITMQ_HOST}:${RABBITMQ_PORT_HTTP}/api/exchanges`, {
            auth: {
                username: RABBITMQ_USERNAME,
                password: RABBITMQ_PASSWORD
            }
        });

        const exchanges = response.data.map(exchange => exchange.name);

        solvers = exchanges.map(exchange => {
            if (exchange.includes("start_calculating_exchange")) {
                return exchange.split("_")[0];
            }
        }).filter(exchange => exchange !== undefined);

        res.json({ solvers });
    } catch (error) {
        console.error('Error retrieving exchanges:', error.message);
        res.status(500).json({ error: 'Failed to retrieve exchanges' });
    }
}

async function calculateSolver(req, res) {    
    try {
        console.log("calculateSolver");
        const solver = req.params.solver;

        console.log("solvers: ", solvers);
        console.log("solver: ", solver);
        console.log("req.body: ", req.body);

        const xmlBuilder = new xml2js.Builder();
        const xmlContent = xmlBuilder.buildObject(req.body);

        // if solver is not in the list of solvers, return an error
        if (!solvers.includes(solver)) {
            res.status(500).json({ error: 'Solver not found' });
            return;
        }

        // verify if solver was added to the request_made object
        if (request_made[solver] === undefined) { // the request was not made
            request_made[solver] = true;

            // send a message to the solver to start calculating
            console.log("sending message to solver: ", solver);
            await channel.publish(`${solver}_start_calculating_exchange`, '',  Buffer.from(xmlContent));
            res.status(200).json({ message: 'Calculating' });
            return;
        } else { // if the request was already made, see if the result is ready
            console.log("request was already made");
            const { queue } = await channel.assertQueue('${solver}_result_exchange_queue', { exclusive: true });
            await channel.bindQueue(queue, `${solver}_result_exchange`, '');

            const queueInfo = await channel.checkQueue(queue);
            const messageCount = queueInfo.messageCount;

            console.log("messageCount: ", messageCount);

            // do not listen to it
            // get the last message from the queue
            if (messageCount > 0) {
                const message = await channel.get(queue);
                console.log("message content: ", message.content.toString());
                request_made[solver] = undefined;
                res.status(200).json({ message: message.content.toString() });
                return;
            } else {
                res.status(200).json({ message: 'Calculating' });
                return;
            }
        }
    } catch (error) {
        console.error('Error retrieving exchanges:', error.message);
        res.status(500).json({ error: 'Failed to retrieve exchanges' });
    }
}

module.exports = {
    getExchanges,
    calculateSolver,
    connectRabbitMQ
};