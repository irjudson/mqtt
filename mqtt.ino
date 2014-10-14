/*
 Basic MQTT example

  - connects to an MQTT server
  - publishes "hello world" to the topic "outTopic"
  - subscribes to the topic "inTopic"
*/

#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>

#define MQTT_SERVER "192.168.1.132"
// Update these with values suitable for your network.
byte MAC_ADDRESS[] = { 0x90, 0xA2, 0xDA, 0x0F, 0xB2, 0xC2 };
// Pin 9 is the LED output pin
int ledPin = 9;
// Analog 0 is the input pin
int lightPinIn = 0;
// defines and variable for sensor/control mode
#define MODE_OFF    0  // not sensing light, LED off
#define MODE_ON     1  // not sensing light, LED on
#define MODE_SENSE  2  // sensing light, LED controlled by software

EthernetClient ethClient;
PubSubClient client(MQTT_SERVER, 1883, callback, ethClient);
int senseMode = 0;
unsigned long time = millis();
char message_buff[MQTT_MAX_PACKET_SIZE];

// handles message arrived on subscribed topic(s)
void callback(char* topic, byte* payload, unsigned int length) {
  int i = 0;
  Serial.println("Message arrived:  topic: " + String(topic));
  Serial.println("Length: " + String(length, DEC));
  
  // create character buffer with ending null terminator (string)
  for(i=0; i<length; i++) {
    message_buff[i] = payload[i];
  }
  message_buff[i] = '\0';
  
  String msgString = String(message_buff);
  Serial.println("Payload: |" + msgString+"|");
  
  if (msgString.indexOf("lightmode") != -1) {
    if (msgString.indexOf("ON") != -1) {
      senseMode = MODE_ON;
    }
    if (msgString.indexOf("OFF") != -1) {
      senseMode = MODE_OFF;
    }
    if (msgString.indexOf("SENSE") != -1) {
      senseMode = MODE_SENSE;
    }
  } else {
    // Other commands
  }
}

void setup()
{
  // initialize the digital pin as an output.
  pinMode(ledPin, OUTPUT);

  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  
  Serial.println("Starting network...");
  if(Ethernet.begin(MAC_ADDRESS) == 0) {
    Serial.println("Failed to configure ethernet.");
  } else {
    // print your local IP address:
    Serial.print("My IP address: ");
    for (byte thisByte = 0; thisByte < 4; thisByte++) {
      // print the value of each byte of the IP address:
      Serial.print(Ethernet.localIP()[thisByte], DEC);
      Serial.print(".");
    }
  }
  Serial.println();
  connect();
}

void connect() 
{
  Serial.print("Connecting to MQTT Gateway...");  
  if (client.connect("ArduinoMQTT", "54357f8a47b5a7f3095fcca4", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NDM1N2Y4YTQ3YjVhN2YzMDk1ZmNjYTQiLCJpYXQiOjE0MTI3OTIyMjQsImV4cCI6MTQxMjg3ODYyNH0.m7BZMvkFJIvnMTz2ZbMvPduJikOYok-OJmId5eIWMek")) {
      Serial.println("done.");
  } else {
    Serial.println("ERROR.");
  }
  client.subscribe("{\"to\":\"54357f8a47b5a7f3095fcca4\"}");
}

void loop()
{  
  // publish light reading every 5 seconds
  if (millis() - time > 5000) {
    int lightRead = analogRead(lightPinIn);
    time = millis();
    String pubString = "{\"type\": \"_report\", \"body\": {\"light\": \"" + String(lightRead) + "\"}}";
    pubString.toCharArray(message_buff, pubString.length() + 1);
    client.publish("{\"to\":\"54357f8a47b5a7f3095fcca4\"}", message_buff);

    switch (senseMode) {
      case MODE_OFF:
        // light should be off
        digitalWrite(ledPin, LOW);
        break;
      case MODE_ON:
        // light should be on
        digitalWrite(ledPin, HIGH);
        break;
      case MODE_SENSE:
        // light is adaptive to light sensor
        if (lightRead < 512) {
          digitalWrite(ledPin, HIGH);
        } else {
          digitalWrite(ledPin, LOW);
        }
    }
  }
  
  if (!client.loop()) {
    Serial.print("Disconnected, reconnecting...");
    connect();
    Serial.println("done.");
  }
}

