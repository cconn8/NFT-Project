import sys
#import asyncio 
import socketio      
import time     
import ADXL345 as adxl                

sio = socketio.Client()


# NOTE: the events are created after the server side function is create_default_context
# everything on the client side is in response to the server (event)
# the client prints connected when it receives confirmation it has connected to the server
# confitmation is returned in the form of a connect event sio.on('connect')  OR connect()

@sio.event
def connect():
        print('Connected')
        sio.emit('client_connected', {'message': "Hi, this is RPi"})
        
        #create an object of the ADXL class
        obj = adxl.ADXL345()
        #call the timeout function (to return the payload)
        payload = obj.timeout(10)
        #emit the send_data function with the reurned payload

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

def main():
        sio.connect('http://192.168.1.7:3001')
        send_data("IoT Data Placeholder")
        # sio.received_event()
        sio.wait()


if __name__ == '__main__':
        main()

