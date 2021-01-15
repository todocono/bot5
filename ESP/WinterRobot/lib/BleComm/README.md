# BLE Communication Protocol Documentation 

The material in this documentation is derived from "[root-robot-ble-protocol](https://github.com/RootRobotics/root-robot-ble-protocol)" by RootRobotics. "[root-robot-ble-protocol](https://github.com/RootRobotics/root-robot-ble-protocol)" is licensed under CC BY 4.0.

## Table of Contents
1. [Packet Components](#packet-components)
2. [Packet Definitions](#packet-definitions)
    - [Peripheral 0] - [General](#peripheral-0---general)
    - [Peripheral 1] - [Motors](#peripheral-1---motors)
    - [Peripheral 2] - [Servos](#peripheral-2---servos)
    - [Peripheral 3] - [I2C](#peripheral-3---i2c)
    - [Peripheral 4] - [Red LED](#peripheral-4---red-led)
    - [Peripheral 5] - [Buttons](#peripheral-5---buttons)
    - [Peripheral 6] - [LCD](#peripheral-6---lcd)
    - [Peripheral 7] - [IMU](#peripheral-7---imu)
    - [Peripheral 8] - [Temperature](#peripheral-8---temperature)
    - [Peripheral 9] - [Buzzer](#peripheral-9---buzzer)
    - [Peripheral 10] - [Infrared Transmitter](#peripheral-10---infrared-transmitter)
    - [Peripheral 11] - [Microphone](#peripheral-11---microphone)
    - [Peripheral 12] - [Power Management IC](#peripheral-12---power-management-ic)
    - [Peripheral 13] - [Grove Port](#peripheral-13---grove-port)
    - [Peripheral 14] - [WiFi](#peripheral-14---wifi)
    - [Peripheral 15] - [Camera](#peripheral-15---camera)
    - [Peripheral 16] - [ESP32](#peripheral-16---grove-port)


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
To be implemented

#### From Robot
-------------------------------------------------------------------------------
To be implemented

### Peripheral 1 - Motors

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Set Movement and Speed of Motors

Set movement and speed of motors.

Payload format:

| movement id | speed |
|:-------:|:-----:|
| uint8_t | uint8_t |

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

Request a response packet with movement id and speed of motors.

#### From Robot
-------------------------------------------------------------------------------

#### Command 1 - Get Movement and Speed of Motors Response

Response to Get Movement and Speed of Motors packet. 

Payload format:

| movement id | speed |
|:-------:|:-----:|
| uint8_t | uint8_t |

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
    - value should be 1 or 2

- **angle**
    - angle in units of degree
    - range 0~180

#### Command 1 - Get Angle of Servo

Request response packet with the angle of the servo.

#### Command 2 - Set Pulse Width of Servo

Set the pulse width of the servo.

Payload format:

| servo channel | width |
|:-------:|:-----:|
| uint8_t | uint16_t |

- **servo channel**
    - value should be 1 or 2

- **angle**
    - angle in units of degree
    - range 500~2500

#### Command 3 - Get Pulse Width of Servo

Request response packet with the pulse width of the servo.

#### From Robot
-------------------------------------------------------------------------------

#### Command 1 - Get Angle of Servo Response

Response to Get Angle of Servo packet.

Payload format:

| servo channel | angle |
|:-------:|:-----:|
| uint8_t | uint8_t |

#### Command 3 - Get Pulse Width of Servo

Response to Get Pulse Width of Servo packet.

Payload format:

| servo channel | width |
|:-------:|:-----:|
| uint8_t | uint16_t |

### Peripheral 3 - I2C

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Set Data for I2C

Allow writing to the two ports on the chassis.

Payload format:

| address | data |
|:-------:|:-----:|
| uint8_t | uint16_t |

- **address**
    - 0xXX

- **data**

#### Command 1 - Get Data for I2C

Request packet with data for I2C.

#### From Robot
-------------------------------------------------------------------------------

#### Command 1 - Get Data for I2C Response 

Reponse to Get Data for I2C packet.

Payload format:

| address | data |
|:-------:|:-----:|
| uint8_t | uint16_t |

### Peripheral 4 - Red LED

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Set Brightness of LED

Set brightness of the red LED in M5 StickC Plus.

Payload format:

| brightness |
|:-------:|
| uint8_t |

#### Command 1 - Get Brightness of LED

Request brightness of the red LED in M5StickC Plus.

#### From Robot
-------------------------------------------------------------------------------

### Peripheral 5 - Buttons

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Get Status of Button A

#### Command 1 - Get Status of Button B

#### From Robot
-------------------------------------------------------------------------------

### Peripheral 6 - LCD

#### To Robot
-------------------------------------------------------------------------------

To be implemented

### Peripheral 7 - IMU

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Poll

Poll data from gyroscope and accelerometer.

To be implemented

#### Command 1 - Configuration

Configure IMU.

To be implemented

#### From Robot
-------------------------------------------------------------------------------

### Peripheral 8 - Temperature

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Poll

Poll data from temperature sensor.

To be implemented

#### From Robot
-------------------------------------------------------------------------------

### Peripheral 9 - Buzzer

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Set Volume

Set volume of buzzer in M5StickC Plus.

| volume |
|:-------:|
| uint8_t |

#### Command 1 - Get Volume

Request volume of buzzer in M5StickC Plus

#### Command 2 - Set Frequency and Duration of Tone

Set frequency and duration of buzzer tone in M5StickC Plus.

| freq | duration |
|:-------:|:------:|
| uint16_t | uint32_t |

- **freq**
    - frequency of note in units of hz

- **duration**
    - duration of note in unts of ms

#### Command 3 - Read Frequency and Duration of Tone

Request frequency and duration of buzzer tone in M5StickC Plus.

#### Command 4 - Mute Buzzer

Mute the buzzer in M5StickC Plus.

#### From Robot
-------------------------------------------------------------------------------

### Peripheral 10 - Infrared Transmitter

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Turn on IR TX

#### Command 1 - Turn off IR TX

#### Command 2 - Get Status of IR TX

#### From Robot
-------------------------------------------------------------------------------

### Peripheral 11 - Microphone

#### To Robot
-------------------------------------------------------------------------------

#### Command 0 - Get Volume

#### From Robot
-------------------------------------------------------------------------------

### Peripheral 12 - Power Management IC

#### To Robot
-------------------------------------------------------------------------------

To be implemented

#### From Robot
-------------------------------------------------------------------------------

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