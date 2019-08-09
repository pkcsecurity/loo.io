#include "mywifi.h"
#include "host.h"

#include <WiFi.h>
#include <ESPmDNS.h>
#include <WiFiClient.h>

const char *ssid = "PKC Security";
const char *password = "dam2ranch2comet2gist2slay2kept";
const char *dns_name = "looiobottom";

// TCP server at port 80 will respond to HTTP requests
WiFiServer server{80, 1};

String successResp(String body)
{
	String head = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nAccess-Control-Allow-Origin: *\r\n\r\n";
	return head + body;
}

void wifiConnectAndServe(void)
{
	// Connect to WiFi network
	Serial.print("Connecting to ");
	Serial.print(ssid);
	WiFi.begin(ssid, password);

	// Wait for connection
	while (WiFi.status() != WL_CONNECTED)
	{
		delay(500);
		Serial.print(".");
	}

	Serial.println("");
	Serial.println("Connected!");
	Serial.print("IP address: ");
	Serial.println(WiFi.localIP());

	// Set up mDNS responder
	if(!MDNS.begin(host)) {
		Serial.println("Error setting up MDNS responder!");
		while (true)
		{
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

void serverLoop(String respText)
{
	// Check if a client has connected
	WiFiClient client = server.available();
	if (!client)
	{
		return;
	}

	Serial.println("-------------------------------[Client Connected]-------------------------------");

	// Wait for data from client to become available
	while (client.connected() && !client.available())
	{
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

	if (pathStartIndex == -1 || pathEndIndex == -1)
	{
		Serial.print("Invalid Request: ");
		// NOTE: potential DDoS point as large requests could
		// spam serial output and lock up the CPU
		Serial.println(req);
		return;
	}

	req = req.substring(pathStartIndex + 1, pathEndIndex);
	Serial.print("Request: ");
	// NOTE: potential DDoS point as large requests could
	// spam serial output and lock up the CPU
	Serial.println(req);

	String resp;

	if (req == "/")
	{
		resp = successResp(respText);
		Serial.println("Sending 200");
	}
	else
	{
		resp = "HTTP/1.1 404 Not Found\r\n\r\n";
		Serial.println("Sending 404");
	}

	// Send HTTP response
	client.print(resp);

	client.stop();
	Serial.println("------------------------------[Client Disconnected]-----------------------------");
}