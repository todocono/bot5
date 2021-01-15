# BLE Communication Protocol Documentation 

The material in this documentation is derived from "root-robot-ble-protocol" by RootRobotics. "root-robot-ble-protocol" is licensed under CC BY 4.0.

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

Each packet sent or received by the robot is defined below. 

### Peripherals: To Robot

This section describes the packet from the P5 website to the robot.

#### Peripheral 0 - General

To be implemented

#### Peripheral 1 - Motors

##### Command 0 - Set Direction and Speed of Motors

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

#### Peripheral 2 - Servos

##### Command 0 - Set Angle of Servo

Set the angle of the servos on the chassis.

Payload format:

| servo channel | angle |
|:-------:|:-----:|
| uint8_t | uint8_t |

- **servo channel**
    - value should be 1 or 2

- **angle**
    - angle in units of degree
    - range 0~180

##### Command 1 - Set Pulse Width of Servo

Set the pulse width of the servo on the chassis.

Payload format:

| servo channel | width |
|:-------:|:-----:|
| uint8_t | uint16_t |

- **servo channel**
    - value should be 1 or 2

- **angle**
    - angle in units of degree
    - range 500~2500

#### Peripheral 3 - I2C

##### Command 0 - Set Data for I2C

Allow writing to the two ports on the chassis.

Payload format:

| address | data |
|:-------:|:-----:|
| uint8_t | uint16_t |

- **address**
    - 0xXX

- **data**

#### Peripheral 4 - Red LED

##### Command 0 - Set Brightness of LED

Set brightness of the red LED in M5 StickC Plus.

Payload format:

| brightness |
|:-------:|
| uint8_t |

##### Command 1 - Get Brightness of LED

Request brightness of the red LED in M5StickC Plus.

#### Peripheral 5 - Buttons

##### Command 0 - Get Status of Button A

##### Command 1 - Get Status of Button B

#### Peripheral 6 - LCD

To be implemented

#### Peripheral 7 - IMU

##### Command 0 - Poll

Poll data from gyroscope and accelerometer.

To be implemented

##### Command 1 - Configuration

Configure IMU.

To be implemented

#### Peripheral 8 - Temperature

##### Command 0 - Poll

Poll data from temperature sensor.

To be implemented

#### Peripheral 9 - Buzzer

##### Command 0 - Set Volume

Set volume of buzzer in M5StickC Plus.

| volume |
|:-------:|
| uint8_t |

##### Command 1 - Get Volume

Request volume of buzzer in M5StickC Plus

##### Command 2 - Set Frequency and Duration of Tone

Set frequency and duration of buzzer tone in M5StickC Plus.

| freq | duration |
|:-------:|:------:|
| uint16_t | uint32_t |

- **freq**
    - frequency of note in units of hz

- **duration**
    - duration of note in unts of ms

##### Command 3 - Read Frequency and Duration of Tone

Request frequency and duration of buzzer tone in M5StickC Plus.

##### Command 4 - Mute Buzzer

Mute the buzzer in M5StickC Plus.

#### Peripheral 10 - Infrared Transmitter

##### Command 0 - Turn on IR TX

##### Command 1 - Turn off IR TX

##### Command 2 - Get Status of IR TX

#### Peripheral 11 - Microphone

##### Command 0 - Get Volume

#### Peripheral 12 - Power Management IC

To be implemented

#### Peripheral 13 - Grove Ports

To be implemented

#### Peripheral 14 - WiFi

To be implemented

#### Peripheral 15 - Camera

To be implemented

#### Peripheral 16 - ESP32

##### Command 0 - Get Data From Hall Effect Sensor

##### Command 1 - Serial Print

### Peripherals: From Robot

This section describes the packet from the robot to the P5 website.