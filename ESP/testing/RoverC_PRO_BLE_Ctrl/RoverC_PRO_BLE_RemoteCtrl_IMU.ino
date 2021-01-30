#include <M5StickCPlus.h>
#undef min
#include "RoverC.h"
#include <string>

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define SERVICE_UUID       "1bc68b2a-f3e3-11e9-81b4-2a2ae2dbcce4"
#define CHARACTERISTIC_TX_UUID_X  "1bc68ad2-f3e3-11e9-81b4-2a2ae2dbcce4"
#define CHARACTERISTIC_TX_UUID_Y  "1bc68e6a-f3e3-11e9-81b4-2a2ae2dbcce4"
#define CHARACTERISTIC_TX_UUID_Z  "1bc68c0b-f3e3-11e9-81b4-2a2ae2dbcce4"
#define CHARACTERISTIC_RX_UUID  "1bc68efe-f3e3-11e9-81b4-2a2ae2dbcce4"

BLEServer *pServer = NULL;
BLEService *pService = NULL;
BLECharacteristic * pTxCharacteristicX;
BLECharacteristic * pTxCharacteristicY;
BLECharacteristic * pTxCharacteristicZ;
bool deviceConnected = false;
bool oldDeviceConnected = false;

float gyroX = 0.0F;
float gyroY = 0.0F;
float gyroZ = 0.0F;

int ir_tx_pin = 9;

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
    }
};

//uint8_t* data = new uint8_t[128];


class MyCallbacks: public BLECharacteristicCallbacks {

    void onWrite(BLECharacteristic *pCharacteristic) {
    std::string value = pCharacteristic->getValue();
    //data = pCharacteristic->getData();

    Serial.print("Message: ");
    Serial.println(value.c_str());

    
    std::string param1 = value.substr(0, value.find(' '));
    value = value.substr(value.find(' ')+1);
    std::string param2;
    std::string param3;
    if (value.length() > 3){
      param2 = value.substr(0, value.find(' '));
      param3 = value.substr(value.find(' ')+1);
    }
    else{
      param2 = value;
    }

    if (param1.at(0) == 'w'){
      if (param3.empty()){
        Move_forward(atoi(param2.c_str()));
      }
      else{
        Move_forward(atoi(param2.c_str()));
        delay(atoi(param3.c_str()));
        Move_stop(0);
      }
      
    }
    else if (param1.at(0) == 's'){
      Move_stop(0);
    }
    else if (param1.at(0) == 'x'){
      if (param3.empty()){
        Move_back(atoi(param2.c_str()));
      }
      else{
        Move_back(atoi(param2.c_str()));
        delay(atoi(param3.c_str()));
        Move_stop(0);
      }      
    }
    else if (param1.at(0) == 'a'){
      if (param3.empty()){
        Move_left(atoi(param2.c_str()));
      }
      else{
        Move_left(atoi(param2.c_str()));
        delay(atoi(param3.c_str()));
        Move_stop(0);
      }
    }
    else if (param1.at(0) == 'd'){
      if (param3.empty()){
        Move_right(atoi(param2.c_str()));
      }
      else{
        Move_right(atoi(param2.c_str()));
        delay(atoi(param3.c_str()));
        Move_stop(0);
      }
    }
    else if (param1.at(0) == 'q'){
      if (param3.empty()){
        Move_turnleft(atoi(param2.c_str()));
      }
      else{
        Move_turnleft(atoi(param2.c_str()));
        delay(atoi(param3.c_str()));
        Move_stop(0);
      }
    }
    else if (param1.at(0) == 'e'){
      if (param3.empty()){
        Move_turnright(atoi(param2.c_str()));
      }
      else{
        Move_turnright(atoi(param2.c_str()));
        delay(atoi(param3.c_str()));
        Move_stop(0);
      }
    }
    else if (param1.at(0) == 'z'){
      Servo_angle(1, 90);
    }
    else if (param1.at(0) == 'c'){
      Servo_angle(1, 0);
    }
    else if (param1.at(0) == 'b'){
      // ( uint16_t freq, uint16_t duration);
        M5.Beep.setBeep(atoi(param2.c_str()),atoi(param3.c_str()));
        M5.Beep.beep();
        delay(atoi(param3.c_str()));
        M5.Beep.end();
    }
    else if (param1.at(0) == 'i'){
      if (param2.at(0) == '1'){
        digitalWrite(ir_tx_pin, 1);
      }
      else{
        digitalWrite(ir_tx_pin, 0);
      }
    }
    else{
        Move_stop(100);
      }
      
    }
};

bool InitBLEServer()
{
  uint64_t chipid = ESP.getEfuseMac();
    String blename = "M5-" + String((uint32_t)(chipid >> 32), HEX);

    BLEDevice::init(blename.c_str());
  //BLEDevice::setPower(ESP_PWR_LVL_N12);
  pServer = BLEDevice::createServer();

  pServer->setCallbacks(new MyServerCallbacks());
  pService = pServer->createService(SERVICE_UUID);
  pTxCharacteristicX = pService->createCharacteristic(
                      CHARACTERISTIC_TX_UUID_X,
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pTxCharacteristicX->addDescriptor(new BLE2902());

  pTxCharacteristicY = pService->createCharacteristic(
                      CHARACTERISTIC_TX_UUID_Y,
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pTxCharacteristicY->addDescriptor(new BLE2902());

  pTxCharacteristicZ = pService->createCharacteristic(
                      CHARACTERISTIC_TX_UUID_Z,
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pTxCharacteristicZ->addDescriptor(new BLE2902());
  
  BLECharacteristic * pRxCharacteristic = pService->createCharacteristic(
                        CHARACTERISTIC_RX_UUID,
                        BLECharacteristic::PROPERTY_WRITE
                      );
    pRxCharacteristic->setCallbacks(new MyCallbacks());

    return true;
}

// the setup routine runs once when M5StickC starts up
void setup(){ 
  Serial.begin(115200);
  // Initialize the M5StickC object
  M5.begin();
  M5.IMU.Init();

  pinMode(ir_tx_pin, OUTPUT);

  uint64_t chipid = ESP.getEfuseMac();
  String blename = "M5-" + String((uint32_t)(chipid >> 32), HEX);

  M5.Lcd.setRotation(3);
  M5.Lcd.setTextColor(WHITE);
  M5.Lcd.setCursor(30, 30, 4);
  M5.Lcd.printf("RoverC with BLE\n");
  M5.Lcd.setCursor(30, 60, 4);;
  M5.Lcd.printf(String("Name:"+blename+"\n").c_str());

  RoverC_Init();
  Move_stop(100);

  InitBLEServer();

  // Start the service
  pService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
}

// the loop routine runs over and over again forever
void loop() {
  M5.IMU.getGyroData(&gyroX,&gyroY,&gyroZ);
  char outX[20];
  char outY[20];
  char outZ[20];
  dtostrf(gyroX,7,3,outX);
  dtostrf(gyroY,7,3,outY);
  dtostrf(gyroZ,7,3,outZ);

  pTxCharacteristicX->setValue(outX);
  pTxCharacteristicX->notify();
  Serial.print("X: ");
  Serial.print(outX);

  pTxCharacteristicY->setValue(outY);
  pTxCharacteristicY->notify();
  Serial.print("  Y: ");
  Serial.print(outY);

  pTxCharacteristicZ->setValue(outZ);
  pTxCharacteristicZ->notify();
  Serial.print("  Z: ");
  Serial.println(outZ);
            
  M5.update();
  delay(100);

}
