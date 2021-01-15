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

// ERRONO
#define ERROR_NO_MESSAGE 1
#define ERROR_COMMAND_INVALID 2
#define ERROR_NO_RESPONSE 3

// Pre-defined UUIDs.
// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

// Identity Service
#define IDENTITY_SERVICE_UUID "a060821e-54d1-11eb-ae93-0242ac130002" // UART service UUID

// Dev info Service
#define DEV_INFO_SERVICE_UUID "ad505ba2-54d1-11eb-ae93-0242ac130002" // UART service UUID

// CMD Service
#define CMD_SERVICE_UUID "f6a44d18-6e45-4630-b85e-da3817f10edd"           // UART service UUID
#define CMD_CHARACTERISTIC_TX_UUID "f6a44d18-6e45-4631-b85e-da3817f10edd" // UART service UUID
#define CMD_CHARACTERISTIC_RX_UUID "f6a44d18-6e45-4632-b85e-da3817f10edd" // UART service UUID

#define LED_PIN 10

/**
 * @brief Message struct 
 * 
 */
#pragma pack(1)
typedef struct
{
    uint8_t dev;         // device id
    uint8_t cmd;         // command index
    uint8_t count;          // message id
    uint8_t content[16]; // message
    uint8_t chksm;       // checksum
} Message;

typedef struct
{
    uint8_t value;
} CONTENT_LED;


typedef struct
{
    uint8_t movement;
    uint8_t speed;
    uint32_t time;
    uint8_t servoChannel;
    bool servoState;
} CONTENT_MOTOR;

typedef struct
{
    uint8_t dev;
    uint8_t content[15];
} CONTENT_M5_STICK;

typedef struct
{
    uint16_t freq;
    uint32_t duration;
} CONTENT_BUZZER;

#pragma pack()

/**
 * @brief Device ID
 */

enum DEV_ID
{
    GENERAL = 0,
    MOTOR,
    SERVO,
    I2C,
    LED,
    BUTTON,
    LCD,
    IMU,
    TEMPERATURE,
    BUZZER,
    IR,
    MICROPHONE,
    POWER,
    GROVE,
    WIFI,
    CAMERA,
    EXTERN
};

/**
 * @brief Command ID
 */
enum CMD_MOTOR
{
    CMD_MOVE_FORWARD = 0,
    CMD_MOVE_BACK,
    CMD_MOVE_LEFT,
    CMD_MOVE_RIGHT,
    CMD_MOVE_STOP,
    CMD_MOVE_TURN_LEFT,
    CMD_MOVE_TURN_RIGHT,
    CMD_SERVO
};

enum CMD_LED
{
    CMD_LED_READ = 0,
    CMD_LED_WRITE
};

/**
 * @brief BLE Communication class
 * 
 */
class BleComm
{
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
    Message *genMsg(int dev, int characteristic, char **params);
    int sendMsg(Message *msg);
    int recvMsg();
};

// Server Callbacks
class ServerCallbacks : public BLEServerCallbacks
{
    void onConnect(BLEServer *pServer)
    {
    }
    void onDisconnect()
    {
    }
};

// Identity Service Callbacks
class GetIdServiceCallbacks : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *pCharacteristic)
    {
        // TODO: handle incoming messages
        uint8_t *data = pCharacteristic->getData();
    }
};

// CMD Characteristic Callbacks
class CMDCharacteristicCallbacks : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *pCharacteristic);
};

// Rx Characteristic Callbacks
class RxCharacteristicCallbacks : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *pCharacteristic);
};

#endif // BLE_COMM_H
