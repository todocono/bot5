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

## Setup for Bot5


## Methods for Peripherals

### Peripheral 0 - General

To be implemented

### Peripheral 1 - Motors

**bot5.motors.forward(speed, time=0)**

Parameters:
- speed: -127~127
- time: default is 0, in units of ms

**bot5.motors.back(speed, time=0)**

Parameters:
- speed: -127~127
- time: default is 0, in units of ms

**bot5.motors.left(speed)**

Parameters:
- speed: -127~127
- time: default is 0, in units of ms

**bot5.motors.right(speed)**

Parameters:
- speed: -127~127
- time: default is 0, in units of ms

**bot5.motors.turnleft(speed)**

Parameters:
- speed: -127~127
- time: default is 0, in units of ms

**bot5.motors.turnright(speed)**

Parameters:
- speed: -127~127
- time: default is 0, in units of ms

**bot5.motors.stop()**

### Peripheral 2 - Servos

**bot5.servos.getAngle(channel)**

Parameters:
- channel: servo channel, either `1` or `2`

**bot5.servos.setAngle(channel, angle)**

Parameters:
- channel: servo channel, either `1` or `2`
- angle: 0~180 in units of degrees

### Peripheral 3 - I2C

To be implemented

### Peripheral 4 - Red LED

**bot5.led.setBrightness(brightness)**

Parameters:
- brightness: 0~255

**bot5.led.getBrightness()**

### Peripheral 5 - Buttons

**bot5.button.getStateA()**

**bot5.button.getStateB()**

### Peripheral 6 - LCD

**bot5.lcd.display(string)**

Parameters:
- string: less than or equal to 16 bytes

### Peripheral 7 - IMU

**bot5.IR.getGyro()**

**bot5.IR.getAcce()**

**bot5.IR.getAhrs()**

**bot5.IR.getTemp()**

### Peripheral 8 - Buzzer

**bot5.buzzer.setVolume(volume)**

Parameters:
- volume: 0~11

**bot5.buzzer.getVolume()**

**bot5.buzzer.setTone(freq, duration=0)**

Parameters:
- freq: in units of hz
- duration: in units of ms

**bot6.buzzer.getTone()**

**bot5.buzzer.mute()**

### Peripheral 9 - Infrared Transmitter

**bot5.IR.setState(state)**

Parameters:
- state: `0`=off, `1`=on

**bot5.IR.setState(state)**

Parameters:
- state: `0`=off, `1`=on

### Peripheral 10 - Microphone

To be implemented

### Power Management IC

To be implemented

### Peripheral 12 - RTC

To be implemented

### Peripheral 13 - Grove Port

To be implemented
 
### Peripheral 14 - WiFi

To be implemented

### Peripheral 15 - Camera

To be implemented

### Peripheral 16 - ESP32

To be implemented

