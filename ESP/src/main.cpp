// Winter Robot Main Program

#include <Arduino.h>

#include "BleComm.h"
#include "M5Display.h"

BleComm ble;

void setup() {
    Serial.begin(115200);
    M5.begin();

    // caution: the pin is pulled up, set HIGH to turn off the LED
    RoverC_Init();
    M5.Imu.Init();
    Serial.println("Starting BLE Service...");
    M5.Lcd.setRotation(1);
    M5.Lcd.fillScreen(BLACK);
    M5.Lcd.setCursor(0, 10);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setTextSize(2);
    M5.Lcd.println("Starting BLE Service...");
    uint64_t chipid = ESP.getEfuseMac();
    String blename = "BOT5-" + String((uint32_t)(chipid >> 32), HEX);
    M5.Lcd.printf(String("Name:" + blename + "\n").c_str());
    ble.start();
}

void loop() {
    // IMU test
    // float a, b, c;
    // M5.Imu.getAccelData(&a, &b, &c);
    // Serial.printf("%f, %f, %f\n", a, b, c);
    
    ble.notify();
    delay(20);
    
}