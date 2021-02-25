// BLE Library for WinterRobot

#include "BleComm.h"

#include "M5Display.h"

// Runtime global variables

char name[16];
uint8_t motorMovementId;
int8_t motorSpeed;
uint8_t servoAngle[2];
uint16_t servoWidth[2];
uint8_t ledBrightness;
uint8_t buzzerVolume;
uint16_t buzzerFreq;
uint8_t irState;
uint8_t respCount;

bool listenGyro = true;
bool listenAcce = true;
bool listenAhrs = true;
bool listenTemp = true;
bool listenButton = true;
bool listenMic = false;
bool listenUltrasonic = true;

// Runtime global handles
// Server
BLEServer *pServer = NULL;

// Service
// BLEService *pIdentityService;
// BLEService *pDevInfoService;
BLEService *pCmdService;

// Characteristic
BLECharacteristic *pCMDCharacteristic;
BLECharacteristic *pRespCharacteristic;
BLECharacteristic *pPayload1Characteristic;
BLECharacteristic *pPayload2Characteristic;
BLECharacteristic *pPayload3Characteristic;

PAYLOAD_1 payload1;
PAYLOAD_2 payload2;
PAYLOAD_3 payload3;

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
    Serial.println("Starting Service");

    // Create the BLE Device
    uint64_t chipid = ESP.getEfuseMac();
    String blename = "BOT5-" + String((uint32_t)(chipid >> 32), HEX);
    BLEDevice::init(blename.c_str());
    sprintf(name, blename.c_str());

    // Create the BLE Server
    Serial.println("Create Server");
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new ServerCallbacks());

    // Create the BLE Services
    Serial.println("Create Service");
    // pDevInfoService = pServer->createService(DEV_INFO_SERVICE_UUID);
    // pIdentityService = pServer->createService(IDENTITY_SERVICE_UUID);
    pCmdService = pServer->createService(CMD_SERVICE_UUID);

    // Initialize the BLE Characteristics

    // Response Characteristic
    Serial.println("Create Characteristics");
    pRespCharacteristic = pCmdService->createCharacteristic(
        CMD_CHARACTERISTIC_TX_UUID,
        BLECharacteristic::PROPERTY_NOTIFY);
    pRespCharacteristic->addDescriptor(new BLE2902());

    // Command Characteristic
    pCMDCharacteristic = pCmdService->createCharacteristic(
        CMD_CHARACTERISTIC_RX_UUID,
        BLECharacteristic::PROPERTY_WRITE);
    pCMDCharacteristic->setCallbacks(new CMDCharacteristicCallbacks());

    // Payload 1 Characteristic
    pPayload1Characteristic = pCmdService->createCharacteristic(
        RESP_PAYLOAD1_UUID,
        BLECharacteristic::PROPERTY_NOTIFY);
    pPayload1Characteristic->addDescriptor(new BLE2902());

    // Payload 2 Characteristic
    pPayload2Characteristic = pCmdService->createCharacteristic(
        RESP_PAYLOAD2_UUID,
        BLECharacteristic::PROPERTY_NOTIFY);
    pPayload2Characteristic->addDescriptor(new BLE2902());

    // Payload 3 Characteristic
    pPayload3Characteristic = pCmdService->createCharacteristic(
        RESP_PAYLOAD3_UUID,
        BLECharacteristic::PROPERTY_NOTIFY);
    pPayload3Characteristic->addDescriptor(new BLE2902());

    // Start advertising
    // pDevInfoService->start();
    // pIdentityService->start();
    pCmdService->start();

    BLEAdvertising *pAdvertising = pServer->getAdvertising();
    pAdvertising->addServiceUUID(CMD_SERVICE_UUID);
    // pAdvertising->addServiceUUID(DEV_INFO_SERVICE_UUID);
    // pAdvertising->addServiceUUID(IDENTITY_SERVICE_UUID);
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
bool BleComm::isListenGyro() {
    return listenGyro;
}
bool BleComm::isListenAcce() {
    return listenAcce;
}
bool BleComm::isListenAhrs() {
    return listenAhrs;
}
bool BleComm::isListenTemp() {
    return listenTemp;
}
bool BleComm::isListenButton() {
    return listenButton;
}
bool BleComm::isListenMic() {
    return listenMic;
}
bool BleComm::isListenUltrasonic() {
    return listenUltrasonic;
}
void BleComm::notify() {
    payload1 = {};
    payload2 = {};
    payload3 = {};
    if (listenGyro) {
        M5.Imu.getGyroData(&payload1.gyroX, &payload1.gyroY, &payload1.gyroZ);
    }
    if (listenAcce) {
        M5.Imu.getAccelData(&payload2.acceX, &payload2.acceY, &payload2.acceZ);
    }
    if (listenAhrs) {
        M5.Imu.getAhrsData(&payload3.pitch, &payload3.roll, &payload3.yaw);
    }
    if (listenButton) {
        payload1.buttonA = M5.BtnA.read();
        payload1.buttonB = M5.BtnB.read();
    }
    if (listenTemp) {
        M5.Imu.getTempData(&payload3.temp);
    }
    if (listenMic) {
        // TODO
    }
    if (listenUltrasonic) {
        payload2.ultrasonic = readEUS();
    }
    pPayload1Characteristic->setValue((uint8_t *)&payload1,
                                      sizeof(PAYLOAD_1));
    pPayload2Characteristic->setValue((uint8_t *)&payload2,
                                      sizeof(PAYLOAD_2));
    pPayload3Characteristic->setValue((uint8_t *)&payload3,
                                      sizeof(PAYLOAD_3));
    pPayload1Characteristic->notify();
    pPayload2Characteristic->notify();
    pPayload3Characteristic->notify();
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
                        case MOTOR_MOVEMENT_FOUR_WHEEL_CONTROL:
                            Four_wheel_control(payload->FL,
                                               payload->FR,
                                               payload->RL,
                                               payload->RR);
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
                case CMD_SERVO_CLAW_SET_ANGLE: {
                    PAYLOAD_CMD_SERVO_CLAW_SET_ANGLE *payload = (PAYLOAD_CMD_SERVO_CLAW_SET_ANGLE *)msg->payload;
                    if (DEBUG_SERVO) {
                        Serial.print("CHANNEL ");
                        Serial.println(payload->channel);
                        Serial.print("ANGLE ");
                        Serial.println(payload->angle);
                    }
                    Claw_angle(payload->channel, payload->angle);
                    servoAngle[payload->channel] = payload->angle;
                    break;
                }
                case CMD_SERVO_CLAW_GET_ANGLE: {
                    PAYLOAD_CMD_SERVO_CLAW_GET_ANGLE *cmdPayload =
                        (PAYLOAD_CMD_SERVO_CLAW_GET_ANGLE *)msg->payload;
                    MESSAGE msg = {};
                    PAYLOAD_RESP_SERVO_GET_ANGLE respPayload;
                    msg.peripheral = PERI_SERVO;
                    msg.cmd = CMD_SERVO_CLAW_GET_ANGLE;
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
                case CMD_SERVO_CLAW_SET_PULSE_WIDTH: {
                    PAYLOAD_CMD_SERVO_CLAW_SET_PULSE_WIDTH *payload = (PAYLOAD_CMD_SERVO_CLAW_SET_PULSE_WIDTH *)msg->payload;
                    if (DEBUG_SERVO) {
                        Serial.print("CHANNEL ");
                        Serial.println(payload->channel);
                        Serial.print("WIDTH ");
                        Serial.println(payload->width);
                    }
                    Claw_pulse(payload->channel, payload->width);
                    servoWidth[payload->channel] = payload->width;
                    break;
                }
                case CMD_SERVO_CLAW_GET_PULSE_WIDTH: {
                    PAYLOAD_CMD_SERVO_CLAW_GET_PULSE_WIDTH *cmdPayload =
                        (PAYLOAD_CMD_SERVO_CLAW_GET_PULSE_WIDTH *)msg->payload;
                    MESSAGE msg = {};
                    PAYLOAD_RESP_SERVO_CLAW_GET_PULSE_WIDTH respPayload;
                    msg.peripheral = PERI_SERVO;
                    msg.cmd = CMD_SERVO_CLAW_GET_PULSE_WIDTH;
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
                // case CMD_BUTTON_START_LISTEN_STATE: {
                // listenButton = true;
                // break;
                // }
                // case CMD_BUTTON_STOP_LISTEN_STATE: {
                // listenButton = false;
                // break;
                // }
                default: {
                    Serial.println("How did you get here?");
                    break;
                }
            }
            break;
        }
        case PERI_LCD: {
            switch (msg->cmd) {
                case CMD_LCD_DISPLAY_STRING: {
                    PAYLOAD_CMD_LCD_STRING *payload = (PAYLOAD_CMD_LCD_STRING *)msg->payload;
                    if (DEBUG_LCD) {
                        Serial.println("LCD String");
                        Serial.println(payload->content);
                        Serial.println("Position");
                        Serial.printf("%u, %u\n", payload->x, payload->y);
                        Serial.println("Background Color Font Color");
                        Serial.printf("%x, %x\n", payload->bgColor, payload->fontColor);
                        Serial.println("Text Size");
                        Serial.printf("%u\n", payload->size);
                    }
                    M5.Lcd.setCursor(payload->x, payload->y);
                    M5.Lcd.fillScreen(payload->bgColor);
                    M5.Lcd.setTextColor(payload->fontColor);
                    M5.Lcd.setTextSize(payload->size);
                    M5.Lcd.println(payload->content);
                    break;
                }
                case CMD_LCD_DISPLAY_COLOR: {
                    PAYLOAD_CMD_LCD_COLOR *payload = (PAYLOAD_CMD_LCD_COLOR *)msg->payload;
                    if (DEBUG_LCD) {
                        Serial.println("LCD Color");
                        Serial.printf("%u\n", payload->bgColor);
                    }
                    M5.Lcd.fillScreen(payload->bgColor);
                    break;

                }
                default:
                    break;
            }
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
                case CMD_IMU_START_LISTEN_GYRO: {
                    listenGyro = true;
                    break;
                }
                case CMD_IMU_START_LISTEN_ACCE: {
                    listenAcce = true;
                    break;
                }
                case CMD_IMU_START_LISTEN_AHRS: {
                    listenAhrs = true;
                    break;
                }
                case CMD_IMU_START_LISTEN_TEMP: {
                    listenTemp = true;
                    break;
                }
                case CMD_IMU_STOP_LISTEN_GYRO: {
                    listenGyro = false;
                    break;
                }
                case CMD_IMU_STOP_LISTEN_ACCE: {
                    listenAcce = false;
                    break;
                }
                case CMD_IMU_STOP_LISTEN_AHRS: {
                    listenAhrs = false;
                    break;
                }
                case CMD_IMU_STOP_LISTEN_TEMP: {
                listenTemp = true;
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
                case CMD_BUZZER_SET_FREQ: {
                    PAYLOAD_CMD_BUZZER_SET_FREQ *payload = (PAYLOAD_CMD_BUZZER_SET_FREQ *)msg->payload;
                    // LSB_MSB
                    if (DEBUG_BUZZER) {
                        Serial.print("FREQUENCY ");
                        Serial.println(payload->freq);
                    }
                    buzzerFreq = payload->freq;
                    M5.Beep.tone(payload->freq, 5000);  // remove duration
                    break;
                }
                case CMD_BUZZER_GET_FREQ: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_BUZZER_GET_FREQ payload;
                    msg.peripheral = PERI_BUZZER;
                    msg.cmd = CMD_BUZZER_GET_FREQ;
                    msg.count = respCount++;
                    payload.freq = buzzerFreq;
                    memcpy(&msg.payload, &payload, sizeof(PAYLOAD_RESP_BUZZER_GET_FREQ));
                    if (DEBUG_BUZZER) {
                        Serial.println("BUZZER FREQ");
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
        case PERI_RTC: {
            switch (msg->cmd) {
                case CMD_RTC_SET_TIME: {
                    PAYLOAD_CMD_RTC_SET_TIME *payload = (PAYLOAD_CMD_RTC_SET_TIME *)msg->payload;
                    if (DEBUG_RTC) {
                        Serial.println("RTC SET TIME");
                        Serial.print(payload->time.Hours);
                        Serial.println("h");
                        Serial.print(payload->time.Minutes);
                        Serial.println("m");
                        Serial.print(payload->time.Seconds);
                        Serial.println("s");
                    }
                    M5.Rtc.SetTime(&(payload->time));
                    break;
                }
                case CMD_RTC_GET_TIME: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_RTC_GET_TIME respPayload;
                    msg.peripheral = PERI_RTC;
                    msg.cmd = CMD_RTC_GET_TIME;
                    msg.count = respCount++;
                    M5.Rtc.GetTime(&(respPayload.time));
                    memcpy(&msg.payload, &respPayload, sizeof(PAYLOAD_RESP_RTC_GET_TIME));
                    if (DEBUG_RTC) {
                        Serial.println("GET TIME");
                        BleComm::printMessage(&msg);
                    }
                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                case CMD_RTC_SET_DATE: {
                    PAYLOAD_CMD_RTC_SET_DATE *payload = (PAYLOAD_CMD_RTC_SET_DATE *)msg->payload;
                    if (DEBUG_RTC) {
                        Serial.println("RTC SET DATE");
                        Serial.print(payload->date.Year);
                        Serial.println("y");
                        Serial.print(payload->date.Month);
                        Serial.println("m");
                        Serial.print(payload->date.Date);
                        Serial.println("d");
                        Serial.print(payload->date.WeekDay);
                        Serial.println("weekday");
                    }
                    M5.Rtc.SetData(&(payload->date));
                    break;
                }
                case CMD_RTC_GET_DATE: {
                    MESSAGE msg = {};
                    PAYLOAD_RESP_RTC_GET_DATE respPayload;
                    msg.peripheral = PERI_RTC;
                    msg.cmd = CMD_RTC_GET_DATE;
                    msg.count = respCount++;
                    M5.Rtc.GetData(&(respPayload.date));
                    memcpy(&msg.payload, &respPayload, sizeof(PAYLOAD_RESP_RTC_GET_DATE));
                    if (DEBUG_RTC) {
                        Serial.println("GET DATE");
                        BleComm::printMessage(&msg);
                    }
                    pRespCharacteristic->setValue((uint8_t *)&msg, sizeof(MESSAGE));
                    pRespCharacteristic->notify();
                    break;
                }
                default: {
                    Serial.println("How did you get here?");
                }
            }
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
        case PERI_ULTRASONIC: {
            switch (msg->cmd) {
                case CMD_ULTRASONIC_STRAT_LISTEN : {
                    if (DEBUG_ULTRASONIC) {
                        Serial.println("Start listen Ultrasonic");
                    }
                    listenUltrasonic = true;
                }
                case CMD_ULTRASONIC_STOP_LISTEN : {
                    if (DEBUG_ULTRASONIC) {
                        Serial.println("Stop listen Ultrasonic");
                    }
                    listenUltrasonic = false;
                }
                default: {
                    Serial.println("How did you get here?");
                }
            }
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

// MISC
void BleComm::printMessage(MESSAGE *msg) {
    Serial.printf("%x\n", msg->peripheral);
    Serial.printf("%x\n", msg->cmd);
    Serial.printf("%x\n",msg->count);
    for (int i = 0; i < 16; ++i)
        Serial.printf("%x\n", msg->payload[i]);
    Serial.printf("%x\n", msg->chksm);
}

BlePeri::~BlePeri() {
}
BlePeri::BlePeri(uint16_t uuid) : BLEDescriptor(BLEUUID(uuid)) {
}
void BlePeri::setNotifications(bool flag) {
    uint8_t *pValue = getValue();
    if (flag)
        pValue[0] |= 1 << 0;
    else
        pValue[0] &= ~(1 << 0);
}
bool BlePeri::getNotifications() {
    return (getValue()[0] & (1 << 0)) != 0;
}  // getNotifications
void BlePeri::setIndications(bool flag) {
    uint8_t *pValue = getValue();
    if (flag)
        pValue[0] |= 1 << 1;
    else
        pValue[0] &= ~(1 << 1);
}  // setIndications
bool BlePeri::getIndications() {
    return (getValue()[0] & (1 << 1)) != 0;
}

float readEUS() {
    uint32_t data;
    Wire.beginTransmission(0x57);
    Wire.write(0x01);
    Wire.endTransmission();
    delay(120);
    Wire.requestFrom(0x57, 3);
    data = Wire.read();
    data <<= 8;
    data |= Wire.read();
    data <<= 8;
    data |= Wire.read();
    return float(data) / 1000;
}