// Winter Robot Main Program

#include <Arduino.h>
#include "BleComm.h"

BleComm ble;

void setup() {
    Serial.begin(115200);
    ble.start();
    Serial.println("Starting BLE Service...");
}

void loop() {
    if (ble.isConnected()) {
        // Serial.println("connected");
        // delay(10);
    } else if (!ble.isConnected()) {
        // Serial.println("disconnected");
    }
    delay(500);
}