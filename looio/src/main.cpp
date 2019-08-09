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
    serverLoop(getStatus());
    // Door Closed
    if (digitalRead(switchPin) == LOW) {
        if (doorOpen == true) {
            doorOpen = false;
            Serial.println("Door changed to closed");
            float in, out;
            for (in = 0; in < 6.283; in = in + 0.00628) {
                out = sin(in) * 127.5 + 127.5;
                analogWrite(ledPin, out);
                delay(1);
            }
            digitalWrite(ledPin, LOW);
        }
    } else {
        if (doorOpen == false) {
            doorOpen = true;
            Serial.println("Door changed to open");
            float in, out;
            for (in = 0; in < 6.283; in = in + 0.00628) {
                out = sin(in) * 127.5 + 127.5;
                analogWrite(ledPin, out);
                delay(1);
            }
            digitalWrite(ledPin, LOW);
        }
    }
}
