#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <Wire.h>
#include <BH1750.h>

// WiFi credentials
const char* ssid = "realme 9 Pro 5G";
const char* password = "9progogo";

// Server details
const char* serverUrl = "http://10.0.4.45:5000";
const String tempEndpoint = "/sensors/1/readings";
const String humEndpoint = "/sensors/2/readings";
const String lightEndpoint = "/sensors/3/readings";

// Sensors
#define DHTPIN 15
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
BH1750 lightMeter;

// Send reading function definition
void sendReading(const char* type, float value, const String& endpoint) {
  HTTPClient http;
  String fullUrl = String(serverUrl) + endpoint;
  
  http.begin(fullUrl);
  http.addHeader("Content-Type", "application/json");

  String jsonPayload = "{\"reading_value\":" + String(value) + "}";
  
  Serial.print("Sending " + String(type) + ": ");
  Serial.println(jsonPayload);

  int httpCode = http.POST(jsonPayload);
  
  if (httpCode > 0) {
    Serial.printf("[%s] HTTP code: %d\n", type, httpCode);
  } else {
    Serial.printf("[%s] Error: %s\n", type, http.errorToString(httpCode).c_str());
  }

  http.end();
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  Wire.begin();
  lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());
}

void loop() {
  delay(2000);

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();  
  float lux = lightMeter.readLightLevel();

  Serial.printf("🌡️ Temp: %.1f°C | 💧 Hum: %.1f%% | 💡 Light: %.2f lux\n", 
               temperature, humidity, lux);

  if (WiFi.status() == WL_CONNECTED) {
    if (isnan(temperature)) {
      Serial.println("DHT11 temp read failed!");
    }
    else {
      sendReading("temperature", temperature, tempEndpoint);
    }
    if (isnan(humidity)) {
      Serial.println("DHT11 humidity read failed!");
    }
    else {
      sendReading("humidity", humidity, humEndpoint);  
    }
    if (isnan(lux)) {
      Serial.println("BH1750 read failed!");
    }
    else {
      sendReading("light", lux, lightEndpoint);
    }
  }
}
