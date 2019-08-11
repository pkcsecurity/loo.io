#include <Arduino.h>
#include <analogWrite.h>
#include "mywifi.h"
const int switchPin = 15;
const int ledPin = 13;
bool doorOpen = false;

void setup(void) {
    Serial.begin(9600);
    Serial.println("Starting wifi init process...");
    wifiConnectAndServe();
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, LOW);
    pinMode(switchPin, INPUT);
    digitalWrite(switchPin, HIGH);
}

String getStatus() {
    if (doorOpen) {
        return "Vacant";
    } else {
        return "Occupied";
    }
}

void loop(void) {
    // notification: 0 is no change, 1 is set to OPEN, and 2 is set to CLOSE
    int notification = serverLoop(getStatus());
    if (notification == 1) {
      Serial.println("Marking other door as open");
      digitalWrite(ledPin, LOW);
    } else if (notification == 2) {
      Serial.println("Marking other door as closed");
      digitalWrite(ledPin, HIGH);
    }

    // Door Closed
    if (digitalRead(switchPin) == LOW) {
        if (doorOpen == true) {
            doorOpen = false;
            Serial.println("Door changed to closed");
            notifyOther("close");
        }
    } else {
        if (doorOpen == false) {
            doorOpen = true;
            Serial.println("Door changed to open");
            notifyOther("open");
        }
    }
}
