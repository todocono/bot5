import { p5ble } from "../p5ble/dist/p5.ble.js";
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

// Payload 
const Payload = {
}

class Bot5 {
    constructor() {
        this._p5ble = new p5ble();
        this._message = new ArrayBuffer(20);
        this._messageCount = 0;
        this._p5ble = new p5ble();
        this._isConnected = false;
        this._respCharacteristic;
        this._cmdCharacteristic;
    }
    connect(serviceUuid) { // Connect to BLE device
        this._p5ble.connect(serviceUuid, this._gotCharacteristics);
        this._isConnected = true;
    }
    _gotCharacteristics(error, characteristics) {
        if (error) {
            console.log(error);
        }
        this._respCharacteristic = characteristics[0];
        this._cmdCharacteristic = characteristics[1];
    }
    disconnect() { // Disconnect from BLE device
        this._p5ble.disconnect();
        this._isConnected = false;
    }
    isConnected() { // Return whether the device is connected
        return this._isConnected;
    }
    _parseResponse() { // Parse response message
    }
    startNotification() { // Start notification for characteristic
    }
    stopNotification() { // Stop notification for characteristic
    }

    motors = {
        forward: (speed) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, MovementId.FORWARD);
            v.setInt8(4, speed);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        back: (speed) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, MovementId.BACK);
            v.setInt8(4, speed);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        left: (speed) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, MovementId.LEFT);
            v.setInt8(4, speed);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        right: (speed) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, MovementId.RIGHT);
            v.setInt8(4, speed);
            this._p5ble.write(this._cmdCharacteristic, msg);

        },
        turnLeft: (speed) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, MovementId.TURN_LEFT);
            v.setInt8(4, speed);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        turnRight: (speed) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, MovementId.TURN_RIGHT);
            v.setInt8(4, speed);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        stop: () => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.SET_MOVEMENT_SPEED);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, MovementId.STOP);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        getMovementSpeed: () => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.MOTOR);
            v.setUint8(1, Cmd.MOTOR.GET_MOVEMENT_SPEED);
            v.setUint8(2, this._messageCount++);
            this._p5ble.write(this._cmdCharacteristic, msg);
        }
    };
    servos = {
        setAngle: (channel, angle) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.SERVO);
            v.setUint8(1, Cmd.SERVO.SET_ANGLE);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, channel);
            v.setUint8(4, angle);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        getAngle: (channel) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.SERVO);
            v.setUint8(1, Cmd.SERVO.GET_ANGLE);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, channel);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        setPulseWidth: (channel, width) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.SERVO);
            v.setUint8(1, Cmd.SERVO.SET_PULSE_WIDTH);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, channel);
            v.setUint16(4, width);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        getPulseWidth: (channel) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.SERVO);
            v.setUint8(1, Cmd.SERVO.GET_PULSE_WIDTH);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, channel);
            this._p5ble.write(this._cmdCharacteristic, msg);

        }
    };
    i2c = {
        setData: (address, data) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.I2C);
            v.setUint8(1, Cmd.I2C.SET_DATA);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, address);
            v.setUint8(4, data);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        getData: (address, quantity) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.I2C);
            v.setUint8(1, Cmd.I2C.GET_DATA);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, address);
            v.setUint8(4, quantity);
            this._p5ble.write(this._cmdCharacteristic, msg);
        }

    };
    led = {
        setBrightness: (brightness) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.LED);
            v.setUint8(1, Cmd.LED.SET_BRIGHTNESS);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, brightness);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        getBrightness: () => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.LED);
            v.setUint8(1, Cmd.LED.GET_BRIGHTNESS);
            v.setUint8(2, this._messageCount++);
            this._p5ble.write(this._cmdCharacteristic, msg);
        }
    };
    button = {
        getStateA: () => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.BUTTON);
            v.setUint8(1, Cmd.BUTTON.GET_STATE_A);
            v.setUint8(2, this._messageCount++);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        getStateB: () => {

            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.BUTTON);
            v.setUint8(1, Cmd.BUTTON.GET_STATE_B);
            v.setUint8(2, this._messageCount++);
            this._p5ble.write(this._cmdCharacteristic, msg);
        }
    };
    lcd = { // TODO: modify esp code
        display: (input) => {
        }
    };
    imu = {
        getGyro: () => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.POLL_GYRO);
            v.setUint8(2, this._messageCount++);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        getAcce: () => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.POLL_ACCE);
            v.setUint8(2, this._messageCount++);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        getAhrs: () => {

            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.POLL_AHRS);
            v.setUint8(2, this._messageCount++);
            this._p5ble.write(this._cmdCharacteristic, msg);
         },
        getTemp: () => { 

            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.IMU);
            v.setUint8(1, Cmd.IMU.POLL_TEMP);
            v.setUint8(2, this._messageCount++);
            this._p5ble.write(this._cmdCharacteristic, msg);
        }

    };
    buzzer = {
        setVolume: (volume) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.BUZZER);
            v.setUint8(1, Cmd.BUZZER.SET_VOLUME);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, volume);
            this._p5ble.write(this._cmdCharacteristic, msg);
         },
        getVolume: () => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.BUZZER);
            v.setUint8(1, Cmd.BUZZER.GET_VOLUME);
            v.setUint8(2, this._messageCount++);
            this._p5ble.write(this._cmdCharacteristic, msg);
         },
        setTone: (freq, duration) => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.BUZZER);
            v.setUint8(1, Cmd.BUZZER.SET_FREQ_DURATION);
            v.setUint8(2, this._messageCount++);
            v.setUint16(3, freq);
            v.setUint32(5, duration);
            this._p5ble.write(this._cmdCharacteristic, msg);
         },
        getTone: () => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.BUZZER);
            v.setUint8(1, Cmd.BUZZER.GET_FREQ_DURATION);
            v.setUint8(2, this._messageCount++);
            this._p5ble.write(this._cmdCharacteristic, msg);
         },
        mute: () => { 
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.BUZZER);
            v.setUint8(1, Cmd.BUZZER.MUTE);
            v.setUint8(2, this._messageCount++);
            this._p5ble.write(this._cmdCharacteristic, msg);
        }
    };
    ir = {
        setState: (state) => { 
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.IR);
            v.setUint8(1, Cmd.IR.SET_STATE);
            v.setUint8(2, this._messageCount++);
            v.setUint8(3, state);
            this._p5ble.write(this._cmdCharacteristic, msg);
        },
        getState: () => {
            msg = new ArrayBuffer(20);
            v = new DataView(msg);
            v.setUint8(0, Peri.IR);
            v.setUint8(1, Cmd.IR.GET_STATE);
            v.setUint8(2, this._messageCount++);
            this._p5ble.write(this._cmdCharacteristic, msg);
         }
    };
}

