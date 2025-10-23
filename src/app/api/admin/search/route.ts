import { NextResponse } from 'next/server';

// Force dynamic rendering - this route cannot be statically generated
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const entity = searchParams.get('entity') || 'all';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const status = searchParams.get('status');

    // TODO: Implement full-text search using database
    // For now, returning mock results
    const results = [
      {
        id: '1',
        title: `Sample result for "${query}"`,
        description: 'This is a sample search result. Implement database search here.',
        type: entity === 'all' ? 'Product' : entity,
        url: '/admin-panel/marketplace/products/1',
        metadata: {
          price: '₹1,000',
          status: 'active',
          date: new Date().toLocaleDateString(),
        },
      },
    ];

    return NextResponse.json({ results, count: results.length });
  } catch (error) {
    console.error('Search failed:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
