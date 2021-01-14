# BLE Communication

## Message format

The message format is as follows:

|peripheral id|command id| content | CRC |
|:----:|:----:|:-----:|:-----:| 
|uint8_t | uint8_t | uint8_t[16] | uint8_t |

All the commands should be sent to CMD Characteristic. The system will first determine which peripheral the message is controlling, then interpret the specific command from the command id. If the command is for a child peripheral device (e.g. the buzzer of the robot), the command for the child device will be included in the content. All the bytes that's not specified will be set to null (0);

## Peripherals: To Robot

### M5 StickC Plus

Peripheral id: 0.

The peripherals of M5 StickC Plus have their own ids. If the command is for a specific module of M5 StickC Plus, the content of the message will be of CONTENT_M5_STICK struct following this format:

| child-peripheral id| content |
|:------------------:|:-------:|
|uint8_t| uint8_t[15] |

The content will be different depending on the child peripheral.

#### LCD

To be implemented

#### Servo

Content format:

|state|
|:---:|
|bool|

If the state is true, the servo opens the claw, otherwise it closes the clas.

#### WiFi

To be implemented

#### Buzzer

Content format:

|freq|duration|
|:--:|:------:|
|uint16_t|uint32_t|

freq determines the frequency of the buzzer, duration determines the duration of te note.

#### LED

To be implemented

#### Ultrasonic Sensor

To be implemented

#### IR

To be implemented

#### IMU

To be implemented

### Chassis

Peripheral id: 1  

The chassis handles all the movement of the robot. The content for command message for the chassis will follow the structure below:

|movement id| speed | time |
|:---------:|:-----:|:----:|
|uint8_t | uint8_t | uint32_t|

The movement id for the robot is listed below:

| Command | ID |
|:-------:|:--:|
|Forward|0| 
|Back|1|
|Left|2|
|Right|3|
|Stop|4|
|Turn left|5|
|Turn right|6|

**I2C to be implemented**

## Peripherals: From Robot

To be implemented