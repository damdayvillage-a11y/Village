import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

// GET /api/devices - List all devices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const [devices, total] = await Promise.all([
      db.device.findMany({
        where,
        skip,
        take: limit,
        include: {
          village: true,
          _count: {
            select: {
              readings: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      db.device.count({ where })
    ]);

    return NextResponse.json({
      devices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch devices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}

// POST /api/devices - Create a new device
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const device = await db.device.create({
      data: {
        name: body.name,
        type: body.type,
        villageId: body.villageId,
        latitude: body.latitude,
        longitude: body.longitude,
        elevation: body.elevation,
        location: body.location,
        config: body.config,
        schema: body.schema,
        firmware: body.firmware,
        status: 'OFFLINE' // Default status
      },
      include: {
        village: true
      }
    });

    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    console.error('Failed to create device:', error);
    return NextResponse.json(
      { error: 'Failed to create device' },
      { status: 500 }
    );
  }
}