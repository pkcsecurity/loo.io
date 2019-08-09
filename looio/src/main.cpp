#include <Arduino.h>
#include "mywifi.h"

void setup(void) {
	Serial.begin(9600);
  Serial.println("Starting wifi init process...");
  wifiConnectAndServe();
}

bool occupied = false;

void loop(void) {
  String status;
  if (occupied) {
    status = "Occupied";
  } else {
    status = "Vacant";
  }
  occupied = !occupied;
  serverLoop(status);
}
