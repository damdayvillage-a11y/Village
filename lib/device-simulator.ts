import mqtt from 'mqtt';
import { v4 as uuidv4 } from 'uuid';

export interface DeviceConfig {
  id: string;
  name: string;
  type: 'AIR_QUALITY' | 'ENERGY_METER' | 'SOLAR_PANEL' | 'WEATHER_STATION' | 'WATER_SENSOR';
  location: {
    latitude: number;
    longitude: number;
    description: string;
  };
  telemetryInterval: number; // milliseconds
  mqttTopic: string;
}

export interface TelemetryData {
  deviceId: string;
  timestamp: string;
  metrics: Record<string, any>;
}

// Sample device configurations
export const SAMPLE_DEVICES: DeviceConfig[] = [
  {
    id: 'air-quality-001',
    name: 'Village Center Air Quality Monitor',
    type: 'AIR_QUALITY',
    location: {
      latitude: 29.5456,
      longitude: 80.0964,
      description: 'Village Center, Damday'
    },
    telemetryInterval: 30000, // 30 seconds
    mqttTopic: 'damday/sensors/air-quality'
  },
  {
    id: 'energy-meter-001',
    name: 'Solar Microgrid Main Meter',
    type: 'ENERGY_METER',
    location: {
      latitude: 29.5460,
      longitude: 80.0970,
      description: 'Solar Array, Damday'
    },
    telemetryInterval: 10000, // 10 seconds
    mqttTopic: 'damday/sensors/energy'
  },
  {
    id: 'weather-001',
    name: 'Village Weather Station',
    type: 'WEATHER_STATION',
    location: {
      latitude: 29.5450,
      longitude: 80.0960,
      description: 'Weather Station, Damday'
    },
    telemetryInterval: 60000, // 1 minute
    mqttTopic: 'damday/sensors/weather'
  }
];

export class DeviceSimulator {
  private client: mqtt.MqttClient | null = null;
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;

  constructor(
    private brokerUrl: string = 'mqtt://localhost:1883',
    private devices: DeviceConfig[] = SAMPLE_DEVICES
  ) {}

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = mqtt.connect(this.brokerUrl, {
        clientId: `device-simulator-${uuidv4()}`,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
      });

      this.client.on('connect', () => {
        console.log('✅ Device Simulator connected to MQTT broker');
        resolve();
      });

      this.client.on('error', (error) => {
        console.error('❌ MQTT connection error:', error);
        reject(error);
      });

      this.client.on('disconnect', () => {
        console.log('📡 Device Simulator disconnected from MQTT broker');
      });
    });
  }

  startSimulation(): void {
    if (this.isRunning) {
      console.log('⚠️ Simulation already running');
      return;
    }

    if (!this.client?.connected) {
      console.error('❌ MQTT client not connected');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting device simulation for', this.devices.length, 'devices');

    this.devices.forEach(device => {
      const interval = setInterval(() => {
        this.sendTelemetry(device);
      }, device.telemetryInterval);

      this.intervals.set(device.id, interval);
      
      // Send initial telemetry immediately
      this.sendTelemetry(device);
    });
  }

  stopSimulation(): void {
    if (!this.isRunning) {
      console.log('⚠️ Simulation not running');
      return;
    }

    this.isRunning = false;
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    
    console.log('⏹️ Device simulation stopped');
  }

  disconnect(): void {
    this.stopSimulation();
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }

  private sendTelemetry(device: DeviceConfig): void {
    if (!this.client?.connected) return;

    const telemetry = this.generateTelemetryData(device);
    const topic = device.mqttTopic;
    const payload = JSON.stringify(telemetry);

    this.client.publish(topic, payload, { qos: 1 }, (error) => {
      if (error) {
        console.error(`❌ Failed to publish telemetry for ${device.id}:`, error);
      } else {
        console.log(`📊 Telemetry sent for ${device.name}`);
      }
    });
  }

  private generateTelemetryData(device: DeviceConfig): TelemetryData {
    const timestamp = new Date().toISOString();
    let metrics: Record<string, any> = {};

    switch (device.type) {
      case 'AIR_QUALITY':
        metrics = {
          pm25: Math.round((Math.random() * 50 + 10) * 100) / 100, // PM2.5 (μg/m³)
          pm10: Math.round((Math.random() * 80 + 20) * 100) / 100, // PM10 (μg/m³)
          co2: Math.round(Math.random() * 200 + 400), // CO2 (ppm)
          humidity: Math.round((Math.random() * 40 + 30) * 100) / 100, // Humidity (%)
          temperature: Math.round((Math.random() * 15 + 10) * 100) / 100, // Temperature (°C)
          aqi: Math.round(Math.random() * 100 + 50) // Air Quality Index
        };
        break;

      case 'ENERGY_METER':
        metrics = {
          voltage: Math.round((Math.random() * 20 + 220) * 100) / 100, // Voltage (V)
          current: Math.round((Math.random() * 10 + 5) * 100) / 100, // Current (A)
          power: Math.round((Math.random() * 2000 + 1000) * 100) / 100, // Power (W)
          energy: Math.round((Math.random() * 100 + 500) * 100) / 100, // Energy (kWh)
          frequency: Math.round((Math.random() * 2 + 49) * 100) / 100, // Frequency (Hz)
          powerFactor: Math.round((Math.random() * 0.2 + 0.8) * 100) / 100 // Power Factor
        };
        break;

      case 'SOLAR_PANEL':
        const hour = new Date().getHours();
        const solarMultiplier = hour >= 6 && hour <= 18 
          ? Math.sin((hour - 6) * Math.PI / 12) // Simulate daylight curve
          : 0;
        
        metrics = {
          power: Math.round((Math.random() * 1000 * solarMultiplier + 100) * 100) / 100, // Power (W)
          voltage: Math.round((Math.random() * 50 + 200) * 100) / 100, // Voltage (V)
          current: Math.round((Math.random() * 5 * solarMultiplier) * 100) / 100, // Current (A)
          irradiance: Math.round((Math.random() * 800 * solarMultiplier + 100) * 100) / 100, // Irradiance (W/m²)
          panelTemp: Math.round((Math.random() * 20 + 25) * 100) / 100, // Panel Temperature (°C)
          efficiency: Math.round((Math.random() * 5 + 15) * 100) / 100 // Efficiency (%)
        };
        break;

      case 'WEATHER_STATION':
        metrics = {
          temperature: Math.round((Math.random() * 15 + 10) * 100) / 100, // Temperature (°C)
          humidity: Math.round((Math.random() * 40 + 40) * 100) / 100, // Humidity (%)
          pressure: Math.round((Math.random() * 50 + 1000) * 100) / 100, // Pressure (hPa)
          windSpeed: Math.round((Math.random() * 20 + 2) * 100) / 100, // Wind Speed (m/s)
          windDirection: Math.round(Math.random() * 360), // Wind Direction (degrees)
          rainfall: Math.round((Math.random() * 5) * 100) / 100, // Rainfall (mm)
          uvIndex: Math.round(Math.random() * 10) // UV Index
        };
        break;

      case 'WATER_SENSOR':
        metrics = {
          flow: Math.round((Math.random() * 50 + 10) * 100) / 100, // Flow Rate (L/min)
          ph: Math.round((Math.random() * 2 + 6.5) * 100) / 100, // pH level
          tds: Math.round(Math.random() * 200 + 100), // Total Dissolved Solids (ppm)
          turbidity: Math.round((Math.random() * 5) * 100) / 100, // Turbidity (NTU)
          temperature: Math.round((Math.random() * 10 + 15) * 100) / 100, // Water Temperature (°C)
          level: Math.round((Math.random() * 100 + 50) * 100) / 100 // Water Level (%)
        };
        break;

      default:
        metrics = {
          value: Math.round((Math.random() * 100) * 100) / 100,
          status: 'active'
        };
    }

    return {
      deviceId: device.id,
      timestamp,
      metrics
    };
  }

  // Get current device status
  getDevices(): DeviceConfig[] {
    return this.devices;
  }

  // Get simulation status
  getStatus() {
    return {
      isRunning: this.isRunning,
      connected: this.client?.connected || false,
      deviceCount: this.devices.length,
      activeIntervals: this.intervals.size
    };
  }
}