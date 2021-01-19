// BLE Library for WinterRobot

#include "BleComm.h"

// Runtime global variables

char name[16];
uint8_t motorMovementId;
int8_t motorSpeed;
uint8_t servoAngle[2];
uint16_t servoWidth[2];
uint8_t ledBrightness;
uint8_t buzzerVolume;
uint16_t buzzerFreq;
uint32_t buzzerDuration;
uint8_t irState;
uint8_t respCount;

// Runtime global handles
// Server
BLEServer *pServer = NULL;

// Service
BLEService *pIdentityService;
BLEService *pDevInfoService;
BLEService *pCmdService;

// Characteristic
BLECharacteristic *pCMDCharacteristic;
BLECharacteristic *pRespCharacteristic;

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
    sprintf(name, blename.c_str());

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

    // Command Characteristic
    pCMDCharacteristic = pCmdService->createCharacteristic(
        CMD_CHARACTERISTIC_RX_UUID,
        BLECharacteristic::PROPERTY_WRITE);
    pCMDCharacteristic->setCallbacks(new CMDCharacteristicCallbacks());

    // Start advertising
    pIdentityService->start();
    pDevInfoService->start();
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

void ServerCallbacks::onConnect(BLEServer *pServer) {
    // Initialize peripherals
    // TODO: Handle the initial values

    M5.Lcd.fillScreen(BLACK);
    M5.Lcd.setCursor(0, 10);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setTextSize(2);
    uint64_t chipid = ESP.getEfuseMac();
    String blename = "BOT5-" + String((uint32_t)(chipid >> 32), HEX);
    M5.Lcd.println(blename);
    M5.Lcd.println("Client Connected! Initializing peripherals...");

    // Stop robot
    Move_stop(0);
    motorMovementId = MOTOR_MOVEMENT_STOP;

    // Initialize PWM
    ledcSetup(LED_CHANNEL, LED_FREQ, LED_RESOLUTION);
    ledcAttachPin(LED_PIN, LED_CHANNEL);
    ledcWrite(LED_CHANNEL, 255);  // turn LED off

    // Initialize IR
    pinMode(IR_TX_PIN, OUTPUT);
    digitalWrite(IR_TX_PIN, HIGH);  // turn IR off

    // Initialize IMU
    M5.Imu.Init();
    M5.Lcd.println("Peripherals initialized");

    // Clear response count
    respCount = 0;
}

void ServerCallbacks::onDisconnect() {
    M5.Lcd.fillScreen(BLACK);
    M5.Lcd.setCursor(0, 10);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setTextSize(2);
    M5.Lcd.printf("Client Disconnected.");
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

    // For debugging
    if (DEBUG_RAW_OUTPUT) {
        BleComm::printMessage(msg);
    }

    switch (msg->peripheral) {
        case PERI_GENERAL: {  // TODO: not implemented correctly
            switch (msg->cmd) {
                case CMD_GENERAL_SET_NAME: {
                    // TODO: Find correct way to change name
                    PAYLOAD_CMD_GENERAL_SET_NAME *payload = (PAYLOAD_CMD_GENERAL_SET_NAME *)msg->payload;
                    if (DEBUG_GENERAL) {
                        Serial.println("GENERAL SET NAME");
                        Serial.println(payload->name);
                    }
                    sprintf(name, payload->name);

                    // This does not work;
                    esp_err_t errRc = ::esp_ble_gap_set_device_name(payload->name);
                    if (errRc != ESP_OK) {
                        log_e("esp_ble_gap_set_device_name: rc=%d %s", errRc, GeneralUtils::errorToString(errRc));
                        return;
                    };
                    break;
                }
                case CMD_GENERAL_GET_NAME: {
                    if (DEBUG_GENERAL) {
                        Serial.println("GET NAME NOT IMPLEMENTED");
                    }
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
                    if (DEBUG_MOTOR) {
                        Serial.print("MOVEMENT_ID ");
                        Serial.println(payload->movement_id);
                        Serial.print("SPEED ");
                        Serial.println(payload->speed);
                    }
                    motorMovementId = payload->movement_id;
                    motorSpeed = payload->speed;
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
                            break;
                        default:
                            Serial.printf("How did you get here?");
                            break;
                    }
                    break;
                }
                case CMD_MOTOR_GET_MOVEMENT_SPEED: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_MOTOR_GET_MOVEMENT_SPEED payload;
                    msg.peripheral = PERI_MOTOR;
                    msg.cmd = CMD_MOTOR_GET_MOVEMENT_SPEED;
                    msg.count = respCount++;
                    payload.movement_id = motorMovementId;
                    payload.speed = motorSpeed;
                    memcpy(&msg.payload, &payload, sizeof(PAYLOAD_RESP_MOTOR_GET_MOVEMENT_SPEED));
                    if (DEBUG_MOTOR) {
                        Serial.println("MOTOR");
                        BleComm::printMessage(&msg);
                    }

                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                default: {
                    Serial.println("How did you get here?");
                } break;
            }
            break;
        }
        case PERI_SERVO: {
            switch (msg->cmd) {
                case CMD_SERVO_SET_ANGLE: {
                    PAYLOAD_CMD_SERVO_SET_ANGLE *payload = (PAYLOAD_CMD_SERVO_SET_ANGLE *)msg->payload;
                    if (DEBUG_SERVO) {
                        Serial.print("CHANNEL ");
                        Serial.println(payload->channel);
                        Serial.print("ANGLE ");
                        Serial.println(payload->angle);
                    }
                    Servo_angle(payload->channel, payload->angle);
                    servoAngle[payload->channel] = payload->angle;
                    break;
                }
                case CMD_SERVO_GET_ANGLE: {
                    PAYLOAD_CMD_SERVO_GET_ANGLE *cmdPayload =
                        (PAYLOAD_CMD_SERVO_GET_ANGLE *)msg->payload;
                    MESSAGE msg = {};
                    PAYLOAD_RESP_SERVO_GET_ANGLE respPayload;
                    msg.peripheral = PERI_SERVO;
                    msg.cmd = CMD_SERVO_GET_ANGLE;
                    msg.count = respCount++;
                    respPayload.channel = cmdPayload->channel;
                    respPayload.angle = servoAngle[cmdPayload->channel];
                    memcpy(&msg.payload, &respPayload, sizeof(PAYLOAD_RESP_SERVO_GET_ANGLE));
                    if (DEBUG_SERVO) {
                        Serial.println("SERVO ANGLE");
                        BleComm::printMessage(&msg);
                    }

                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                case CMD_SERVO_SET_PULSE_WIDTH: {
                    PAYLOAD_CMD_SERVO_SET_PULSE_WIDTH *payload = (PAYLOAD_CMD_SERVO_SET_PULSE_WIDTH *)msg->payload;
                    if (DEBUG_SERVO) {
                        Serial.print("CHANNEL ");
                        Serial.println(payload->channel);
                        Serial.print("WIDTH ");
                        Serial.println(payload->width);
                    }
                    Servo_pulse(payload->channel, payload->width);
                    servoWidth[payload->channel] = payload->width;
                    break;
                }
                case CMD_SERVO_GET_PULSE_WIDTH: {
                    PAYLOAD_CMD_SERVO_GET_PULSE_WIDTH *cmdPayload =
                        (PAYLOAD_CMD_SERVO_GET_PULSE_WIDTH *)msg->payload;
                    MESSAGE msg = {};
                    PAYLOAD_RESP_SERVO_GET_PULSE_WIDTH respPayload;
                    msg.peripheral = PERI_SERVO;
                    msg.cmd = CMD_SERVO_GET_PULSE_WIDTH;
                    msg.count = respCount++;
                    respPayload.channel = cmdPayload->channel;
                    respPayload.width = servoWidth[cmdPayload->channel];
                    memcpy(&msg.payload, &respPayload, sizeof(PAYLOAD_RESP_SERVO_GET_PULSE_WIDTH));
                    if (DEBUG_SERVO) {
                        Serial.println("SERVO WIDTH");
                        BleComm::printMessage(&msg);
                    }

                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                default:
                    Serial.println("How did you get here?");
                    break;
            }
            break;
        }
        case PERI_I2C: {  // TODO: Test
            switch (msg->cmd) {
                case CMD_I2C_GET_DATA: {
                    PAYLOAD_CMD_I2C_GET_DATA *cmdPayload = (PAYLOAD_CMD_I2C_GET_DATA *)msg->payload;
                    MESSAGE msg = {};
                    PAYLOAD_RESP_I2C_GET_DATA respPayload;
                    msg.peripheral = PERI_I2C;
                    msg.cmd = CMD_I2C_GET_DATA;
                    msg.count = respCount++;
                    respPayload.address = cmdPayload->address;
                    Wire.requestFrom(cmdPayload->address, cmdPayload->quantity);
                    respPayload.data = Wire.read();
                    while (Wire.available()) {
                        respPayload.data <<= 8;
                        respPayload.data |= Wire.read();
                    }
                    memcpy(&msg.payload, &respPayload, sizeof(PAYLOAD_RESP_I2C_GET_DATA));
                    if (DEBUG_I2C) {
                        Serial.println("I2C");
                        BleComm::printMessage(&msg);
                    }
                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                case CMD_I2C_SET_DATA: {
                    PAYLOAD_CMD_I2C_SET_DATA *payload = (PAYLOAD_CMD_I2C_SET_DATA *)msg->payload;
                    Wire.beginTransmission(payload->address);
                    Wire.write(payload->data);
                    Wire.endTransmission();
                    if (DEBUG_I2C) {
                        Serial.print("ADDRESS ");
                        Serial.println(payload->address);
                        Serial.print("DATA ");
                        Serial.println(payload->data);
                    }
                    break;
                }
                default:
                    Serial.println("How did you get here?");
                    break;
            }
            break;
        }
        case PERI_LED: {
            switch (msg->cmd) {
                case CMD_LED_SET_BRIGHTNESS: {
                    PAYLOAD_CMD_LED_SET_BRIGHTNESS *payload = (PAYLOAD_CMD_LED_SET_BRIGHTNESS *)msg->payload;
                    if (DEBUG_LED) {
                        Serial.print("BRIGHTNESS ");
                        Serial.println(payload->brightness);
                    }
                    // pin is pulled up, use 255 - brightness to get the correct behaviour
                    ledcWrite(LED_CHANNEL, 255 - payload->brightness);
                    ledBrightness = payload->brightness;
                    break;
                }
                case CMD_LED_GET_BRIGHTNESS: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_LED_GET_BRIGHTNESS payload;
                    msg.peripheral = PERI_LED;
                    msg.cmd = CMD_LED_GET_BRIGHTNESS;
                    msg.count = respCount++;
                    payload.brightness = ledBrightness;
                    memcpy(&msg.payload, &payload, sizeof(PAYLOAD_RESP_LED_GET_BRIGHTNESS));
                    if (DEBUG_LED) {
                        Serial.println("LED");
                        BleComm::printMessage(&msg);
                    }

                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                default:
                    Serial.println("How did you get here?");
                    break;
            }
            break;
        }
        case PERI_BUTTON: {
            switch (msg->cmd) {
                case CMD_BUTTON_GET_STATE_A: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_BUTTON_STATE payload;
                    msg.peripheral = PERI_BUTTON;
                    msg.cmd = CMD_BUTTON_GET_STATE_A;
                    msg.count = respCount++;
                    payload.state = M5.BtnA.read();
                    memcpy(&msg.payload, &payload, sizeof(PAYLOAD_RESP_BUTTON_STATE));
                    if (DEBUG_BUTTON) {
                        Serial.println("BUTTON A");
                        BleComm::printMessage(&msg);
                    }
                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                case CMD_BUTTON_GET_STATE_B: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_BUTTON_STATE payload;
                    msg.peripheral = PERI_BUTTON;
                    msg.cmd = CMD_BUTTON_GET_STATE_B;
                    msg.count = respCount++;
                    payload.state = M5.BtnB.read();
                    memcpy(&msg.payload, &payload, sizeof(PAYLOAD_RESP_BUTTON_STATE));
                    if (DEBUG_BUTTON) {
                        Serial.println("BUTTON B");
                        BleComm::printMessage(&msg);
                    }

                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                default: {
                    Serial.println("How did you get here?");
                    break;
                }
            }
            break;
        }
        case PERI_LCD: {  // TODO
        }
        case PERI_IMU: {
            switch (msg->cmd) {
                case CMD_IMU_POLL_GYRO: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_IMU_GYRO payload;
                    msg.peripheral = PERI_IMU;
                    msg.cmd = CMD_IMU_POLL_GYRO;
                    msg.count = respCount++;
                    M5.Imu.getGyroData(&payload.gyroX, &payload.gyroY, &payload.gyroZ);
                    memcpy(&msg.payload, &payload, sizeof(PAYLOAD_RESP_IMU_GYRO));
                    if (DEBUG_IMU) {
                        Serial.println("GYRO");
                        BleComm::printMessage(&msg);
                    }
                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                case CMD_IMU_POLL_ACCE: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_IMU_ACCE payload;
                    msg.peripheral = PERI_IMU;
                    msg.cmd = CMD_IMU_POLL_ACCE;
                    msg.count = respCount++;
                    M5.Imu.getAccelData(&payload.acceX, &payload.acceY, &payload.acceZ);
                    memcpy(&msg.payload, &payload, sizeof(PAYLOAD_RESP_IMU_ACCE));
                    if (DEBUG_IMU) {
                        Serial.println("ACCE");
                        BleComm::printMessage(&msg);
                    }
                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                case CMD_IMU_POLL_AHRS: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_IMU_AHRS payload;
                    msg.peripheral = PERI_IMU;
                    msg.cmd = CMD_IMU_POLL_AHRS;
                    msg.count = respCount++;
                    M5.Imu.getAhrsData(&payload.pitch, &payload.roll, &payload.yaw);
                    memcpy(&msg.payload, &payload, sizeof(PAYLOAD_RESP_IMU_AHRS));
                    if (DEBUG_IMU) {
                        Serial.println("AHRS");
                        BleComm::printMessage(&msg);
                    }
                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                case CMD_IMU_POLL_TEMP: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_IMU_TEMP payload;
                    msg.peripheral = PERI_IMU;
                    msg.cmd = CMD_IMU_POLL_TEMP;
                    msg.count = respCount++;
                    M5.Imu.getTempData(&payload.temp);
                    memcpy(&msg.payload, &payload, sizeof(PAYLOAD_RESP_IMU_TEMP));
                    if (DEBUG_IMU) {
                        Serial.println("TEMP");
                        BleComm::printMessage(&msg);
                    }
                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                default:
                    Serial.println("How did you get here?");
                    break;
            }
            break;
        }
        case PERI_BUZZER: {
            switch (msg->cmd) {
                case CMD_BUZZER_SET_VOLUME: {
                    PAYLOAD_CMD_BUZZER_SET_VOLUME *payload = (PAYLOAD_CMD_BUZZER_SET_VOLUME *)msg->payload;
                    if (DEBUG_BUZZER) {
                        Serial.print("VOLUME ");
                        Serial.println(payload->volume);
                    }
                    M5.Beep.setVolume(payload->volume);
                    buzzerVolume = payload->volume;
                    break;
                }
                case CMD_BUZZER_GET_VOLUME: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_BUZZER_GET_VOLUME payload;
                    msg.peripheral = PERI_BUZZER;
                    msg.cmd = CMD_BUZZER_GET_VOLUME;
                    msg.count = respCount++;
                    payload.volume = buzzerVolume;
                    memcpy(&msg.payload, &payload, sizeof(PAYLOAD_RESP_BUZZER_GET_VOLUME));
                    if (DEBUG_BUZZER) {
                        Serial.println("BUZZER VOLUME");
                        BleComm::printMessage(&msg);
                    }
                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                case CMD_BUZZER_SET_FREQ_DURATION: {
                    PAYLOAD_CMD_BUZZER_SET_FREQ_DURATION *payload = (PAYLOAD_CMD_BUZZER_SET_FREQ_DURATION *)msg->payload;
                    // LSB_MSB
                    if (DEBUG_BUZZER) {
                        Serial.print("FREQUENCY ");
                        Serial.println(payload->freq);
                        Serial.print("DURATION");
                        Serial.println(payload->duration);
                    }
                    buzzerFreq = payload->freq;
                    buzzerDuration = payload->duration;
                    M5.Beep.tone(payload->freq, payload->duration);
                    break;
                }
                case CMD_BUZZER_GET_FREQ_DURATION: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_BUZZER_GET_FREQ_DURATION payload;
                    msg.peripheral = PERI_BUZZER;
                    msg.cmd = CMD_BUZZER_GET_FREQ_DURATION;
                    msg.count = respCount++;
                    payload.freq = buzzerFreq;
                    payload.duration = buzzerDuration;
                    memcpy(&msg.payload, &payload, sizeof(PAYLOAD_RESP_BUZZER_GET_FREQ_DURATION));
                    if (DEBUG_BUZZER) {
                        Serial.println("BUZZER FREQ DURATION");
                        BleComm::printMessage(&msg);
                    }
                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                case CMD_BUZZER_MUTE: {
                    if (DEBUG_BUZZER) {
                        Serial.println("MUTE");
                    }
                    buzzerVolume = 0;
                    M5.Beep.mute();
                    break;
                }
                default:
                    Serial.println("How did you get here?");
            }
            break;
        }
        case PERI_IR: {
            switch (msg->cmd) {
                case CMD_IR_SET_STATE: {
                    PAYLOAD_CMD_IR_SET_STATE *payload = (PAYLOAD_CMD_IR_SET_STATE *)msg->payload;
                    if (DEBUG_IR) {
                        Serial.print("IR STATE ");
                        Serial.println(1 - payload->state);
                    }
                    digitalWrite(IR_TX_PIN, 1 - payload->state);
                    irState = payload->state;
                    break;
                }
                case CMD_IR_GET_STATE: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_IR_GET_STATE payload;
                    msg.peripheral = PERI_IR;
                    msg.cmd = CMD_IR_GET_STATE;
                    msg.count = respCount++;
                    payload.state = irState;
                    memcpy(&msg.payload, &payload, sizeof(PAYLOAD_RESP_IR_GET_STATE));
                    if (DEBUG_BUZZER) {
                        Serial.println("IR STATE");
                        BleComm::printMessage(&msg);
                    }
                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
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
        case PERI_RTC: {  // TODO
            break;
        }
        case PERI_GROVE: {  // TODO
            break;
        }
        case PERI_WIFI: {  // TODO
            break;
        }
        case PERI_CAMERA: {  // TODO
            break;
        }
        case PERI_EXTERN: {  // TODO
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
// void RxCharacteristicCallbacks::onWrite(BLECharacteristic *pCharacteristic) {
//     std::string value = pCharacteristic->getValue();
//     //data = pCharacteristic->getData();

//     Serial.print("Message: ");
//     Serial.println(value.c_str());

//     std::string param1 = value.substr(0, value.find(' '));
//     value = value.substr(value.find(' ') + 1);
//     std::string param2;
//     std::string param3;
//     if (value.length() > 3) {
//         param2 = value.substr(0, value.find(' '));
//         param3 = value.substr(value.find(' ') + 1);
//     } else {
//         param2 = value;
//     }

//     if (param1.at(0) == 'w') {
//         if (param3.empty()) {
//             Move_forward(atoi(param2.c_str()));
//         } else {
//             Move_forward(atoi(param2.c_str()));
//             delay(atoi(param3.c_str()));
//             Move_stop(0);
//         }
//     } else if (param1.at(0) == 's') {
//         Move_stop(0);
//     } else if (param1.at(0) == 'x') {
//         if (param3.empty()) {
//             Move_back(atoi(param2.c_str()));
//         } else {
//             Move_back(atoi(param2.c_str()));
//             delay(atoi(param3.c_str()));
//             Move_stop(0);
//         }
//     } else if (param1.at(0) == 'a') {
//         if (param3.empty()) {
//             Move_left(atoi(param2.c_str()));
//         } else {
//             Move_left(atoi(param2.c_str()));
//             delay(atoi(param3.c_str()));
//             Move_stop(0);
//         }
//     } else if (param1.at(0) == 'd') {
//         if (param3.empty()) {
//             Move_right(atoi(param2.c_str()));
//         } else {
//             Move_right(atoi(param2.c_str()));
//             delay(atoi(param3.c_str()));
//             Move_stop(0);
//         }
//     } else if (param1.at(0) == 'q') {
//         if (param3.empty()) {
//             Move_turnleft(atoi(param2.c_str()));
//         } else {
//             Move_turnleft(atoi(param2.c_str()));
//             delay(atoi(param3.c_str()));
//             Move_stop(0);
//         }
//     } else if (param1.at(0) == 'e') {
//         if (param3.empty()) {
//             Move_turnright(atoi(param2.c_str()));
//         } else {
//             Move_turnright(atoi(param2.c_str()));
//             delay(atoi(param3.c_str()));
//             Move_stop(0);
//         }
//     } else if (param1.at(0) == 'z') {
//         Servo_angle(1, 90);
//     } else if (param1.at(0) == 'c') {
//         Servo_angle(1, 0);
//     } else if (param1.at(0) == 'b') {
//         // ( uint16_t freq, uint16_t duration);
//         M5.Beep.tone(atoi(param2.c_str()), atoi(param3.c_str()));
//         //      while (true){
//         //        M5.Beep.update();
//         //      }
//     } else {
//         Move_stop(100);
//     }
// }

// MISC

void BleComm::printMessage(MESSAGE *msg) {
    Serial.println(msg->peripheral);
    Serial.println(msg->cmd);
    Serial.println(msg->count);
    for (int i = 0; i < 16; ++i)
        Serial.println(msg->payload[i]);
    Serial.println(msg->chksm);
}