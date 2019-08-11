#include "mywifi.h"
#include <ESPmDNS.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <HTTPClient.h>
#include "host.h"

const char *ssid = "PKC Security";
const char *password = "dam2ranch2comet2gist2slay2kept";
const char *dns_name = "looiobottom";

// TCP server at port 80 will respond to HTTP requests
WiFiServer server{80, 1};

HTTPClient client;

void notifyOther(String route) {
	String host = "http://" + otherhost + "/" + route;
	Serial.print("Trying to GET ");
	Serial.println(host);

	client.begin(host);
	int responseCode = client.GET();
	client.end();

	Serial.print("Got response code ");
	Serial.println(responseCode);
}

String successResp(String body) {
    String head =
        "HTTP/1.1 200 OK\r\nContent-Type: "
        "text/plain\r\nAccess-Control-Allow-Origin: *\r\n\r\n";
    return head + body;
}

void wifiConnectAndServe(void) {
    // Connect to WiFi network
    Serial.print("Connecting to ");
    Serial.print(ssid);
    WiFi.begin(ssid, password);

    // Wait for connection
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("Connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    // Set up mDNS responder
    if (!MDNS.begin(host)) {
        Serial.println("Error setting up MDNS responder!");
        while (true) {
            delay(1000);
        }
    }
    Serial.print("mDNS responder started at host ");
    Serial.print(host);
    Serial.println(".local");

    // Start TCP (HTTP) server
    server.begin();
    Serial.println("TCP server started");

    // Add service to MDNS-SD
    MDNS.addService("http", "tcp", 80);
}

int serverLoop(String respText) {
    // Check if a client has connected
    WiFiClient client = server.available();
    if (!client) {
        return 0;
    }

    // Wait for data from client to become available
    while (client.connected() && !client.available()) {
        delay(1);
    }

    // Read the first line of HTTP request
    // NOTE: potential DDoS point
    // replace with timed and buffered read so only
    // GET / HTTP/1.1 is a valid request that fits
    // in the buffer
    String req = client.readStringUntil('\r');

    // Extract path part of HTTP GET request
    int pathStartIndex = req.indexOf(' ');
    int pathEndIndex = req.indexOf(' ', pathStartIndex + 1);

    if (pathStartIndex == -1 || pathEndIndex == -1) {
        Serial.print("Invalid Request: ");
        // NOTE: potential DDoS point as large requests could
        // spam serial output and lock up the CPU
        Serial.println(req);
        return 0;
    }

    req = req.substring(pathStartIndex + 1, pathEndIndex);
    Serial.print("Request: ");
    // NOTE: potential DDoS point as large requests could
    // spam serial output and lock up the CPU
    Serial.print(req);

    String resp;

		int retval = 0;
    if (req == "/") {
        resp = successResp(respText);
        Serial.println(" | Sending 200");
    } else if (req == "/open") {
			resp = "HTTP/1.1 204 OK\r\n\r\n";
			retval = 1;
			Serial.println("Received open notification of other door!");
		} else if (req == "/close") {
			resp = "HTTP/1.1 204 OK\r\n\r\n";
			retval = 2;
			Serial.println("Received close notification of other door!");
		} else {
        resp = "HTTP/1.1 404 Not Found\r\n\r\n";
        Serial.println("Sending 404");
    }

    // Send HTTP response
    client.print(resp);

    client.stop();
		return retval;
}