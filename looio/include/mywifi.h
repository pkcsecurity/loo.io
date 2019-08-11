#pragma once
#include <Arduino.h>

void notifyOther(String route);
void wifiConnectAndServe(void);
int serverLoop(String respText);
