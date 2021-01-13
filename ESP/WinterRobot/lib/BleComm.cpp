// BLE Library for WinterRobot

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

// Identity Service
#define IDENTITY_SERVICE_UUID "a060821e-54d1-11eb-ae93-0242ac130002"  // UART service UUID

// Dev info Service
#define DEV_INFO_SERVICE_UUID "ad505ba2-54d1-11eb-ae93-0242ac130002"  // UART service UUID

// UART Service
#define CMD_SERVICE_UUID "f6a44d18-6e45-4630-b85e-da3817f10edd"  // UART service UUID

struct Msg {
    uint8_t dev;          // device id
    uint8_t cmd;          // mes sage index
    uint8_t chksm;        // checksum
    uint8_t content[16];  // message
    uint8_t chksm;        // checksum
};

class BleComm {
   private:
    // Server
    BLEServer* pServer = NULL;

    // Service
    BLEService* pIdentityService;
    BLEService* pDevInfoService;
    BLEService* pCmdService;

    // Characteristics
    BLECharacteristic* Characteristic;
    BLECharacteristic* pTxCharacteristic;
    BLECharacteristic* pTxCharacteristic;
    BLECharacteristic* pTxCharacteristic;
    BLECharacteristic* pTxCharacteristic;

    // MISC
    bool deviceConnected = false;
    bool oldDeviceConnected = false;

   public:
    BleComm() {}
    ~BleComm() {
    }

    /**
     * @brief Initialize BLE service
     * 
     * @return int 
     */
    int init() {

    }

    /**
     * @brief Create messages. See README for details
     * 
     * @param params 
     * @return Msg * 
     */

    Msg* genMsg(char** params) {
        
    }

    /**
     * @brief 
     * 
     * @return int 
     */
    int recvMsg() {
    }
};