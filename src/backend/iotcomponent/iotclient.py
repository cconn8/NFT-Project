#import asyncio
import sys
import socketio
import time

sio = socketio.Client()

@sio.event
def connect():
	print('Connected')
	client_message = sio.call('connect_event', {'message': "Hi, this is RPi"})
#	print(client_message)

@sio.event
def connect_error(e):
	print('Connection failed')

@sio.event
def disconnect():
	print('Disconnected')

@sio.event
def send_data():
	payload = sio.call('data_event', {'message': "IoT Data Placeholder"})
	print(payload)

def main():
	sio.connect('http://192.168.1.7:3001')
#	time.sleep(1)
	sio.send_data()
	sio.wait()


if __name__ == '__main__':
	main()
