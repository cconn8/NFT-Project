import json
import smbus
import time
import socket


class ADXL345:
    
    # Constructor/Initializer takes instance as argument (self)
    def __init__(self):
    	# Get I2C bus
    	self.bus = smbus.SMBus(1)
	
    def set_registers(self):
    	bus = self.bus
	    # ADXL345 address, 0x53(83)
    	# Select bandwidth rate register, 0x2C(44)
    	# 0x0A(10)-Normal mode, Output data rate = 100 Hz
    	bus.write_byte_data(0x53, 0x2C, 0x0A)

    	# ADXL345 address, 0x53(83)
    	# Select power control register, 0x2D(45)
    	# 0x08(08)-Auto Sleep disable
    	bus.write_byte_data(0x53, 0x2D, 0x08)

    	# ADXL345 address, 0x53(83)
    	# Select data format register, 0x31(49)
    	# 0x08(08)-Self test disabled, 4-wire interface
    	# Full resolution, Range = +/-2g
    	bus.write_byte_data(0x53, 0x31, 0x08)

    	time.sleep(0.5)


    def read_register_data(self):
	
        bus = self.bus
        # ADXL345 address, 0x53(83)
        # Read data back from 0x32(50), 2 bytes
        # X-Axis LSB, X-Axis MSB
        data0 = bus.read_byte_data(0x53, 0x32)
        data1 = bus.read_byte_data(0x53, 0x33)

        # Convert the data to 10-bits
        xAccl = ((data1 & 0x03) * 256) + data0
        if xAccl > 511 :
            xAccl -= 1024

        # ADXL345 address, 0x53(83)
        # Read data back from 0x34(52), 2 bytes
        # Y-Axis LSB, Y-Axis MSB
        data0 = bus.read_byte_data(0x53, 0x34)
        data1 = bus.read_byte_data(0x53, 0x35)

        # Convert the data to 10-bits
        yAccl = ((data1 & 0x03) * 256) + data0
        if yAccl > 511 :
            yAccl -= 1024

        # ADXL345 address, 0x53(83)
        # Read data back from 0x36(54), 2 bytes
        # Z-Axis LSB, Z-Axis MSB
        data0 = bus.read_byte_data(0x53, 0x36)
        data1 = bus.read_byte_data(0x53, 0x37)

        # Convert the data to 10-bits
        zAccl = ((data1 & 0x03) * 256) + data0
        if zAccl > 511 :
            zAccl -= 1024

        print(" Acceleration in X-Axis : {}, Y-Axis : {}, Z-Axis : {}".format(xAccl, yAccl, zAccl))
        print(" -------------------------------------------------------------------------")
    

        time.sleep(2)

        payload = {'ADXL345 Acceleration' : [{
            'Producer' : socket.gethostname(),
            'Timestamp': datetime.time(),
            'X-Axis': xAccl,
            'Y-Axis': yAccl,
            'Z-Axis': zAccl
        }]}

        return payload

        def timeout(self, datasize):
            payload_list = []
            for i in range(0, len(datasize)):
                payload_list.append(self.read_register_data(self, 10))

            print("Timeout!!")
            payload_list = json.dumps(payload_list)
            return payload_list

def main():

    c1 = ADXL345()
    c1.timeout(10)


if __name__ == '__main__':
	main()
