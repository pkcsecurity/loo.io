#include <Arduino.h>
#include <analogWrite.h>
#include "mywifi.h"
const int switchPin = 15;
const int ledPin = 13;
bool doorOpen = false;

void setup(void) {
    Serial.begin(9600);
    Serial.println("Starting wifi init process...");
    wifiConnect();
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, LOW);
    pinMode(switchPin, INPUT);
    digitalWrite(switchPin, HIGH);
}

String getStatus() {
    if (doorOpen) {
        return "open";
    } else {
        return "closed";
    }
}

void loop(void) {
    if (digitalRead(switchPin) == LOW) {
        // Door closed
        if (doorOpen == true) {
            doorOpen = false;
            Serial.println("Door changed to closed");
        }
    } else {
        // Door not closed
        if (doorOpen == false) {
            doorOpen = true;
            Serial.println("Door changed to open");
        }
    }

    String otherStatus = notifyServer(getStatus());
    if (otherStatus == "closed") {
      Serial.println("Marking other door as closed");
      digitalWrite(ledPin, HIGH);
    } else {
      Serial.println("Marking other door as not closed");
      digitalWrite(ledPin, LOW);
    }

    delay(1000);
}
