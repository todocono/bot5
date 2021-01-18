import {p5ble} from "../p5ble/dist/p5.ble.js";

class Bot5 {
    constructor() {
        this._message = new ArrayBuffer(20);
        this._messageCount = 0;
        this._p5ble = new p5ble();
    }
    connect() { // Connect to BLE device
    }
    disconnect() { // Disconnect from BLE device
    }
    isConnected() { // Return whether the device is connected
    }
    startNotification() { // Start notification for characteristic
    }
    stopNotification() { // Stop notification for characteristic
    }
    sendCommand() { // Send command
    }
    parseResponse() { // Parse response message
    }
}

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

