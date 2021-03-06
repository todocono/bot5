// Movement IDs
const MovementId = {
    FORWARD: 0,
    BACK: 1,
    LEFT: 2,
    RIGHT: 3,
    STOP: 4,
    TURN_LEFT: 5,
    TURN_RIGHT: 6,
    FOUR_WHEEL_CONTROL: 7
};

// Peripheral IDs
const Peri = {
    GENERAL: 0,
    MOTOR: 1,
    SERVO: 2,
    I2C: 3,
    LED: 4,
    BUTTON: 5,
    LCD: 6,
    IMU: 7,
    BUZZER: 8,
    IR: 9,
    MICROPHONE: 10,
    POWER: 11,
    RTC: 12,
    GROVE: 13,
    WIFI: 14,
    CAMERA: 15,
    EXTERN: 16,
    ULTRASONIC: 17
};

// Command IDs
const Cmd = {
    GENERAL: {
        SET_NAME: 0,
        GET_NAME: 1
    },
    MOTOR: {
        SET_MOVEMENT_SPEED: 0,
        GET_MOVEMENT_SPEED: 1,
    },
    SERVO: {
        SET_ANGLE: 0,
        GET_ANGLE: 1,
        SET_PULSE_WIDTH: 2,
        GET_PULSE_WIDTH: 3,
        CLAW_SET_ANGLE: 4,
        CLAW_GET_ANGLE: 5,
        CLAW_SET_PULSE_WIDTH: 6,
        CLAW_GET_PULSE_WIDTH: 7,
    },
    I2C: {
        SET_DATA: 0,
        GET_DATA: 1
    },
    LED: {
        SET_BRIGHTNESS: 0,
        GET_BRIGHTNESS: 1
    },
    BUTTON: {
        GET_STATE_A: 0,
        GET_STATE_B: 1,
        START_LISTEN_STATE: 2,
        STOP_LISTEN_STATE: 3
    },
    LCD: {
        DISPLAY_STRING: 0,
        DISPLAY_COLOR: 1
    },
    IMU: {
        POLL_GYRO: 0,
        POLL_ACCE: 1,
        POLL_AHRS: 2,
        POLL_TEMP: 3,
        START_LISTEN_GYRO: 4,
        START_LISTEN_ACCE: 5,
        START_LISTEN_AHRS: 6,
        START_LISTEN_TEMP: 7,
        STOP_LISTEN_GYRO: 8,
        STOP_LISTEN_ACCE: 9,
        STOP_LISTEN_AHRS: 10,
        STOP_LISTEN_TEMP: 11,
        CONFIG: 12
    },
    BUZZER: {
        SET_VOLUME: 0,
        GET_VOLUME: 1,
        SET_FREQ: 2,
        GET_FREQ: 3,
        MUTE: 4
    },
    IR: {
        SET_STATE: 0,
        GET_STATE: 1,
    },
    RTC: {
        SET_TIME: 0,
        GET_TIME: 1,
        SET_DATE: 2,
        GET_DATE: 3
    },
    MICROPHONE: 10,
    POWER: 11,
    GROVE: 13,
    WIFI: 14,
    CAMERA: 15,
    EXTERN: 16,
    ULTRASONIC: {
        START_LISTEN: 0,
        STOP_LISTEN: 1
    }
};

class Bot5 {
    constructor() {
        var self = this;
        this._p5ble = new p5ble();
        this._message = new ArrayBuffer(20);
        this._messageCount = 0;
        this._p5ble = new p5ble();
        this._isConnected = false;
        this._respCharacteristic = [];
        this._cmdCharacteristic = [];
        this._payload1Characteristic = [];
        this._payload2Characteristic = [];
        this._payload3Characteristic = [];
    }
    async connect(serviceUuid) { // Connect to BLE device
        await this._p5ble.connect(serviceUuid, this._gotCharacteristics);
        this.startNotifications();
        this._isConnected = true;
    }
    disconnect() { // Disconnect from BLE device
        this._p5ble.disconnect();
        this._isConnected = false;
    }
    isConnected() { // Return whether the device is connected
        return this._isConnected;
    }
    startNotifications() { // Start notification for characteristic
        this._p5ble.startNotifications(self._respCharacteristic, this._parseResponse);
        this._p5ble.startNotifications(self._payload1Characteristic, this._parse1);
        this._p5ble.startNotifications(self._payload2Characteristic, this._parse2);
        this._p5ble.startNotifications(self._payload3Characteristic, this._parse3);
        this._isConnected = true; // TODO: not working properly
    }
    stopNotifications() { // Stop notification for characteristic
        this._p5ble.stopNotifications(self._payload1Characteristic);
        this._p5ble.stopNotifications(self._payload2Characteristic);
        this._p5ble.stopNotifications(self._payload3Characteristic);
        this._p5ble.stopNotifications(self._respCharacteristic);
    }
    _gotCharacteristics(error, characteristics) {
        if (error) {
            console.log("error", error);
        }
        console.log(characteristics);
        self._respCharacteristic = characteristics[0];
        self._cmdCharacteristic = characteristics[1];
        self._payload1Characteristic = characteristics[2];
        self._payload2Characteristic = characteristics[3];
        self._payload3Characteristic = characteristics[4];
        // self._p5ble.startNotifications(characteristics[0], self.parseTest);
        // console.log(characteristics);
    }
    _parseResponse = ((msg) => { // Parse response message
        let view = msg;
        // parse device
        switch (view.getUint8(0)) {
            case Peri.GENERAL: {
                break;
            }
            case Peri.MOTOR: {
                switch (view.getUint8(1)) {
                    case Cmd.MOTOR.GET_MOVEMENT_SPEED: {
                        this.motor.movementId = view.getUint8(3);
                        this.motor.speed = view.getInt8(4);
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            case Peri.SERVO: {
                switch (view.getUint8(1)) {
                    case Cmd.SERVO.GET_ANGLE: {
                        let channel = view.getUint8(3);
                        this.servo.angle[channel] = view.getUint8(4);
                        break;
                    }
                    case Cmd.SERVO.GET_PULSE_WIDTH: {
                        let channel = view.getUint8(3);
                        this.servo.pulseWidth[channel] = view.getUint16(4);
                        break;
                    }
                }
                break;
            }
            case Peri.I2C: {
                // TODO
            }
            case Peri.LED: {
                switch (view.getUint(1)) {
                    case Cmd.LED.GET_BRIGHTNESS: {
                        this.led.brightness = view.getUint(3);
                        break;
                    }
                }
                break;
            }
            case Peri.BUTTON: {
                switch (view.getUint8(1)) {
                    case Cmd.BUTTON.GET_STATE_A: {
                        this.button.a = view.getUint8(3);
                        break;
                    }
                    case Cmd.BUTTON.GET_STATE_B: {
                        console.log(view.getUint8(3));
                        this.button.b = view.getUint8(3);
                        break;
                    }
                }
                break;
            }
            case Peri.LCD: {
                break;
            }
            case Peri.IMU: {
                switch (view.getUint8(1)) {
                    case (Cmd.IMU.POLL_GYRO): {
                        this.imu.gyroX = view.getFloat32(3, true);
                        this.imu.gyroY = view.getFloat32(7, true);
                        this.imu.gyroZ = view.getFloat32(11, true);
                        console.log("Gyro");
                        console.log(view.getFloat32(3, true),
                            view.getFloat32(7, true),
                            view.getFloat32(11, true));
                        break;
                    }
                    case (Cmd.IMU.POLL_ACCE): {
                        this.imu.acceX = view.getFloat32(3, true);
                        this.imu.acceY = view.getFloat32(7, true);
                        this.imu.acceZ = view.getFloat32(11, true);
                        break;
                    }
                    case (Cmd.IMU.POLL_AHRS): {
                        this.imu.pitch = view.getFloat32(3, true);
                        this.imu.roll = view.getFloat32(7, true);
                        this.imu.yaw = view.getFloat32(11, true);
                        break;
                    }
                    case (Cmd.IMU.POLL_TEMP): {
                        this.imu.temp = view.getFloat32(3, true);
                        break;
                    }
                }
                break;
            }
            case Peri.BUZZER: {
                switch (view.getUint8(1)) {
                    case Cmd.BUZZER.GET_VOLUME: {
                        this.buzzer.volume = view.getUint8(3);
                        break;
                    }
                    case Cmd.BUZZER.GET_FREQ: {
                        this.buzzer.freq = view.getUint16(3, true);
                        this.buzzer.duration = view.getUint32(5, true);
                        break;
                    }
                }
                break;
            }
            case Peri.IR: {
                switch (view.getUint8(1)) {
                    case Cmd.IR.GET_STATE: {
                        this.ir.state = view.getUint8(3);
                        break;
                    }
                }
                break;
            }
            case Peri.RTC: {
                switch (view.getUint8(1)) {
                    case (Cmd.RTC.GET_TIME): {
                        this.rtc.hour = view.getUint8(3);
                        this.rtc.minute = view.getUint8(4);
                        this.rtc.second = view.getUint8(5);
                        console.log("RTC");
                        console.log(view.getUint8(3),
                            view.getUint8(4),
                            view.getUint8(5));
                        break;
                    }
                    case (Cmd.RTC.GET_DATE): {
                        this.rtc.weekday = view.getUint8(3);
                        this.rtc.month = view.getUint8(4);
                        this.rtc.date = view.getUint8(5);
                        this.rtc.year = view.getUint16(7, true);
                        console.log("RTC");
                        console.log(view.getUint8(3),
                            view.getUint8(4),
                            view.getUint8(5),
                            view.getUint16(7, true));
                        break;
                    }
                }
            }
            default:
                break;
        }
    }).bind(this);
    _parse1 = ((msg) => {
        this.imu.gyroX = msg.getFloat32(0, true);
        this.imu.gyroY = msg.getFloat32(4, true);
        this.imu.gyroZ = msg.getFloat32(8, true);
        this.button.a = msg.getUint8(12);
        this.button.b = msg.getUint8(13);
    }).bind(this);
    _parse2 = ((msg) => {
        this.imu.acceX = msg.getFloat32(0, true);
        this.imu.acceY = msg.getFloat32(4, true);
        this.imu.acceZ = msg.getFloat32(8, true);
        this.ultrasonic.distance = msg.getFloat32(12, true);
    }).bind(this);
    _parse3 = ((msg) => {
        this.imu.pitch = msg.getFloat32(0, true);
        this.imu.roll = msg.getFloat32(4, true);
        this.imu.yaw = msg.getFloat32(8, true);
        this.imu.temp = msg.getFloat32(12, true)
    }).bind(this);

    motor = {
        forward: (speed) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, MovementId.FORWARD);
            v.setInt8(4, speed);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        back: (speed) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, MovementId.BACK);
            v.setInt8(4, speed);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        left: (speed) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, MovementId.LEFT);
            v.setInt8(4, speed);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        right: (speed) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, MovementId.RIGHT);
            v.setInt8(4, speed);
            this._p5ble.write(self._cmdCharacteristic, msg);

        },
        turnLeft: (speed) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, MovementId.TURN_LEFT);
            v.setInt8(4, speed);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        turnRight: (speed) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, MovementId.TURN_RIGHT);
            v.setInt8(4, speed);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        stop: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, MovementId.STOP);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getMovementSpeed: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.GET_MOVEMENT_SPEED);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        fourWheelDrive: (frontLeft, frontRight, rearLeft, rearRight) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, MovementId.FOUR_WHEEL_CONTROL);
            v.setInt8(4, 0);
            v.setInt8(5, frontLeft);
            v.setInt8(6, frontRight);
            v.setInt8(7, rearLeft);
            v.setInt8(8, rearRight);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        speed: 0,
        movementId: 0
    };
    servo = {
        setAngle: (channel, angle) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.SERVO);
            v.setUint8(1, Cmd.SERVO.SET_ANGLE);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, channel);
            v.setUint8(4, angle);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getAngle: (channel) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.SERVO);
            v.setUint8(1, Cmd.SERVO.GET_ANGLE);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, channel);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        setPulseWidth: (channel, width) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.SERVO);
            v.setUint8(1, Cmd.SERVO.SET_PULSE_WIDTH);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, channel);
            v.setUint16(4, width, true);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getPulseWidth: (channel) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.SERVO);
            v.setUint8(1, Cmd.SERVO.GET_PULSE_WIDTH);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, channel);
            this._p5ble.write(self._cmdCharacteristic, msg);

        },
        clawSetAngle: (channel, angle) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.SERVO);
            v.setUint8(1, Cmd.SERVO.CLAW_SET_ANGLE);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, channel);
            v.setUint8(4, angle);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        clawGetAngle: (channel) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.SERVO);
            v.setUint8(1, Cmd.SERVO.CLAW_GET_ANGLE);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, channel);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        clawSetPulseWidth: (channel, width) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.SERVO);
            v.setUint8(1, Cmd.SERVO.CLAW_SET_PULSE_WIDTH);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, channel);
            v.setUint16(4, width, true);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        clawGetPulseWidth: (channel) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.SERVO);
            v.setUint8(1, Cmd.SERVO.CLAW_GET_PULSE_WIDTH);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, channel);
            this._p5ble.write(self._cmdCharacteristic, msg);

        },
        angle: [0, 0],
        pulseWidth: [0, 0],
        clawAngle: [0, 0],
        clawPulseWidth: [0, 0]
    };
    i2c = {
        setData: (address, data) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.I2C);
            v.setUint8(1, Cmd.I2C.SET_DATA);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, address);
            v.setUint8(4, data);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getData: (address, quantity) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.I2C);
            v.setUint8(1, Cmd.I2C.GET_DATA);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, address);
            v.setUint8(4, quantity);
            this._p5ble.write(self._cmdCharacteristic, msg);
        }

    };
    led = {
        setBrightness: (brightness) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.LED);
            v.setUint8(1, Cmd.LED.SET_BRIGHTNESS);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, brightness);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getBrightness: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.LED);
            v.setUint8(1, Cmd.LED.GET_BRIGHTNESS);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        brightness: 0
    };
    button = {
        getStateA: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.BUTTON);
            v.setUint8(1, Cmd.BUTTON.GET_STATE_A);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getStateB: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.BUTTON);
            v.setUint8(1, Cmd.BUTTON.GET_STATE_B);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        startListenAllButton: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.BUTTON);
            v.setUint8(1, Cmd.BUTTON.START_LISTEN_STATE);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        stopListenAllButton: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.BUTTON);
            v.setUint8(1, Cmd.BUTTON.STOP_LISTEN_STATE);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        a: 0,
        b: 0
    };
    lcd = {
        displayString: (content, x, y, bgColor, fontColor, size) => {
            if (content.length > 5) {
                console.log("String too long!");
                return;
            }
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.LCD);
            v.setUint8(1, Cmd.LCD.DISPLAY_STRING);
            v.setUint8(2, self._messageCount++);
            var i;
            for (i = 0; i < content.length; ++i) {
                v.setUint8(3 + i, content.charCodeAt(i));
            }
            v.setUint8(3 + i, 0); // null character at end of string
            v.setUint16(9, x, true);
            v.setUint16(11, y, true);
            v.setUint16(13, bgColor, true);
            v.setUint16(17, fontColor, true);
            v.setUint8(19, size);
            console.log(msg);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        displayColor: (bgColor) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.LCD);
            v.setUint8(1, Cmd.LCD.DISPLAY_COLOR);
            v.setUint8(2, self._messageCount++);
            v.setUint32(3, bgColor, true);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
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
    };
    imu = {
        getGyro: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.POLL_GYRO);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getAcce: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.POLL_ACCE);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getAhrs: () => {

            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.POLL_AHRS);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getTemp: () => {

            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.POLL_TEMP);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        startListenGyro: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.START_LISTEN_GYRO);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        startListenAcce: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.START_LISTEN_ACCE);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        startListenAhrs: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.START_LISTEN_AHRS);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        startListenTemp: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.START_LISTEN_TEMP);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        stopListenGyro: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.STOP_LISTEN_GYRO);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        stopListenAcce: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.STOP_LISTEN_ACCE);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        stopListenAhrs: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.STOP_LISTEN_AHRS);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        stopListenTemp: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.STOP_LISTEN_TEMP);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        gyroX: 0,
        gyroY: 0,
        gyroZ: 0,
        acceX: 0,
        acceY: 0,
        acceZ: 0,
        pitch: 0,
        yaw: 0,
        roll: 0,
        temp: 0

    };
    buzzer = {
        setVolume: (volume) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.BUZZER);
            v.setUint8(1, Cmd.BUZZER.SET_VOLUME);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, volume);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getVolume: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.BUZZER);
            v.setUint8(1, Cmd.BUZZER.GET_VOLUME);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        setTone: (freq) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.BUZZER);
            v.setUint8(1, Cmd.BUZZER.SET_FREQ);
            v.setUint8(2, self._messageCount++);
            v.setUint16(3, freq, true);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getTone: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.BUZZER);
            v.setUint8(1, Cmd.BUZZER.GET_FREQ);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        mute: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.BUZZER);
            v.setUint8(1, Cmd.BUZZER.MUTE);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        volume: 0,
        freq: 0,
        duration: 0
    };
    ir = {
        setState: (state) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IR);
            v.setUint8(1, Cmd.IR.SET_STATE);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, state);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getState: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.IR);
            v.setUint8(1, Cmd.IR.GET_STATE);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        state: 0
    };
    rtc = {
        setTime: (hour, minute, second) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.RTC);
            v.setUint8(1, Cmd.RTC.SET_TIME);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, hour);
            v.setUint8(4, minute);
            v.setUint8(5, second);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getTime: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.RTC);
            v.setUint8(1, Cmd.RTC.GET_TIME);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        setDate: (weekday, month, date, year) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.RTC);
            v.setUint8(1, Cmd.RTC.SET_TIME);
            v.setUint8(2, self._messageCount++);
            v.setUint8(3, weekday);
            v.setUint8(4, month);
            v.setUint8(5, date);
            v.setUint16(7, year, true);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getDate: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.RTC);
            v.setUint8(1, Cmd.RTC.GET_DATE);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        hour: 0,
        minute: 0,
        second: 0,
        weekday: 0,
        month: 0,
        date: 0,
        year: 0
    };
    ultrasonic = {
        startListenUltrasonic : () => {
            console.log("Warning: Ultrasonic is a blocking function, which might\
                         lead to inaccurate IMU readings. Use with caution");
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.ULTRASONIC);
            v.setUint8(1, Cmd.ULTRASONIC.START_LISTEN);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        stopListenUltrasonic : () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.ULTRASONIC);
            v.setUint8(1, Cmd.ULTRASONIC.STOP_LISTEN);
            v.setUint8(2, self._messageCount++);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        distance: 0
    };
}