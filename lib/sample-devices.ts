// Sample device configurations for seeding
// Extracted from device-simulator.ts to avoid importing mqtt in seed scripts

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
