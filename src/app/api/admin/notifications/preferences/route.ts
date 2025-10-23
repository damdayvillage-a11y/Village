import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Fetch preferences from database
    const preferences = {
      email: true,
      push: true,
      inApp: true,
      categories: {
        booking: true,
        order: true,
        user: true,
        system: true,
        marketplace: true,
      },
    };

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Failed to fetch preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const preferences = await request.json();
    
    // TODO: Save preferences to database
    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    console.error('Failed to save preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}
