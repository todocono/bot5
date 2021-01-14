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
#define IDENTITY_SERVICE_UUID "a060821e-54d1-11eb-ae93-0242ac130002"  // UART service UUID

// Dev info Service
#define DEV_INFO_SERVICE_UUID "ad505ba2-54d1-11eb-ae93-0242ac130002"  // UART service UUID

// CMD Service
#define CMD_SERVICE_UUID "f6a44d18-6e45-4630-b85e-da3817f10edd"            // UART service UUID
#define CMD_CHARACTERISTIC_TX_UUID "f6a44d18-6e45-4631-b85e-da3817f10edd"  // UART service UUID
#define CMD_CHARACTERISTIC_RX_UUID "f6a44d18-6e45-4632-b85e-da3817f10edd"  // UART service UUID

/**
 * @brief Message struct 
 * 
 */
typedef struct {
    uint8_t dev;  // device id
    uint8_t cmd;  // mes sage index
    uint8_t id;
    uint8_t content[16];  // message
    uint8_t chksm;        // checksum
} Msg;

/**
 * @brief BLE Communication class
 * 
 */
class BleComm {
   private:
    // Server
    BLEServer* pServer = NULL;

    // Service
    BLEService* pIdentityService;
    BLEService* pDevInfoService;
    BLEService* pCmdService;

    // Characteristics
    BLECharacteristic* pTxCharacteristic;
    BLECharacteristic* pRxCharacteristic;

    // MISC
    static bool deviceConnected;
    static bool oldDeviceConnected;
    static unsigned int messageCount;

   public:
    BleComm();
    ~BleComm();
    int start();
    bool isConnected();
    Msg* genMsg(int dev, int characteristic, char** params);
    int sendMsg(Msg* msg);
    int recvMsg();
};

// Server Callbacks
class ServerCallbacks : public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
    }
    void onDisconnect() {
    }
};

// Identity Service Callbacks
class GetIdServiceCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic* pCharacteristic) {
        // TODO: handle incoming messages
        uint8_t* data = pCharacteristic->getData();

    }
};

// CMD Service Callbacks
class RxCharacteristicCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic* pCharacteristic); 
};

#endif  // BLE_COMM_H
