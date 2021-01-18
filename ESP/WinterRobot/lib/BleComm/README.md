# BLE Communication Protocol Documentation 

The material in this documentation is derived from "[root-robot-ble-protocol](https://github.com/RootRobotics/root-robot-ble-protocol)" by RootRobotics. "[root-robot-ble-protocol](https://github.com/RootRobotics/root-robot-ble-protocol)" is licensed under CC BY 4.0.

## Table of Contents
1. [Packet Components](#packet-components)
2. [Packet Definitions](#packet-definitions)
    - [Peripheral 0 - General](#peripheral-0---general)
    - [Peripheral 1 - Motors](#peripheral-1---motors)
    - [Peripheral 2 - Servos](#peripheral-2---servos)
    - [Peripheral 3 - I2C](#peripheral-3---i2c)
    - [Peripheral 4 - Red LED](#peripheral-4---red-led)
    - [Peripheral 5 - Buttons](#peripheral-5---buttons)
    - [Peripheral 6 - LCD](#peripheral-6---lcd)
    - [Peripheral 7 - IMU](#peripheral-7---imu)
    - [Peripheral 8 - Buzzer](#peripheral-8---buzzer)
    - [Peripheral 9 - Infrared Transmitter](#peripheral-9---infrared-transmitter)
    - [Peripheral 10 - Microphone](#peripheral-10---microphone)
    - [Peripheral 11 - Power Management IC](#peripheral-11---power-management-ic)
    - [Peripheral 12 - RTC](#peripheral-12---rtc)
    - [Peripheral 13 - Grove Port](#peripheral-13---grove-port)
    - [Peripheral 14 - WiFi](#peripheral-14---wifi)
    - [Peripheral 15 - Camera](#peripheral-15---camera)
    - [Peripheral 16 - ESP32](#peripheral-16---esp32)


## Packet Components

The BLE packets for communication are 20 bytes long and the format is as follows:

**Peripheral ID** (1 byte)

The peripherals of the robot (M5StickC-Plus + RoverC-Pro) each have their own ID. Each peripheral is a subsystem of the robot (e.g. the buzzer of the robot) that only accepts packets that pertain to itself. 

**Command ID** (1 byte)

Each peripheral implements a series of commands. The command number tells each peripheral how to interpret the contents of the payload. Some commands request the robot to send a response packet.

**Packet ID** (1 byte)

Each packet has an identifying number. This number begins at zero and increments each time a packet is sent to the robot. When the number reaches a value of 255, it is resetted to 0. In cases where the packet is a response to a previous request, the packet ID will match the ID from the request. 

**Payload** (16 bytes)

The content of the packet payload can be up to 16 bytes. All bytes not specified will be set to null (0). Values are always big endian and are packed in a left justified manner on an 8-bit boundary.

**Checksum** (1 byte)

The last byte of each packet is a checksum calculated from the previous 19 bytes. This is used to check data integrity. A checksum value of zero is always accepted by the robot if a data integrity check is not needed. 

**Packet Format**

|peripheral id|command id| packet id | payload | CRC |
|:----:|:----:|:-----:|:----:|:-----:| 
|uint8_t | uint8_t | uint8_t | uint8_t[16] | uint8_t |

## Packet Definitions

Each packet sent or received by the robot is defined below. **To Robot** describes the packet from the P5 website to the robot. **From Robot** describes the packet from the robot to the P5 website.

### Peripheral 0 - General

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Set Name

Set a new BLE Device Name.

Payload format:

| name |
|:-------:|
| string |

- **name**
    - a UTF-8 encoded string containing the new BLE device name for the robot
    - name string should be null terminated if less than 16 bytes

#### Command 1 - Get Name

Request a response packet containing BLE device name.


#### From Robot
-------------------------------------------------------------------------------

#### Command 1 - Get Name Response

Reponse to Get Name packet. 

Payload format:

| name |
|:-------:|
| string |

- **name**
    - a UTF-8 encoded, null terminating string containing current BLE device name

### Peripheral 1 - Motors

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Set Movement and Speed of Motors

Set the movement and speed of motors.

Payload format:

| movement id | speed |
|:-------:|:-----:|
| uint8_t | int8_t |

- **movement id**
    | Command | ID |
    |:-------:|:--:|
    |Forward|0| 
    |Back|1|
    |Left|2|
    |Right|3|
    |Stop|4|
    |Turn left|5|
    |Turn right|6|

- **speed** 
    - range -127~127

#### Command 1 - Get Movement and Speed of Motors

Request a response packet containing movement id and speed of motors.

#### From Robot
-------------------------------------------------------------------------------

#### Command 1 - Get Movement and Speed of Motors Response

Response to Get Movement and Speed of Motors packet. 

Payload format:

| movement id | speed |
|:-------:|:-----:|
| uint8_t | int8_t |

- **movement id**
    - id corresponding to movement

- **speed**
    - range -127~127

### Peripheral 2 - Servos

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Set Angle of Servo

Set the angle of the servo.

Payload format:

| servo channel | angle |
|:-------:|:-----:|
| uint8_t | uint8_t |

- **servo channel**
    - `1` = Servo 1, `2` = Servo 2

- **angle**
    - angle in units of degree
    - range 0~180

#### Command 1 - Get Angle of Servo

Request response packet containing the angle of the servo.

Payload format:

| servo channel |
|:-------:|
| uint8_t |

- **servo channel**
    - `1` = Servo 1, `2` = Servo 2

#### Command 2 - Set Pulse Width of Servo

Set the pulse width of the servo.

Payload format:

| servo channel | width |
|:-------:|:-----:|
| uint8_t | uint16_t |

- **servo channel**
    - `1` = Servo 1, `2` = Servo 2

- **angle**
    - angle in units of microsecond
    - range 500~2500

#### Command 3 - Get Pulse Width of Servo

Request response packet containing the pulse width of the servo.

Payload format:

| servo channel |
|:-------:|
| uint8_t |

- **servo channel**
    - `1` = Servo 1, `2` = Servo 2

#### From Robot
-------------------------------------------------------------------------------

#### Command 1 - Get Angle of Servo Response

Response to Get Angle of Servo packet.

Payload format:

| servo channel | angle |
|:-------:|:-----:|
| uint8_t | uint8_t |

- **servo channel**
    - `1` = Servo 1, `2` = Servo 2

- **angle**
    - angle in units of degree
    - range 0~180

#### Command 3 - Get Pulse Width of Servo Response

Response to Get Pulse Width of Servo packet.

Payload format:

| servo channel | width |
|:-------:|:-----:|
| uint8_t | uint16_t |

- **servo channel**
    - `1` = Servo 1, `2` = Servo 2

- **angle**
    - angle in units of microsecond
    - range 500~2500

### Peripheral 3 - I2C

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Write Data for I2C Device

Allow writing to the two ports on the chassis.

Payload format:

| address | data |
|:-------:|:-----:|
| uint8_t | uint16_t |

- **address**
    - address of chassis Grove port is `0x57`

- **data**
    - data to be written to the ports

#### Command 1 - Read Data from I2C Device

Request packet containing data read from I2C device.

Payload format:

| address |
|:-------:|
| uint8_t |

- **address**
    - address of chassis Grove port is `0x57`

#### From Robot
-------------------------------------------------------------------------------

#### Command 1 - Read Data from I2C Device Response 

Reponse to Read Data from I2C Device packet.

Payload format:

| address | data |
|:-------:|:-----:|
| uint8_t | uint16_t |

- **address**
    - address of chassis Grove port is `0x57`

- **data**
    - data read from port

### Peripheral 4 - Red LED

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Set Brightness of LED

Set brightness of the red LED in M5 StickC Plus.

Payload format:

| brightness |
|:-------:|
| uint8_t |

- **brightness**
    - range 0~255

#### Command 1 - Get Brightness of LED

Request packet containing brightness of the red LED in M5StickC Plus.

#### From Robot
-------------------------------------------------------------------------------

#### Command 1 - Get Brightness of LED Response

Response to Get Brightness of LED packet.

Payload format:

| brightness |
|:-------:|
| uint8_t |

- **brightness**
    - range 0~255

### Peripheral 5 - Buttons

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Get State of Button A

Request packet containing state of button A.

Payload format:

| state |
|:-------:|
| bool |

- **state**
    - '0' = not pressed, '1' = pressed

#### Command 1 - Get State of Button B

Request packet containing state of button B.

Payload format:

| state |
|:-------:|
| bool |

- **state**
    - '0' = not pressed, '1' = pressed

#### From Robot
-------------------------------------------------------------------------------

#### Command 0 - Get State of Button A Response

Response to Get State of Button A packet.

Payload format:

| state |
|:-------:|
| bool |

- **state**
    - '0' = not pressed, '1' = pressed

#### Command 1 - Get State of Button B Response

Response to Get State of Button B packet.

Payload format:

| state |
|:-------:|
| bool |

- **state**
    - '0' = not pressed, '1' = pressed

### Peripheral 6 - LCD

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - QR Code

Generate QR Code for a URL to display on LCD.

| url | x | y | width | version |
|:---:|:---:|:---:|:---:|:------:|
| string | uint16_t | uint16_t | uint8_t | uint8_t |

- **url**
    - a UTF-8 encoded string containing the URL

- **x**
    - display QR Code at specified x coordinate
    - default value is 50

- **y**
    - display QR Code at specified y coordinate
    - default value is 10

- **width**
    - specify width of QR Code
    - default value is 220

- **version**
    - specify QR Code version
    - default value is 6

#### From Robot
-------------------------------------------------------------------------------

To be implemented

### Peripheral 7 - IMU

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Poll Gyroscope 

Poll gyroscope for x, y, z data.

#### Command 1 - Poll Accelerometer

Poll accelerometer for x, y, z data.

#### Command 2 - Poll AHRS

Poll attitude and heading reference system for pitch, roll, yaw data. 

#### Command 3 - Poll Temperature

Poll temperature sensor for temperature.

#### Command 4 - Configuration

Configure the IMU. To be implemented

#### From Robot
-------------------------------------------------------------------------------

#### Command 0 - Poll Gyroscope Response

Response to Poll Gyroscope packet. 

| gyroX | gyroY | gyroZ |
|:-----:|:-----:|:-----:|
| float | float | float |

- **gyroX**
    - x-axis value for gyroscope

- **gyroY**
    - y-axis value for gyroscope

- **gyroZ**
    - z-axis value for gyroscope

#### Command 1 - Poll Accelerometer Response

Response to Poll Accelerometer packet. 

| accX | accY | accZ |
|:-----:|:-----:|:-----:|
| float | float | float |

- **accX**
    - x-axis value for accelerometer

- **accY**
    - y-axis value for accelerometer

- **accZ**
    - z-axis value for accelerometer

#### Command 2 - Poll AHRS Response

Response to Poll AHRS packet. 

| pitch | roll | yaw |
|:-----:|:-----:|:-----:|
| float | float | float |

- **pitch**
    - pitch value for AHRS

- **roll**
    - roll value for AHRS

- **yaw**
    - yaw value for AHRS

#### Command 3 - Poll Temperature Response

Response to Poll Temperature packet. 

| temp |
|:-----:|
| float | 

- **temp**
    - temperature in units of celsius


### Peripheral 8 - Buzzer

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Set Volume

Set volume of buzzer in M5StickC-Plus.

| volume |
|:-------:|
| uint8_t |

- **volume**
    - default volume is 8

#### Command 1 - Get Volume

Request packet containing volume of buzzer in M5StickC-Plus.

#### Command 2 - Set Frequency and Duration of Tone

Set frequency and duration of buzzer tone in M5StickC Plus.

| freq | duration |
|:-------:|:------:|
| uint16_t | uint32_t |

- **freq**
    - frequency of note in units of hz

- **duration**
    - duration of note in unts of ms

#### Command 3 - Get Frequency and Duration of Tone

Request packet containing frequency and duration of buzzer tone in M5StickC Plus.

#### Command 4 - Mute Buzzer

Mute the buzzer in M5StickC-Plus.

#### From Robot
-------------------------------------------------------------------------------

#### Command 1 - Get Volume Response

Response to Get Volume packet.

| volume |
|:-------:|
| uint8_t |

- **volume**
    - default volume is 8

#### Command 3 - Get Frequency and Duration of Tone

Response to Get Frequency and Duration of Tone packet.

| freq | duration |
|:-------:|:------:|
| uint16_t | uint32_t |

- **freq**
    - frequency of note in units of hz

- **duration**
    - duration of note in unts of ms

### Peripheral 9 - Infrared Transmitter

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Set State of IR TX

Set the state of the infrared transmitter.

| state | 
|:-------:|
| bool |

- **state**
    - '0' = off, '1' = on

#### Command 1 - Get State of IR TX

Request a packet containing state of the infrared transmitter.

#### From Robot
-------------------------------------------------------------------------------

#### Command 1 - Get State of IR TX Response

Response to Get State of IR TX packet.

| state | 
|:-------:|
| bool |

- **state**
    - '0' = off, '1' = on

### Peripheral 10 - Microphone

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Get Volume

Request packet containing volume from the microphone.

#### From Robot
-------------------------------------------------------------------------------

#### Command 0 - Get Volume Reponse

Response to Get Volume packet. To be implemented.

### Peripheral 11 - Power Management IC

#### To Robot
-------------------------------------------------------------------------------

To be implemented

#### From Robot
-------------------------------------------------------------------------------

To be implemented

### Peripheral 12 - RTC

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Get Time

Request packet containing time.

#### Command 1 - Get Date

Request packet containing date.

#### From Robot
-------------------------------------------------------------------------------

#### Command 0 - Get Time Response

Response to Get Time packet.

To be implemented

#### Command 1 - Get Date Response

Response to Get Date packet.

To be implemented

### Peripheral 13 - Grove Port

#### To Robot
-------------------------------------------------------------------------------

To be implemented

#### From Robot
-------------------------------------------------------------------------------

To be implemented.

### Peripheral 14 - WiFi

#### To Robot
-------------------------------------------------------------------------------

To be implemented

#### From Robot
-------------------------------------------------------------------------------

To be implemente

### Peripheral 15 - Camera

#### To Robot
-------------------------------------------------------------------------------

To be implemented

#### From Robot
-------------------------------------------------------------------------------

To be implemented

### Peripheral 16 - ESP32

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Get Data From Hall Effect Sensor

#### Command 1 - Serial Print

#### From Robot
-------------------------------------------------------------------------------

To be implemented
