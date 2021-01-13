// Winter Robot Main Program

#include <Arduino.h>
#include "BleComm.h"

void setup() {
    BleComm* ble = new BleComm();
    ble->start();
}

void loop() {
}