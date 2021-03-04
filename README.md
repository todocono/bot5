# Bot5

[P5](https://p5js.org/) + [ML5](https://ml5js.org/) + [Robot](https://m5stack.com/)

## Quick Start

Open this [p5.js web editor sketch](https://editor.p5js.org/momoe-nomoto/sketches/8lOIc2r0O) with bot5.js added.

## Examples

1. [Turtle](https://editor.p5js.org/momoe-nomoto/sketches/NCtuoo__J)

A 'bot' is shown on the on-screen canvas and by pressing keyboard keys, it will move and draw its trace. Bot5 moves with your onscreen 'bot'.

2. [Music Show](https://editor.p5js.org/momoe-nomoto/sketches/IO_mZXL61)

P5 will play an animation and a music file, and the bot will move in a pre-programmed sequence, dancing around, and clapping at the end.

3. [Space Invaders](https://editor.p5js.org/momoe-nomoto/sketches/bbOMA3S8R)

Using the IMU, we will control a video game that can be played by turning the controller and pressing a button.

4. [Burglar Alarm](https://editor.p5js.org/momoe-nomoto/sketches/qQlh8yy8r)

Using the IMU, we will play something on the screen once the accelerometer value changes.

5. [Clock Alarm](https://editor.p5js.org/momoe-nomoto/sketches/ojOgO9Vrs)

Using the buzzer and movements, bot5 will wake you up once a certain time is reached, in a similar way to Clocky. 

~~6. [No More TV](https://editor.p5js.org/momoe-nomoto/sketches/okq3yo4IE)~~

~~We can turn the bot into a moving remote control. Using the on screen joystick we will move the bot and we will use the infrared transmitter to send “OFF” commands to TVs.~~

6. [Space Exploration](https://editor.p5js.org/momoe-nomoto/sketches/2A-2txtNN)

Using an ultrasonic sensor, we will draw the surroundings on the screen as radar, and we will navigate using a control similar to Turtle.

~~8. IoT Toilette Paper Dispenser~~

~~Using a QR code on the screen, we can make a useless invention that can be accessed through the on-board web server.~~

7. [Pet Training](https://editor.p5js.org/momoe-nomoto/sketches/TCazky67P)

Using ML5 to recognize spoken commands, we will teach “stupid pet tricks” to the bot that will be performed.

8. [Dance With Me](https://editor.p5js.org/momoe-nomoto/sketches/PCEsJ2NKG)

Using ML5 to recognize pose, we will let the bot move the wheels following the hand movements.

## Bot5 API

### Setup for Bot5

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

### Motor Methods

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

### Servo Methods

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

### I2C Methods

```js
// write data to an I2C device
bot5.i2c.setData(address, data) 

// read data from an I2C device
bot5.i2c.getData(address, quantity)
```

### LED Methods

```js
// set brightness for the onboard red LED, brightness: 0~255
bot5.led.setBrightness(brightness)

// get brightness of the red led
bot5.led.getBrightness()
```

### Button Methods

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

### LCD Methods

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

#### Predefined Colors

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

### IMU Methods

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

### Buzzer Methods

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

### Infrared Transmitter Methods

```js
// state: 1 for on, 0 for off
bot5.ir.setState(state)
bot5.ir.getState()
```

### RTC Methods

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

### Ultrasonic Methods

```js
// listens to notifications from ultrasonic
// listenUltrasonic is false by default
bot5.ultrasonic.startListenUltrasonic()

// stop listening to notifications from ultrasonic
bot5.ultrasonic.stopListenUltrasonic()

// when listenButton is true, access ultrasonic distance continuously
bot5.ultrasonic.distance
```
