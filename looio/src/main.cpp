#include <Arduino.h>
#include "wifi.h"

void setup(void) {
	Serial.begin(9600);
  Serial.println("Starting wifi init process...");
  wifiConnectAndServe();
}

void loop(void) {
  serverLoop();
}
