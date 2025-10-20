import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Generate invoice for an order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch order with all details
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                currency: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Generate invoice data
    const invoiceData = {
      invoiceNumber: `INV-${order.id.substring(0, 8)}`,
      orderId: order.id,
      date: order.createdAt,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
      },
      items: order.items.map((item: any) => ({
        name: item.product?.name || 'Unknown Product',
        quantity: item.quantity || 1,
        price: item.price || 0,
        total: item.price * item.quantity,
      })),
      subtotal: order.total,
      tax: 0, // Calculate based on your tax rules
      total: order.total,
      currency: order.currency,
      status: order.status,
    };

    // For now, return JSON. In production, generate PDF
    return NextResponse.json({
      invoice: invoiceData,
      message: 'Invoice data generated. PDF generation coming soon.',
    });
  } catch (error) {
    console.error('Failed to generate invoice:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
