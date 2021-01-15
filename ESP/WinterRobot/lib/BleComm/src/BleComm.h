// Header for BleComm, an Ble protocol for WinterRobot
#ifndef BLE_COMM_H
#define BLE_COMM_H

#include <Arduino.h>
#include <BLE2902.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEService.h>
#include <BLEUtils.h>

#include "RoverC.h"

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

#define LED_PIN 10

/**
 * @brief Message struct 
 * 
 */
#pragma pack(1) // use pack to guarantee that the struct are packed

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
    uint16_t width;
} PAYLOAD_CMD_SERVO_SET_PULSE_WIDTH, PAYLOAD_RESP_SERVO_GET_PULSE_WIDTH;

typedef struct
{
    uint8_t address;
    uint16_t data;
} PAYLOAD_CMD_I2C_SET_DATA, PAYLOAD_RESP_I2C_GET_DATA;

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
    bool state;
} PAYLOAD_RESP_BUTTON_STATE_A, PAYLOAD_RESP_BUTTON_STATE_B;

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
    bool state;
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
    PERI_TEMPERATURE,
    PERI_BUZZER,
    PERI_IR,
    PERI_MICROPHONE,
    PERI_POWER,
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

enum RESP_GENERAL {
    RESP_GENERAL_GET_NAME = 0
};

enum CMD_MOTOR {
    CMD_MOTOR_SET_MOVEMENT_SPEED = 0,
    CMD_MOTOR_GET_MOVEMENT_SPEED
};

enum RESP_MOTOR {
    RESP_MOTOR_GET_MOVEMENT_SPEED = 0
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

enum RESP_SERVO {
    RESP_SERVO_GET_ANGLE = 0,
    RESP_SERVO_GET_PULSE_WIDTH
};

enum CMD_I2C {
    CMD_I2C_SET_DATA = 0,
    CMD_I2C_GET_DATA
};

enum RESP_I2C {
    RESP_I2C_GET_DATA = 0
};

enum CMD_LED {
    CMD_LED_SET_BRIGHTNESS = 0,
    CMD_LED_GET_BRIGHTNESS
};

enum RESP_LED {
    RESP_LED_GET_BRIGHTNESS = 0
};

enum CMD_BUTTON {
    CMD_BUTTON_GET_STATE_A = 0,
    CMD_BUTTON_GET_STATE_B
};

enum RESP_BUTTON {
    RESP_BUTTON_GET_STATE_A = 0,
    RESP_BUTTON_GET_STATE_B
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

enum RESP_IMU {
    RESP_IMU_GET_GYRO = 0,
    RESP_IMU_GET_ACCE,
    RESP_IMU_GET_AHRS,
    RESP_IMU_GET_TEMP
};

enum CMD_BUZZER {
    CMD_BUZZER_SET_VOLUME = 0,
    CMD_BUZZER_GET_VOLUME,
    CMD_BUZZER_SET_FREQ_DURATION,
    CMD_BUZZER_GET_FREQ_DURATION,
    CMD_BUZZER_MUTE
};

enum RESP_BUZZER {
    RESP_BUZZER_GET_VOLUME = 0,
    RESP_BUZZER_GET_FREQ_DURATION
};

enum CMD_IR {
    CMD_IR_SET_STATE = 0,
    CMD_IR_GET_STATE
};

enum RESP_IR {
    RESP_IR_GET_STATE = 0,
};

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
    BLEServer *pServer = NULL;

    // Service
    BLEService *pIdentityService;
    BLEService *pDevInfoService;
    BLEService *pCmdService;

    // Characteristics
    BLECharacteristic *pRespCharacteristic;
    BLECharacteristic *pCMDCharacteristic;

    // MISC
    static bool deviceConnected;
    static bool oldDeviceConnected;
    static unsigned int messageCount;

   public:
    BleComm();
    ~BleComm();
    int start();
    bool isConnected();
    MESSAGE *genMsg(int dev, int characteristic, char **params);
    int sendMsg(MESSAGE *msg);
    int recvMsg();
};

// Server Callbacks
class ServerCallbacks : public BLEServerCallbacks {
    void onConnect(BLEServer *pServer) {
    }
    void onDisconnect() {
    }
};

// Identity Service Callbacks
class GetIdServiceCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
        // TODO: handle incoming messages
        uint8_t *data = pCharacteristic->getData();
    }
};

// CMD Characteristic Callbacks
class CMDCharacteristicCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic);
};

// Rx Characteristic Callbacks
class RxCharacteristicCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic);
};

#endif  // BLE_COMM_H
