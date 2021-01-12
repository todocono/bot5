// Library for WinterRobot

#include <BLE2902.h>
#include <BLEDevice.h>
#include <BLEService.h>
#include <BLEUtils.h>

// ERRONO
#define ERROR_NO_MESSAGE 0
#define ERROR_COMMAND_INVALID 1

// Pre-defined UUIDs.
// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

// Identity Service UUID
#define IDENTITY_SERVICE_UUID "a060821e-54d1-11eb-ae93-0242ac130002"  // UART service UUID

// Dev info Service UUID
#define DEV_INFO_SERVICE_UUID "ad505ba2-54d1-11eb-ae93-0242ac130002"  // UART service UUID

// UART Service UUID
#define CMD_SERVICE_UUID "f6a44d18-6e45-4630-b85e-da3817f10edd"  // UART service UUID

struct Msg {
    int dev;  // device id
    int cmd;  // message index
    int id;   // message count
}

class BleComm {
   private:
    //Server
    BLEServer* pServer = NULL;

    //Service 
    BLEService *pIdentityService;
    BLEService *pDevInfoService;
    BLEService *pCmdService;

    //Characteristics
    BLECharacteristic* Characteristic;
    BLECharacteristic* pTxCharacteristic;
    BLECharacteristic* pTxCharacteristic;
    BLECharacteristic* pTxCharacteristic;
    BLECharacteristic* pTxCharacteristic;

   public:
    BleComm(){

    };

    ~BleComm();
    
    int genMsg(Msg* msg){

    };

    int recvMsg() {
    }
};