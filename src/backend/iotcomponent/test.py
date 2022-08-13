from ssl import create_default_context
import sys
import asyncio 
import socketio      
import time                     

sio = socketio.Client()


# NOTE: the events are created after the server side function is create_default_context
# everything on the client side is in response to the server (event)


# the client prints connected when it receives confirmation it has connected to the server
# confitmation is returned in the form of a connect event sio.on('connect')  OR connect()
@sio.event
def connect():
        print('Connected')
        sio.emit('client_connected', {'message': "Hi, this is RPi"})
#       print(client_message)

@sio.event
def disconnect():
        print('Disconnected')

# Emit (Send) data to the server and wait for response
def send_data(data):
        sio.emit('send_data', {'message': data})
        # return 'Thanks for acknowleding Server!'

# Server returns a message as confirmation for send_data
# Catch is with an event listener here
@sio.event
def data_received(data):
    print(data)


#@sio.on('send_data')  (equivalent)
# @sio.event

# def send_data(data):
#     print('Sending data to server: ', data)

def main():
        sio.connect('http://localhost:3001')
        send_data("IoT Data Placeholder")
        # sio.received_event()
        sio.wait()


if __name__ == '__main__':
        main()









