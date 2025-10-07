import { NextRequest, NextResponse } from 'next/server'

// Mock real-time village data
export async function GET(request: NextRequest) {
  try {
    // Simulate real-time environmental data
    const now = new Date()
    
    const villageInfo = {
      location: {
        name: 'Damday Village',
        district: 'Pithoragarh',
        state: 'Uttarakhand',
        country: 'India',
        coordinates: {
          latitude: 29.8167,
          longitude: 80.2667,
          elevation: 1800 // meters above sea level
        }
      },
      population: {
        total: 150,
        households: 32,
        avgFamilySize: 4.7
      },
      environmental: {
        airQuality: {
          pm25: Math.round(15 + Math.sin(Date.now() / 100000) * 5), // 10-20 range
          pm10: Math.round(25 + Math.sin(Date.now() / 120000) * 8), // 17-33 range
          aqi: Math.round(45 + Math.sin(Date.now() / 80000) * 15), // 30-60 range (Good)
          status: 'Excellent'
        },
        weather: {
          temperature: Math.round(18 + Math.sin(Date.now() / 200000) * 8), // 10-26°C
          humidity: Math.round(65 + Math.sin(Date.now() / 150000) * 20), // 45-85%
          windSpeed: Math.round(8 + Math.sin(Date.now() / 180000) * 5), // 3-13 km/h
          visibility: 15, // km
          uvIndex: Math.max(0, Math.round(4 + Math.sin(Date.now() / 100000) * 3)) // 1-7
        },
        carbonFootprint: {
          dailyEmissions: 0.05, // tons CO2/day (net zero target)
          monthlyOffset: 12.3, // tons CO2 offset this month
          yearlyGoal: 150, // tons CO2 offset goal
          status: 'Net Negative'
        }
      },
      energy: {
        solar: {
          currentGeneration: Math.round(450 + Math.sin(Date.now() / 100000) * 200), // kW
          dailyGeneration: Math.round(3200 + Math.sin(Date.now() / 500000) * 800), // kWh
          efficiency: 89.5, // %
          coverage: 85 // % of village energy needs
        },
        consumption: {
          current: Math.round(320 + Math.sin(Date.now() / 80000) * 150), // kW
          daily: Math.round(2400 + Math.sin(Date.now() / 400000) * 600), // kWh
          residential: 65, // % of total
          community: 25, // % of total
          infrastructure: 10 // % of total
        },
        grid: {
          status: 'Grid Positive', // More generation than consumption
          surplus: Math.round(130 + Math.sin(Date.now() / 120000) * 80) // kW surplus
        }
      },
      lastUpdated: now.toISOString(),
      dataFreshness: 'Real-time', // Updated every 30 seconds
      apiVersion: '1.0'
    }

    return NextResponse.json(villageInfo, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error fetching village info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch village information' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}