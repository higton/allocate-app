import os
import pika
from command_runner import CommandRunner

file_name = os.path.basename(__file__)
prefix = "wrapper_"
suffix = ".py"
if file_name.startswith(prefix):
    SOLVER_NAME = file_name[len(prefix):]
    SOLVER_NAME = SOLVER_NAME.split(suffix)[0]
else:
    SOLVER_NAME = "solver1"

print(f"Running: {SOLVER_NAME}")

def connect_rabbitmq():
    credentials = pika.PlainCredentials('user', 'password')
    parameters = pika.ConnectionParameters('localhost', credentials=credentials, port=5672)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    return connection, channel

def declare_exchanges(solver_name, channel):
    exchange_names = ['new_solver_exchange', f'{solver_name}_start_calculating_exchange', f'{solver_name}_result_exchange']
    for exchange_name in exchange_names:
        channel.exchange_declare(exchange=exchange_name, exchange_type='fanout')
        create_and_bind_queue(channel, exchange_name)

def create_and_bind_queue(channel, exchange_name):
    queue_name = f"{exchange_name}_queue"
    channel.queue_declare(queue=queue_name)
    channel.queue_bind(exchange=exchange_name, queue=queue_name)
    return queue_name

def consume_messages(channel, queue_name, connection):
    def callback(ch, method, properties, body):
        print(f"Received message: {body}")

        # wait 5 seconds and send a message to the result exchange
        runner = CommandRunner()
        message = runner.execute(body)

        publish_message(channel, f'{SOLVER_NAME}_result_exchange', message)

    channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print("Keyboard interruption detected. Exiting...")
        close_connection(connection)

def publish_message(channel, exchange_name, message):
    channel.basic_publish(exchange=exchange_name, routing_key='', body=message)

def close_connection(connection):
    print("Closing connection...")
    connection.channel().queue_delete(queue=f'{SOLVER_NAME}_start_calculating_exchange_queue')
    connection.channel().exchange_delete(exchange=f'{SOLVER_NAME}_start_calculating_exchange')
    connection.channel().exchange_delete(exchange=f'{SOLVER_NAME}_result_exchange')

def main():
    connection, channel = connect_rabbitmq()

    declare_exchanges(SOLVER_NAME, channel)

    message = f'{SOLVER_NAME}_start_calculating_exchange'
    channel.basic_publish(exchange='new_solver_exchange', routing_key='', body=message)
    channel.basic_publish(exchange=f'{SOLVER_NAME}_result_exchange', routing_key='', body='')

    queue_name = f'{SOLVER_NAME}_start_calculating_exchange_queue'
    consume_messages(channel, queue_name, connection)

    close_connection(connection)

if __name__ == "__main__":
    main()
