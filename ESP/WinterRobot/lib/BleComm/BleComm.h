// Header for BleComm, an Ble protocol for WinterRobot
#ifndef BLE_COMM_H
#define BLE_COMM_H

#include <Arduino.h>
#include <BLE2902.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEService.h>
#include <BLEUtils.h>
#include <GeneralUtils.h>

#include "RoverC.h"
#include "esp32-hal-log.h"

// Pre-defined UUIDs.
// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

// Identity Service
#define IDENTITY_SERVICE_UUID "a060821e-54d1-11eb-ae93-0242ac130002"  // UART service UUID

// Dev info Service
#define DEV_INFO_SERVICE_UUID "ad505ba2-54d1-11eb-ae93-0242ac130002"  // UART service UUID

// CMD Service
#define CMD_SERVICE_UUID "f6a44d18-6e45-4630-b85e-da3817f10edd"            // UART service UUID
#define CMD_CHARACTERISTIC_TX_UUID "f6a44d18-6e45-4631-b85e-da3817f10edd"  // UART service UUID
#define CMD_CHARACTERISTIC_RX_UUID "f6a44d18-6e45-4632-b85e-da3817f10edd"  // UART service UUID

// Pin Definition
#define IR_TX_PIN 9
#define LED_PIN 10
#define LED_FREQ 5000
#define LED_RESOLUTION 8
#define LED_CHANNEL 2

// Debug Flag
#define DEBUG_RAW_OUTPUT true
#define DEBUG_GENERAL    false
#define DEBUG_MOTOR      true 
#define DEBUG_SERVO      false 
#define DEBUG_I2C        false
#define DEBUG_LED        false
#define DEBUG_BUTTON     false
#define DEBUG_LCD        false
#define DEBUG_IMU        false
#define DEBUG_BUZZER     false
#define DEBUG_IR         false
#define DEBUG_MICROPHONE false
#define DEBUG_POWER      false
#define DEBUG_GROVE      false
#define DEBUG_WIFI       false
#define DEBUG_CAMERA     false
#define DEBUG_EXTERN     false

/**
 * @brief Message struct 
 * 
 */
#pragma pack(1)  // use pack to guarantee that the struct are packed

typedef struct
{
    uint8_t peripheral;   // device id
    uint8_t cmd;          // command index
    uint8_t count;        // message id
    uint8_t payload[16];  // payload
    uint8_t chksm;        // checksum
} MESSAGE;
/**
 * @brief Payload struct
 * 
 */
typedef struct
{
    char name[16];
} PAYLOAD_CMD_GENERAL_SET_NAME, PAYLOAD_RESP_GENERAL_GET_NAME;

typedef struct
{
    uint8_t movement_id;
    int8_t speed;
} PAYLOAD_CMD_MOTOR_SET_MOVEMENT_SPEED, PAYLOAD_RESP_MOTOR_GET_MOVEMENT_SPEED;

typedef struct
{
    uint8_t channel;
    uint8_t angle;
} PAYLOAD_CMD_SERVO_SET_ANGLE, PAYLOAD_RESP_SERVO_GET_ANGLE;

typedef struct
{
    uint8_t channel;
} PAYLOAD_CMD_SERVO_GET_ANGLE, PAYLOAD_CMD_SERVO_GET_PULSE_WIDTH;

typedef struct
{
    uint8_t channel;
    uint16_t width;
} PAYLOAD_CMD_SERVO_SET_PULSE_WIDTH, PAYLOAD_RESP_SERVO_GET_PULSE_WIDTH;

typedef struct
{
    uint8_t address;
    uint32_t data;
} PAYLOAD_CMD_I2C_SET_DATA, PAYLOAD_RESP_I2C_GET_DATA;

typedef struct
{
    uint8_t address;
    uint8_t quantity;
} PAYLOAD_CMD_I2C_GET_DATA;

typedef struct
{
    uint8_t brightness;
} PAYLOAD_CMD_LED_SET_BRIGHTNESS, PAYLOAD_RESP_LED_GET_BRIGHTNESS;

typedef struct
{
    char name[16];
} PAYLOAD_NAME;

typedef struct
{
    uint8_t state;
} PAYLOAD_RESP_BUTTON_STATE;

typedef struct
{
    char url[10];
    uint16_t x;
    uint16_t y;
    uint8_t width;
    uint8_t version;
} PAYLOAD_CMD_GEN_QR_CODE;

typedef struct
{
    float_t gyroX;
    float_t gyroY;
    float_t gyroZ;
} PAYLOAD_RESP_IMU_GYRO;

typedef struct
{
    float_t acceX;
    float_t acceY;
    float_t acceZ;
} PAYLOAD_RESP_IMU_ACCE;

typedef struct
{
    float_t pitch;
    float_t roll;
    float_t yaw;
} PAYLOAD_RESP_IMU_AHRS;

typedef struct
{
    float_t temp;
} PAYLOAD_RESP_IMU_TEMP;

typedef struct
{
    uint8_t volume;
} PAYLOAD_CMD_BUZZER_SET_VOLUME, PAYLOAD_RESP_BUZZER_GET_VOLUME;

typedef struct
{
    uint16_t freq;
    uint32_t duration;
} PAYLOAD_CMD_BUZZER_SET_FREQ_DURATION, PAYLOAD_RESP_BUZZER_GET_FREQ_DURATION;

typedef struct
{
    uint8_t state;
} PAYLOAD_CMD_IR_SET_STATE, PAYLOAD_RESP_IR_GET_STATE;

#pragma pack()

/**
 * @brief Device ID
 */

enum PERI_ID {
    PERI_GENERAL = 0,
    PERI_MOTOR,
    PERI_SERVO,
    PERI_I2C,
    PERI_LED,
    PERI_BUTTON,
    PERI_LCD,
    PERI_IMU,
    PERI_BUZZER,
    PERI_IR,
    PERI_MICROPHONE,
    PERI_POWER,
    PERI_RTC,
    PERI_GROVE,
    PERI_WIFI,
    PERI_CAMERA,
    PERI_EXTERN
};

/**
 * @brief Command and response IDs
 */

enum CMD_GENERAL {
    CMD_GENERAL_SET_NAME = 0,
    CMD_GENERAL_GET_NAME
};

enum CMD_MOTOR {
    CMD_MOTOR_SET_MOVEMENT_SPEED = 0,
    CMD_MOTOR_GET_MOVEMENT_SPEED
};

enum MOTOR_MOVEMENT_ID {
    MOTOR_MOVEMENT_FORWARD = 0,
    MOTOR_MOVEMENT_BACK,
    MOTOR_MOVEMENT_LEFT,
    MOTOR_MOVEMENT_RIGHT,
    MOTOR_MOVEMENT_STOP,
    MOTOR_MOVEMENT_TURN_LEFT,
    MOTOR_MOVEMENT_TURN_RIGHT
};

enum CMD_SERVO {
    CMD_SERVO_SET_ANGLE = 0,
    CMD_SERVO_GET_ANGLE,
    CMD_SERVO_SET_PULSE_WIDTH,
    CMD_SERVO_GET_PULSE_WIDTH
};

enum CMD_I2C {
    CMD_I2C_SET_DATA = 0,
    CMD_I2C_GET_DATA
};

enum CMD_LED {
    CMD_LED_SET_BRIGHTNESS = 0,
    CMD_LED_GET_BRIGHTNESS
};

enum CMD_BUTTON {
    CMD_BUTTON_GET_STATE_A = 0,
    CMD_BUTTON_GET_STATE_B
};

enum CMD_LCD {
    CMD_LCD_GEN_QR_CODE = 0
};

enum CMD_IMU {
    CMD_IMU_POLL_GYRO = 0,
    CMD_IMU_POLL_ACCE,
    CMD_IMU_POLL_AHRS,
    CMD_IMU_POLL_TEMP,
    CMD_IMU_CONFIG
};

enum CMD_BUZZER {
    CMD_BUZZER_SET_VOLUME = 0,
    CMD_BUZZER_GET_VOLUME,
    CMD_BUZZER_SET_FREQ_DURATION,
    CMD_BUZZER_GET_FREQ_DURATION,
    CMD_BUZZER_MUTE
};

enum CMD_IR {
    CMD_IR_SET_STATE = 0,
    CMD_IR_GET_STATE
};

// TODO: Define packages for microphone, power, RTC, 
// Grove, WiFi, Camera and extern ESP32.

// ERRONO
enum ERRONO {
};

/**
 * @brief BLE Communication class
 * 
 */
class BleComm {
   private:
    // Server
    // MISC

   public:
    BleComm();
    ~BleComm();
    int start();
    bool isConnected();
    static void printMessage(MESSAGE* msg);
};

// Server Callbacks
class ServerCallbacks : public BLEServerCallbacks {
    void onConnect(BLEServer *pServer);
    void onDisconnect();
};

// Identity Service Callbacks
class GetIdServiceCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
        // TODO: handle incoming messages
    }
};

// CMD Characteristic Callbacks
class CMDCharacteristicCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic);
};

// Rx Characteristic Callbacks
class RxCharacteristicCallbacks : public BLECharacteristicCallbacks {
    void onNotify(BLECharacteristic *pCharacteristic);
};

#endif  // BLE_COMM_H

// MISC
// void ledcAnalogWrite(uint8_t channel, uint32_t value, uint32_t valueMax=255);