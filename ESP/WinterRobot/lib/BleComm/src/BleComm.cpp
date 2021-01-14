// BLE Library for WinterRobot

#include "BleComm.h"

/**
 * @brief Initialize BLE service
 * 
 * @return int 
 */
int BleComm::start() {
    // Create the BLE Device
    BLEDevice::init("BOT5");

    // Create the BLE Server
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new ServerCallbacks());

    // Create the BLE Services
    pIdentityService = pServer->createService(IDENTITY_SERVICE_UUID);
    pDevInfoService = pServer->createService(DEV_INFO_SERVICE_UUID);
    pCmdService = pServer->createService(CMD_SERVICE_UUID);

    // Initialize the BLE Characteristics

    // Tx
    pTxCharacteristic = pCmdService->createCharacteristic(
        CMD_SERVICE_TX_UUID,
        BLECharacteristic::PROPERTY_NOTIFY);

    pTxCharacteristic->addDescriptor(new BLE2902());

    // Rx
    pRxCharacteristic = pCmdService->createCharacteristic(
        CMD_SERVICE_RX_UUID,
        BLECharacteristic::PROPERTY_WRITE);
    pRxCharacteristic->setCallbacks(new RxCharacteristicCallbacks());

    // Start advertising
    pCmdService->start();
    BLEAdvertising* pAdvertising = pServer->getAdvertising();
    pAdvertising->addServiceUUID(IDENTITY_SERVICE_UUID);
    pAdvertising->addServiceUUID(DEV_INFO_SERVICE_UUID);
    pAdvertising->addServiceUUID(CMD_SERVICE_UUID);
    pAdvertising->setScanResponse(true);
    BLEDevice::startAdvertising();
    return 0;
}

/**
     * @brief Create messages. See README for details
     * 
     * @param params 
     * @return Msg * 
     */
Msg* BleComm::genMsg(int dev, int characteristic, char** params) {
    Msg* msg = new Msg;
    return msg;
}

/**
 * @brief Send message
 * 
 * @param msg 
 * @return int 
 */
int BleComm::sendMsg(Msg* msg) {
    // TODO
    return 0;
}

/**
 * @brief Read from Characteristics. 
 * 
 * @return int 
 */
int BleComm::recvMsg() {
    // TODO
    return 0;
}