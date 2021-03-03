# Javascript Client Library for BLE Communication

## Table of Contents
1. [Setup for Bot5](#Setup-for-Bot5)
2. [Methods for Peripherals](#methods-for-peripherals)
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
    - [Peripheral 17 - Ultrasonic](#peripheral-17---ultrasonic)

## Setup for Bot5

```js
// create bot5
var bot5 = new Bot5()

// connect to BLE device, serviceUuid: unique number used to identify services and attributes
bot5.connect(serviceUuid)

// disconnect from BLE device
bot5.disconnect()

// returns whether the device is connected
bot5.isConnected()
```
- in the examples, setup is done for you in index.html
- serviceUuid is defined as "417c891e-f837-4a72-a097-ed1a8c4a4840"

## Methods for Peripherals

### Peripheral 0 - General

To be implemented.

### Peripheral 1 - Motors

```js
// speed should be 0~127 for all
bot5.motor.forward(speed)
bot5.motor.back(speed)
bot5.motor.left(speed)
bot5.motor.right(speed)
bot5.motor.turnleft(speed)
bot5.motor.turnright(speed)
bot5.motor.stop()

// returns movement speed
bot5.motor.getMovementSpeed()

// control the speed of the four wheels independently
// frontLeft, frontRight, rearLeft, rearRight refers to the speeds of the respective wheel positions: 0~127
bot5.motor.fourWheelDrive(frontLeft, frontRight, rearLeft, rearRight)
```

### Peripheral 2 - Servos

```js
// channel: servo channel (1 or 2), angle: 0~180°
bot5.servo.setAngle(channel, angle)

// channel: servo channel (1 or 2)
bot5.servo.getAngle(channel)

// channel: servo channel (1 or 2), width: 500~2500us
bot5.servo.setPulseWidth(channel, width)

// channel: servo channel (1 or 2)
bot5.servo.getPulseWidth(channel)

// claw functions limit angles to 0~90°
// channel: servo channel (1 or 2), angle: 0~90°
bot5.servo.clawSetAngle(channel, angle)

// channel: servo channel (1 or 2)
bot5.servo.clawGetAngle(channel)

// channel: servo channel (1 or 2), width: 500~1500us
bot5.servo.clawSetPulseWidth(channel, width)

// channel: servo channel (1 or 2)
bot5.servo.clawGetPulseWidth(channel)
```

### Peripheral 3 - I2C

```js
// write data to an I2C device
bot5.i2c.setData(address, data) 

// read data from an I2C device
bot5.i2c.getData(address, quantity)
```

### Peripheral 4 - Red LED

```js
// set brightness for the onboard red LED, brightness: 0~255
bot5.led.setBrightness(brightness)

// get brightness of the red led
bot5.led.getBrightness()
```

### Peripheral 5 - Buttons

```js
// returns current state of button A
bot5.button.getStateA()

// returns current state of button B
bot5.button.getStateB()

// listens to notifications from all buttons
// listenButton is true by default
bot5.button.startListenAllButton()

// stop listening to notifications from buttons
bot5.button.stopListenAllButton()

// when listenButton is true, access state of button A and B continuously
bot5.button.a
bot5.button.b
```

### Peripheral 6 - LCD

```js
// content length cannot exceed 5
// x and y sets cursor position
// bgColor fills screen with specified color
// fontColor sets text color
// size sets text size
bot5.lcd.displayString(content, x, y, bgColor, fontColor, size)

// fills screen with bgColor
bot5.lcd.display(bgColor)
```

Predefined Colors
```js
// all predefined colors follow the format of
bot5.lcd.COLOR
// COLOR should be replaced by one of the following

BLACK: 0x0000,      /*   0,   0,   0 */
NAVY: 0x000F,      /*   0,   0, 128 */
DARKGREEN: 0x03E0,      /*   0, 128,   0 */
DARKCYAN: 0x03EF,      /*   0, 128, 128 */
MAROON: 0x7800,      /* 128,   0,   0 */
PURPLE: 0x780F,      /* 128,   0, 128 */
OLIVE: 0x7BE0,      /* 128, 128,   0 */
LIGHTGREY: 0xC618,      /* 192, 192, 192 */
DARKGREY: 0x7BEF,      /* 128, 128, 128 */
BLUE: 0x001F,      /*   0,   0, 255 */
GREEN: 0x07E0,      /*   0, 255,   0 */
CYAN: 0x07FF,      /*   0, 255, 255 */
RED: 0xF800,      /* 255,   0,   0 */
MAGENTA: 0xF81F,      /* 255,   0, 255 */
YELLOW: 0xFFE0,      /* 255, 255,   0 */
WHITE: 0xFFFF,      /* 255, 255, 255 */
ORANGE: 0xFDA0,      /* 255, 180,   0 */
GREENYELLOW: 0xB7E0,      /* 180, 255,   0 */
PINK: 0xFC9F
```

### Peripheral 7 - IMU

```js
// returns current gyroscope value
bot5.imu.getGyro()

// returns current accelerometer value
bot5.imu.getAcce()

// returns current ahrs values (pitch, yaw, roll)
bot5.imu.getAhrs()

// returns current temperature
// use with caution, might be inaccurate
bot5.imu.getTemp()

// listens notifications from gyro, acce, ahrs, and/or temp
// all true by default
bot5.imu.startListenGyro()
bot5.imu.startListenAcce()
bot5.imu.startListenAhrs()
bot5.imu.startListenTemp()

// stop listening to notifications from gyro, acce, ahrs, and/or temp
bot5.imu.stopListenGyro()
bot5.imu.stopListenAcce()
bot5.imu.stopListenAhrs()
bot5.imu.stopListenTemp()

// when listening, access gyro, acce, ahrs, and/or temp continuously
bot5.imu.gyroX
bot5.imu.gyroY
bot5.imu.gyroZ
bot5.imu.acceX
bot5.imu.acceY
bot5.imu.acceZ
bot5.imu.pitch
bot5.imu.yaw
bot5.imu.roll
bot5.imu.temp
```

### Peripheral 8 - Buzzer

```js
// volume: 0~11
bot5.buzzer.setVolume(volume)
bot5.buzzer.getVolume()

// freq in units of hz
bot5.buzzer.setTone(freq)
bot5.buzzer.getTone() 

// mute buzzer
bot5.buzzer.mute()
```

### Peripheral 9 - Infrared Transmitter

```js
// state: 1 for on, 0 for off
bot5.ir.setState(state)
bot5.ir.getState()
```

### Peripheral 10 - Microphone

To be implemented

### Power Management IC

To be implemented

### Peripheral 12 - RTC

NOTE: RTC may not work properly with BLE

```js
// hour, minute, second in 24 hour format: eg. 22 56 13
bot5.rtc.setTime(hour, minute, second)
bot5.rtc.getTime();

// weekday is an integer representing the day of the week: eg. 3
// month, date, year: eg. 3 5 2021
bot5.rtc.setDate(weekday, month, date, year)
bot5.rtc.getDate()
```

### Peripheral 13 - Grove Port

To be implemented
 
### Peripheral 14 - WiFi

To be implemented

### Peripheral 15 - Camera

To be implemented

### Peripheral 16 - ESP32

To be implemented

### Peripheral 17 - Ultrasonic

```js
// listens to notifications from ultrasonic
// listenUltrasonic is false by default
bot5.ultrasonic.startListenUltrasonic()

// stop listening to notifications from ultrasonic
bot5.ultrasonic.stopListenUltrasonic()

// when listenButton is true, access ultrasonic distance continuously
bot5.ultrasonic.distance
```

