// BLE Library for WinterRobot

#include "BleComm.h"

BleComm::BleComm() {
}

BleComm::~BleComm() {
}

/**
 * @brief Initialize BLE service
 * 
 * @return int 
 */
int BleComm::start() {
    // Create the BLE Device
    uint64_t chipid = ESP.getEfuseMac();
    String blename = "BOT5-" + String((uint32_t)(chipid >> 32), HEX);

    BLEDevice::init(blename.c_str());

    // Initialize robot parameters.
    // TODO

    // Create the BLE Server
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new ServerCallbacks());

    // Create the BLE Services
    pIdentityService = pServer->createService(IDENTITY_SERVICE_UUID);
    pDevInfoService = pServer->createService(DEV_INFO_SERVICE_UUID);
    pCmdService = pServer->createService(CMD_SERVICE_UUID);

    // Initialize the BLE Characteristics

    // Response Characteristic
    pRespCharacteristic = pCmdService->createCharacteristic(
        CMD_CHARACTERISTIC_TX_UUID,
        BLECharacteristic::PROPERTY_NOTIFY);

    pRespCharacteristic->addDescriptor(new BLE2902());

    // Rx
    pCMDCharacteristic = pCmdService->createCharacteristic(
        CMD_CHARACTERISTIC_RX_UUID,
        BLECharacteristic::PROPERTY_WRITE);
    pCMDCharacteristic->setCallbacks(new CMDCharacteristicCallbacks());

    // Start advertising
    pCmdService->start();
    BLEAdvertising *pAdvertising = pServer->getAdvertising();
    // pAdvertising->addServiceUUID(IDENTITY_SERVICE_UUID);
    // pAdvertising->addServiceUUID(DEV_INFO_SERVICE_UUID);
    pAdvertising->addServiceUUID(CMD_SERVICE_UUID);
    pAdvertising->setScanResponse(true);
    BLEDevice::startAdvertising();
    return 0;
}

/**
 * @brief Return whether the service is connected
 * 
 * @return true connected
 * @return false not connected
 */
bool BleComm::isConnected() {
    return pServer->getConnectedCount() > 0;
}

/**
 * @brief Create messages. See README for details
 * 
 * @param params 
 * @return Msg * 
 */
MESSAGE *BleComm::genMsg(int dev, int characteristic, char **params) {
    MESSAGE *msg = new MESSAGE;
    return msg;
}

/**
 * @brief Send message
 * 
 * @param msg 
 * @return int 
 */
int BleComm::sendMsg(MESSAGE *msg) {
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

/**
 * @brief Handling Command message
 * @author Zander M
 * 
 * Handle incoming message.
 */
void CMDCharacteristicCallbacks::onWrite(BLECharacteristic *pCharacteristic) {
    MESSAGE *msg = (MESSAGE *)pCharacteristic->getData();
    // TODO: error check
    switch (msg->peripheral) {
        case PERI_GENERAL: {
            switch (msg->cmd) {
                case CMD_GENERAL_SET_NAME: {
                    PAYLOAD_CMD_GENERAL_SET_NAME *payload = (PAYLOAD_CMD_GENERAL_SET_NAME *)msg->payload;
                    //TODO
                    break;
                }
                case CMD_GENERAL_GET_NAME: {
                    //TODO
                    break;
                }
                default:
                    Serial.println("How did you get here?");
                    break;
            }
            break;
        }
        case PERI_MOTOR: {
            switch (msg->cmd) {
                case CMD_MOTOR_SET_MOVEMENT_SPEED: {
                    PAYLOAD_CMD_MOTOR_SET_MOVEMENT_SPEED *payload =
                        (PAYLOAD_CMD_MOTOR_SET_MOVEMENT_SPEED *)msg->payload;
                    switch (payload->movement_id) {
                        case MOTOR_MOVEMENT_FORWARD:
                            Move_forward(payload->speed);
                            break;
                        case MOTOR_MOVEMENT_BACK:
                            Move_back(payload->speed);
                            break;
                        case MOTOR_MOVEMENT_LEFT:
                            Move_left(payload->speed);
                            break;
                        case MOTOR_MOVEMENT_RIGHT:
                            Move_right(payload->speed);
                            break;
                        case MOTOR_MOVEMENT_TURN_LEFT:
                            Move_turnleft(payload->speed);
                            break;
                        case MOTOR_MOVEMENT_TURN_RIGHT:
                            Move_turnright(payload->speed);
                            break;
                        case MOTOR_MOVEMENT_STOP:
                            Move_stop(payload->speed);
                        default:
                            break;
                    }
                    break;
                }
                case CMD_MOTOR_GET_MOVEMENT_SPEED: {
                    //TODO
                    break;
                }
                default:
                    break;
            }
            break;
        }
        case PERI_SERVO: {
            switch (msg->cmd) {
                case CMD_SERVO_GET_ANGLE:
                    // TODO
                    break;
                case CMD_SERVO_GET_PULSE_WIDTH:
                    // TODO
                    break;
                case CMD_SERVO_SET_ANGLE:
                    // TODO
                    break;
                case CMD_SERVO_SET_PULSE_WIDTH:
                    // TODO
                    break;
                default:
                    break;
            }
            break;
        }
        case PERI_I2C: {
            switch (msg->cmd) {
                case CMD_I2C_GET_DATA:
                    // TODO
                    break;
                case CMD_I2C_SET_DATA:
                    // TODO
                    break;
                default:
                    break;
            }
            break;
        }
        case PERI_LED: {
            switch (msg->cmd) {
                case CMD_LED_SET_BRIGHTNESS:
                    // TODO
                    break;
                case CMD_LED_GET_BRIGHTNESS:
                    // TODO
                    break;
                default:
                    break;
            }
            break;
        }
        case PERI_BUTTON: {
            switch (msg->cmd) {
                case CMD_BUTTON_GET_STATE_A:
                    // TODO
                    break;
                case CMD_BUTTON_GET_STATE_B:
                    // TODO
                    break;
                default:
                    break;
            }
            break;
        }
        case PERI_LCD: {
            // TODO
        }
        case PERI_IMU: {
            switch (msg->cmd) {
                case CMD_IMU_POLL_GYRO:
                    // TODO
                    break;
                case CMD_IMU_POLL_ACCE:
                    // TODO
                    break;
                case CMD_IMU_POLL_AHRS:
                    // TODO
                    break;
                case CMD_IMU_POLL_TEMP:
                    // TODO
                    break;
                default:
                    break;
            }
            break;
        }
        case PERI_BUZZER: {
            switch (msg->cmd) {
                case CMD_BUZZER_SET_FREQ_DURATION: {
                    // TODO
                    break;
                }
                case CMD_BUZZER_SET_VOLUME: {
                    // TODO
                    break;
                }
                case CMD_BUZZER_GET_FREQ_DURATION: {
                    // TODO
                    break;
                }
                case CMD_BUZZER_GET_VOLUME: {
                    // TODO
                    break;
                }
                default:
                    Serial.println("How did you get here?");
            }
            break;
        }
        case PERI_IR: {
            switch (msg->cmd) {
                case CMD_IR_SET_STATE:
                    // TODO
                    break;
                case CMD_IR_GET_STATE:
                    // TODO
                    break;

                default:
                    break;
            }
            break;
        }
        case PERI_MICROPHONE: {
            // TODO
            break;
        }
        case PERI_POWER: {
            // TODO
            break;
        }
        default: {
            Serial.println(msg->peripheral);
            Serial.println(msg->cmd);
            Serial.println(msg->count);
            for (int i = 0; i < 16; ++i)
                Serial.println(msg->payload[i]);
            Serial.println(msg->chksm);
            break;
        }
    }
}

/**
 * @brief Handling RX message
 * @author Momoe Nomoto
 */
void RxCharacteristicCallbacks::onWrite(BLECharacteristic *pCharacteristic) {
    std::string value = pCharacteristic->getValue();
    //data = pCharacteristic->getData();

    Serial.print("Message: ");
    Serial.println(value.c_str());

    std::string param1 = value.substr(0, value.find(' '));
    value = value.substr(value.find(' ') + 1);
    std::string param2;
    std::string param3;
    if (value.length() > 3) {
        param2 = value.substr(0, value.find(' '));
        param3 = value.substr(value.find(' ') + 1);
    } else {
        param2 = value;
    }

    if (param1.at(0) == 'w') {
        if (param3.empty()) {
            Move_forward(atoi(param2.c_str()));
        } else {
            Move_forward(atoi(param2.c_str()));
            delay(atoi(param3.c_str()));
            Move_stop(0);
        }
    } else if (param1.at(0) == 's') {
        Move_stop(0);
    } else if (param1.at(0) == 'x') {
        if (param3.empty()) {
            Move_back(atoi(param2.c_str()));
        } else {
            Move_back(atoi(param2.c_str()));
            delay(atoi(param3.c_str()));
            Move_stop(0);
        }
    } else if (param1.at(0) == 'a') {
        if (param3.empty()) {
            Move_left(atoi(param2.c_str()));
        } else {
            Move_left(atoi(param2.c_str()));
            delay(atoi(param3.c_str()));
            Move_stop(0);
        }
    } else if (param1.at(0) == 'd') {
        if (param3.empty()) {
            Move_right(atoi(param2.c_str()));
        } else {
            Move_right(atoi(param2.c_str()));
            delay(atoi(param3.c_str()));
            Move_stop(0);
        }
    } else if (param1.at(0) == 'q') {
        if (param3.empty()) {
            Move_turnleft(atoi(param2.c_str()));
        } else {
            Move_turnleft(atoi(param2.c_str()));
            delay(atoi(param3.c_str()));
            Move_stop(0);
        }
    } else if (param1.at(0) == 'e') {
        if (param3.empty()) {
            Move_turnright(atoi(param2.c_str()));
        } else {
            Move_turnright(atoi(param2.c_str()));
            delay(atoi(param3.c_str()));
            Move_stop(0);
        }
    } else if (param1.at(0) == 'z') {
        Servo_angle(1, 90);
    } else if (param1.at(0) == 'c') {
        Servo_angle(1, 0);
    } else if (param1.at(0) == 'b') {
        // ( uint16_t freq, uint16_t duration);
        M5.Beep.tone(atoi(param2.c_str()), atoi(param3.c_str()));
        //      while (true){
        //        M5.Beep.update();
        //      }
    } else {
        Move_stop(100);
    }
}
