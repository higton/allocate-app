import pika
import time
from command_runner import CommandRunner

SOLVER_NAME = 'solver1'

def connect_rabbitmq():
    credentials = pika.PlainCredentials('user', 'password')
    parameters = pika.ConnectionParameters('localhost', credentials=credentials, port=5672)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    return connection, channel

def declare_exchanges(solver_name, channel):
    exchange_names = [f'{solver_name}_start_calculating_exchange', f'{solver_name}_result_exchange']
    for exchange_name in exchange_names:
        channel.exchange_declare(exchange=exchange_name, exchange_type='fanout')

def create_and_bind_queue(channel, exchange_name):
    queue_name = f"{exchange_name}_queue"
    channel.queue_declare(queue=queue_name)
    channel.queue_bind(exchange=exchange_name, queue=queue_name)
    return queue_name

def consume_messages(channel, queue_name):
    def callback(ch, method, properties, body):
        print(f"Received message: {body}")

        # wait 5 seconds and send a message to the result exchange
        runner = CommandRunner()
        message = runner.execute(body)

        publish_message(channel, f'{SOLVER_NAME}_result_exchange', message)

    channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
    channel.start_consuming()

def publish_message(channel, exchange_name, message):
    channel.basic_publish(exchange=exchange_name, routing_key='', body=message)

def close_connection(connection):
    connection.close()

def main():
    connection, channel = connect_rabbitmq()

    declare_exchanges(SOLVER_NAME, channel)

    message = f'{SOLVER_NAME}_start_calculating_exchange'
    channel.basic_publish(exchange='new_solver_exchange', routing_key='', body=message)
    channel.basic_publish(exchange=f'{SOLVER_NAME}_result_exchange', routing_key='', body='')

    queue_name = f'{SOLVER_NAME}_start_calculating_exchange_queue'
    consume_messages(channel, queue_name)

    close_connection(connection)

if __name__ == "__main__":
    main()
