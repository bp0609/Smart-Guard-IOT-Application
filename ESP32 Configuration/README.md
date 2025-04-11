# **ESP32 Environmental Sensor Monitoring System**  
**Reads DHT11 (Temperature/Humidity) + BH1750 (Light) and Sends Data via HTTP POST**  

---

## **Features**  
- **Temperature Monitoring** (DHT11)  
- **Humidity Monitoring** (DHT11)  
- **Light Intensity Monitoring** (BH1750)  
- **WiFi Connectivity** (ESP32)  
- **HTTP POST Requests** (JSON formatted)  
- **Error Handling** (Failed sensor reads, WiFi issues)  

---

## **🔧 Hardware Setup**  
### **Components Needed**  
- **ESP32** (DevKit recommended)  
- **DHT11** (Temperature & Humidity Sensor)  
- **BH1750** (Light Sensor)    
- **Breadboard & Jumper Wires**  

### **Wiring Guide**  
| Sensor   | ESP32 Pin | Connection Notes |  
|----------|----------|----------------|  
| **DHT11** | |  
| VCC      | 3.3V     | |  
| DATA     | GPIO15   | |  
| GND      | GND      | |  
| **BH1750** | |  
| VCC      | 3.3V     | |  
| SDA      | GPIO21   | I2C Data Line |  
| SCL      | GPIO22   | I2C Clock Line |  
| GND      | GND      | |  

---

## **⚙️ Software Setup**  
### **Required Libraries**  
1. **WiFi & HTTPClient** (Built-in with ESP32)  
2. **DHT Sensor Library** (Adafruit)  
   - Install via Arduino Library Manager (`DHT sensor library`)  
3. **BH1750 Library** (Christopher Laws)  
   - Install via Arduino Library Manager (`BH1750`)  

### **Configuration**  
1. **WiFi Credentials**  
   - Modify `ssid` and `password` in the code.  
2. **Server URL**  
   - Replace `http://10.0.4.45:5000` with your server address.  
3. **Endpoints**  
   - `/sensors/1/readings` → Temperature  
   - `/sensors/2/readings` → Humidity  
   - `/sensors/3/readings` → Light  

---

## **📡 How It Works**  
1. **Initialization**  
   - Connects to WiFi.  
   - Starts DHT11 and BH1750 sensors.  
2. **Main Loop**  
   - Reads sensor data every **2 seconds**.  
   - Validates readings (checks for `NaN` errors).  
   - Sends data to server via **HTTP POST** in JSON format:  
     ```json
     {"reading_value": 25.5}  // Example (temperature)
     ```
3. **Serial Monitor Output**  
   - Displays sensor readings & HTTP status.  
   - Example:  
     ```
     🌡️ Temp: 25.5°C | 💧 Hum: 60.0% | 💡 Light: 320.50 lux
     [temperature] HTTP code: 200
     ```
