// import { p5ble } from "../p5ble/dist/p5.ble.js";
// Movement IDs
const MovementId = {
    FORWARD: 0,
    BACK: 1,
    LEFT: 2,
    RIGHT: 3,
    STOP: 4,
    TURN_LEFT: 5,
    TURN_RIGHT: 6
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
    EXTERN: 16
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
        GET_PULSE_WIDTH: 3
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
    },
    LCD: {
        GEN_QR_CODE: 0
    },
    IMU: {
        POLL_GYRO: 0,
        POLL_ACCE: 1,
        POLL_AHRS: 2,
        POLL_TEMP: 3,
        CONFIG: 4
    },
    BUZZER: {
        SET_VOLUME: 0,
        GET_VOLUME: 1,
        SET_FREQ_DURATION: 2,
        GET_FREQ_DURATION: 3,
        MUTE: 4
    },
    IR: {
        SET_STATE: 0,
        GET_STATE: 1,
    },
    // TODO
    MICROPHONE: 10,
    POWER: 11,
    RTC: 12,
    GROVE: 13,
    WIFI: 14,
    CAMERA: 15,
    EXTERN: 16
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

        console.log("bot initialized.");
    }
    connect(serviceUuid) { // Connect to BLE device
        console.log(this.motor.movementId);
        this._p5ble.connect(serviceUuid, this._gotCharacteristics);
    }
    disconnect() { // Disconnect from BLE device
        this._p5ble.disconnect();
        this._isConnected = false;
    }
    isConnected() { // Return whether the device is connected
        return this._isConnected;
    }
    startNotifications() { // Stop notification for characteristic
        this._p5ble.startNotifications(self._respCharacteristic, this._parseResponse);
        this._isConnected = true; // TODO: not working properly
    }
    stopNotifications() { // Stop notification for characteristic
        this._p5ble.stopNotifications(self._respCharacteristic);
    }
    _gotCharacteristics(error, characteristics) {
        if (error) {
            console.log("error", error);
        }
        self._respCharacteristic = characteristics[0];
        self._cmdCharacteristic = characteristics[1];
        // self._p5ble.startNotifications(characteristics[0], self.parseTest);
        // console.log(characteristics);
    }

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
        angle: [0, 0],
        pulseWidth: [0, 0]
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
        a: 0,
        b: 0
    };
    lcd = { // TODO: modify esp code
        display: (input) => {
        }
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
        setTone: (freq, duration) => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.BUZZER);
            v.setUint8(1, Cmd.BUZZER.SET_FREQ_DURATION);
            v.setUint8(2, self._messageCount++);
            v.setUint16(3, freq, true);
            v.setUint32(5, duration, true);
            this._p5ble.write(self._cmdCharacteristic, msg);
        },
        getTone: () => {
            let msg = new ArrayBuffer(20);
            let v = new DataView(msg);
            v.setUint8(0, Peri.BUZZER);
            v.setUint8(1, Cmd.BUZZER.GET_FREQ_DURATION);
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
                    case Cmd.BUZZER.GET_FREQ_DURATION: {
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
            default:
                break;
        }
    }).bind(this);
}