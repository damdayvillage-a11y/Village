#!/usr/bin/env ts-node

/**
 * Device Simulator CLI Tool
 * Usage: npm run device-sim [command]
 */

import { DeviceSimulator, SAMPLE_DEVICES } from '../lib/device-simulator';

class DeviceSimCLI {
  private simulator: DeviceSimulator;

  constructor() {
    const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
    this.simulator = new DeviceSimulator(brokerUrl, SAMPLE_DEVICES);
  }

  async start() {
    try {
      console.log('🔌 Connecting to MQTT broker...');
      await this.simulator.connect();
      
      console.log('📋 Available devices:');
      this.simulator.getDevices().forEach(device => {
        console.log(`  - ${device.name} (${device.type}) at ${device.location.description}`);
      });

      console.log('\n🚀 Starting simulation...');
      this.simulator.startSimulation();

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n⏹️ Shutting down device simulator...');
        this.simulator.stopSimulation();
        this.simulator.disconnect();
        process.exit(0);
      });

      console.log('✅ Device simulation started. Press Ctrl+C to stop.');
      
      // Keep the process running
      setInterval(() => {
        const status = this.simulator.getStatus();
        if (status.isRunning) {
          console.log(`📊 Simulation active - ${status.deviceCount} devices sending telemetry`);
        }
      }, 30000); // Status update every 30 seconds

    } catch (error) {
      console.error('❌ Failed to start device simulation:', error);
      process.exit(1);
    }
  }

  async stop() {
    console.log('⏹️ Stopping device simulation...');
    this.simulator.stopSimulation();
    this.simulator.disconnect();
    console.log('✅ Device simulation stopped');
  }

  listDevices() {
    console.log('📋 Available devices:');
    console.log('ID | Name | Type | Location');
    console.log('---|------|------|----------');
    
    this.simulator.getDevices().forEach(device => {
      console.log(`${device.id} | ${device.name} | ${device.type} | ${device.location.description}`);
    });
  }

  showHelp() {
    console.log(`
🏔️ Smart Carbon-Free Village - Device Simulator

Usage: npm run device-sim [command]

Commands:
  start     Start the device simulation (default)
  stop      Stop the device simulation
  list      List available devices
  help      Show this help message

Environment Variables:
  MQTT_BROKER_URL    MQTT broker URL (default: mqtt://localhost:1883)

Examples:
  npm run device-sim start
  npm run device-sim list
  MQTT_BROKER_URL=mqtt://192.168.1.100:1883 npm run device-sim start
    `);
  }
}

// Parse command line arguments
const command = process.argv[2] || 'start';
const cli = new DeviceSimCLI();

switch (command) {
  case 'start':
    cli.start();
    break;
  case 'stop':
    cli.stop();
    break;
  case 'list':
    cli.listDevices();
    break;
  case 'help':
  case '--help':
  case '-h':
    cli.showHelp();
    break;
  default:
    console.error(`❌ Unknown command: ${command}`);
    cli.showHelp();
    process.exit(1);
}