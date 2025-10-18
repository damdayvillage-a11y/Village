import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

// POST /api/telemetry - Ingest sensor telemetry data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.deviceId || !body.metrics) {
      return NextResponse.json(
        { error: 'deviceId and metrics are required' },
        { status: 400 }
      );
    }

    // Check if device exists and update last seen
    const device = await db.device.findUnique({
      where: { id: body.deviceId }
    });

    if (!device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }

    // Update device status and last seen
    await db.device.update({
      where: { id: body.deviceId },
      data: {
        status: 'ONLINE',
        lastSeen: new Date()
      }
    });

    // Store sensor reading
    const reading = await db.sensorReading.create({
      data: {
        deviceId: body.deviceId,
        timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
        metrics: body.metrics
      }
    });

    return NextResponse.json(reading, { status: 201 });
  } catch (error) {
    console.error('Failed to store telemetry:', error);
    return NextResponse.json(
      { error: 'Failed to store telemetry data' },
      { status: 500 }
    );
  }
}

// GET /api/telemetry - Query sensor telemetry data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limit = parseInt(searchParams.get('limit') || '100');

    if (!deviceId) {
      return NextResponse.json(
        { error: 'deviceId parameter is required' },
        { status: 400 }
      );
    }

    const where: any = { deviceId };

    // Add time range filters
    if (from || to) {
      where.timestamp = {};
      if (from) where.timestamp.gte = new Date(from);
      if (to) where.timestamp.lte = new Date(to);
    }

    const readings = await db.sensorReading.findMany({
      where,
      orderBy: {
        timestamp: 'desc'
      },
      take: Math.min(limit, 1000), // Cap at 1000 records
      include: {
        device: {
          select: {
            name: true,
            type: true,
            location: true
          }
        }
      }
    });

    return NextResponse.json({
      readings,
      count: readings.length,
      deviceId,
      timeRange: {
        from: from || null,
        to: to || null
      }
    });
  } catch (error) {
    console.error('Failed to query telemetry:', error);
    return NextResponse.json(
      { error: 'Failed to query telemetry data' },
      { status: 500 }
    );
  }
}