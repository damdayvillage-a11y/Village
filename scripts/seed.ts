import { PrismaClient } from '@prisma/client';
import { SAMPLE_DEVICES } from '../lib/device-simulator';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Smart Carbon-Free Village database...');

  // Create Damday Village
  const village = await db.village.upsert({
    where: { id: 'damday-village-001' },
    update: {},
    create: {
      id: 'damday-village-001',
      name: 'Damday Village',
      description: 'A carbon-neutral, culturally-rich, and technologically progressive model village in Pithoragarh, Uttarakhand.',
      latitude: 29.5456,
      longitude: 80.0964,
      elevation: 1650, // meters above sea level
      carbonScore: 95.5,
      digitalTwinData: {
        modelUrl: '/models/damday-village.gltf',
        lastUpdated: new Date().toISOString(),
        features: ['3d-buildings', 'terrain', 'vegetation']
      }
    }
  });

  console.log('✅ Created village:', village.name);

  // Create sample users
  const adminUser = await db.user.upsert({
    where: { email: 'admin@damdayvillage.org' },
    update: {},
    create: {
      email: 'admin@damdayvillage.org',
      name: 'Village Administrator',
      role: 'ADMIN',
      verified: true,
      preferences: {
        language: 'en',
        notifications: true
      }
    }
  });

  const hostUser = await db.user.upsert({
    where: { email: 'host@damdayvillage.org' },
    update: {},
    create: {
      email: 'host@damdayvillage.org',
      name: 'Raj Singh',
      role: 'HOST',
      verified: true,
      phone: '+91-9876543210',
      preferences: {
        language: 'hi',
        notifications: true
      }
    }
  });

  console.log('✅ Created users:', adminUser.name, 'and', hostUser.name);

  // Create sample homestay
  const homestay = await db.homestay.create({
    data: {
      name: 'Traditional Himalayan Home',
      description: 'Experience authentic village life in this traditional stone house with modern amenities and stunning mountain views.',
      ownerId: hostUser.id,
      villageId: village.id,
      latitude: 29.5460,
      longitude: 80.0970,
      address: 'Village Road, Damday, Gangolihat, Pithoragarh - 262524',
      rooms: 3,
      maxGuests: 6,
      basePrice: 2500.0, // INR per night
      amenities: [
        'mountain_view',
        'traditional_kitchen',
        'organic_garden',
        'solar_power',
        'local_guides',
        'cultural_activities'
      ],
      photos: [
        '/images/homestays/himalayan-home-1.jpg',
        '/images/homestays/himalayan-home-2.jpg',
        '/images/homestays/himalayan-home-3.jpg'
      ],
      assets3D: {
        modelUrl: '/models/homestays/himalayan-home.gltf',
        thumbnailUrl: '/images/homestays/himalayan-home-3d.jpg'
      }
    }
  });

  console.log('✅ Created homestay:', homestay.name);

  // Create IoT devices from the simulation configuration
  for (const deviceConfig of SAMPLE_DEVICES) {
    const device = await db.device.upsert({
      where: { id: deviceConfig.id },
      update: {},
      create: {
        id: deviceConfig.id,
        name: deviceConfig.name,
        type: deviceConfig.type as any,
        villageId: village.id,
        latitude: deviceConfig.location.latitude,
        longitude: deviceConfig.location.longitude,
        location: deviceConfig.location.description,
        config: {
          mqttTopic: deviceConfig.mqttTopic,
          telemetryInterval: deviceConfig.telemetryInterval,
          sensorType: deviceConfig.type
        },
        schema: getDeviceSchema(deviceConfig.type),
        status: 'OFFLINE',
        firmware: '1.0.0'
      }
    });

    console.log('✅ Created device:', device.name);
  }

  // Create sample project
  const project = await db.project.create({
    data: {
      name: 'Solar Microgrid Expansion',
      description: 'Expand the village solar microgrid to power 50 additional households and enable electric vehicle charging.',
      creatorId: adminUser.id,
      villageId: village.id,
      fundingGoal: 500000.0, // INR
      currentFunding: 125000.0,
      status: 'VOTING',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      ledgerEntries: [
        {
          id: 1,
          date: new Date().toISOString(),
          type: 'initial_funding',
          amount: 125000,
          description: 'Initial funding from government grant',
          source: 'Uttarakhand Renewable Energy Development Agency'
        }
      ],
      photos: [
        '/images/projects/solar-expansion-1.jpg',
        '/images/projects/solar-expansion-2.jpg'
      ]
    }
  });

  console.log('✅ Created project:', project.name);

  // Create sample products for marketplace
  const products = [
    {
      name: 'Hand-woven Kumaoni Shawl',
      description: 'Traditional woolen shawl hand-woven by local artisans using organic wool from village sheep.',
      category: 'textiles',
      price: 3500.0,
      stock: 15,
      locallySourced: true,
      carbonFootprint: 0.5,
      images: ['/images/products/kumaoni-shawl-1.jpg', '/images/products/kumaoni-shawl-2.jpg']
    },
    {
      name: 'Organic Himalayan Honey',
      description: 'Pure, raw honey from high-altitude beehives. Rich in minerals and naturally therapeutic.',
      category: 'food',
      price: 800.0,
      stock: 50,
      locallySourced: true,
      carbonFootprint: 0.1,
      images: ['/images/products/himalayan-honey-1.jpg']
    },
    {
      name: 'Handcrafted Wooden Bowl Set',
      description: 'Set of 4 traditional wooden bowls carved from sustainable local wood.',
      category: 'handicrafts',
      price: 1200.0,
      stock: 8,
      locallySourced: true,
      carbonFootprint: 0.3,
      images: ['/images/products/wooden-bowls-1.jpg', '/images/products/wooden-bowls-2.jpg']
    }
  ];

  for (const productData of products) {
    const product = await db.product.create({
      data: {
        ...productData,
        sellerId: hostUser.id
      }
    });
    console.log('✅ Created product:', product.name);
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log('\nSample data created:');
  console.log('- 1 Village (Damday Village)');
  console.log('- 2 Users (Admin & Host)');
  console.log('- 1 Homestay');
  console.log('- 3 IoT Devices');
  console.log('- 1 Community Project');
  console.log('- 3 Marketplace Products');
}

function getDeviceSchema(deviceType: string) {
  switch (deviceType) {
    case 'AIR_QUALITY':
      return {
        metrics: {
          pm25: { type: 'number', unit: 'μg/m³', description: 'PM2.5 particles' },
          pm10: { type: 'number', unit: 'μg/m³', description: 'PM10 particles' },
          co2: { type: 'number', unit: 'ppm', description: 'Carbon dioxide' },
          humidity: { type: 'number', unit: '%', description: 'Relative humidity' },
          temperature: { type: 'number', unit: '°C', description: 'Air temperature' },
          aqi: { type: 'number', unit: 'index', description: 'Air Quality Index' }
        }
      };

    case 'ENERGY_METER':
      return {
        metrics: {
          voltage: { type: 'number', unit: 'V', description: 'Voltage' },
          current: { type: 'number', unit: 'A', description: 'Current' },
          power: { type: 'number', unit: 'W', description: 'Active power' },
          energy: { type: 'number', unit: 'kWh', description: 'Energy consumed' },
          frequency: { type: 'number', unit: 'Hz', description: 'Frequency' },
          powerFactor: { type: 'number', unit: 'ratio', description: 'Power factor' }
        }
      };

    case 'WEATHER_STATION':
      return {
        metrics: {
          temperature: { type: 'number', unit: '°C', description: 'Air temperature' },
          humidity: { type: 'number', unit: '%', description: 'Relative humidity' },
          pressure: { type: 'number', unit: 'hPa', description: 'Atmospheric pressure' },
          windSpeed: { type: 'number', unit: 'm/s', description: 'Wind speed' },
          windDirection: { type: 'number', unit: 'degrees', description: 'Wind direction' },
          rainfall: { type: 'number', unit: 'mm', description: 'Rainfall' },
          uvIndex: { type: 'number', unit: 'index', description: 'UV Index' }
        }
      };

    default:
      return {
        metrics: {
          value: { type: 'number', unit: 'generic', description: 'Sensor value' },
          status: { type: 'string', description: 'Device status' }
        }
      };
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });