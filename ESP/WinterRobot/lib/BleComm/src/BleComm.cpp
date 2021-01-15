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
    pAdvertising->addServiceUUID(IDENTITY_SERVICE_UUID);
    pAdvertising->addServiceUUID(DEV_INFO_SERVICE_UUID);
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
Message *BleComm::genMsg(int dev, int characteristic, char **params) {
    Message *msg = new Message;
    return msg;
}

/**
 * @brief Send message
 * 
 * @param msg 
 * @return int 
 */
int BleComm::sendMsg(Message *msg) {
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
    Message *msg = (Message *)pCharacteristic->getData();
    // TODO: error check
    switch (msg->dev) {
        case MOTOR: {
            // Serial.println("Chassis"); TEST
            CONTENT_MOTOR *content = (CONTENT_MOTOR *)msg->content;
            unsigned int speed = content->speed;
            unsigned int time = content->time;
            bool servoState = content->servoState;
            switch (content->movement) {  // Move Case
                case CMD_MOVE_FORWARD: {
                    // Serial.println("Forward"); TEST
                    Move_forward(speed);
                    delay(time);
                    break;
                }
                case CMD_MOVE_BACK: {
                    Move_back(speed);
                    delay(time);
                    break;
                }
                case CMD_MOVE_LEFT: {
                    Move_left(speed);
                    delay(time);
                    break;
                }
                case CMD_MOVE_RIGHT: {
                    Move_right(speed);
                    delay(time);
                    break;
                }
                case CMD_MOVE_TURN_LEFT: {
                    Move_turnleft(speed);
                    delay(time);
                    break;
                }
                case CMD_MOVE_TURN_RIGHT: {
                    Move_turnright(speed);
                    delay(time);
                    break;
                }
                case CMD_MOVE_STOP: {
                    Move_stop(speed);
                    delay(time);
                    break;
                }

                case CMD_SERVO: {
                    unsigned int channel = content->servoChannel;
                    if (content->servoState) {
                        Servo_angle(channel, 90);
                    } else {
                        Servo_angle(channel, 0);
                    }
                    break;
                }
            }
            break;
        }

        case BUZZER: {
            CONTENT_BUZZER *buzzer = (CONTENT_BUZZER *) msg->content;
            M5.Beep.tone(buzzer->freq, buzzer->duration);
            break;
        }

        case LED: {
            CONTENT_LED *content = (CONTENT_LED *) msg->content;
            if (msg->cmd == CMD_LED_READ) {
                // TODO: handle send message;
            } else if (msg->cmd == CMD_LED_WRITE) {
                if (content->value) {
                    digitalWrite(LED_PIN, LOW);
                    Serial.println("LED on");
                } else {
                    digitalWrite(LED_PIN, HIGH);
                    Serial.println("LED off");
                }
            } else {
                Serial.println("How did you get here?");
            }
        }
        default: {
            Move_stop(0);
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
