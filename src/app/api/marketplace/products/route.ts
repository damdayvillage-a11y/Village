import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  seller: string;
  category: string;
  description: string;
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// Sample product data for marketplace
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Handwoven Pashmina Shawl',
    price: 15000,
    rating: 4.9,
    seller: 'Himalayan Handicrafts Co.',
    category: 'Local Crafts',
    description: 'Authentic handwoven pashmina shawl crafted by skilled artisans from the high Himalayas. Made from the finest cashmere wool, this luxurious shawl represents centuries of traditional craftsmanship.',
    stock: 5,
    images: ['/api/placeholder/400/400'],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2', 
    name: 'Organic Himalayan Honey',
    price: 800,
    rating: 4.8,
    seller: 'Mountain View Organic Farm',
    category: 'Organic Food',
    description: 'Pure, raw organic honey harvested from wildflowers in pristine Himalayan valleys. Rich in antioxidants and natural enzymes.',
    stock: 12,
    images: ['/api/placeholder/400/400'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z'
  },
  {
    id: '3',
    name: 'Traditional Copper Water Bottle',
    price: 1200,
    rating: 4.9,
    seller: 'Local Artisan Collective',
    category: 'Local Crafts',
    description: 'Handcrafted copper water bottle with intricate traditional designs. Health benefits according to Ayurveda.',
    stock: 8,
    images: ['/api/placeholder/400/400'],
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-22T16:00:00Z'
  },
  {
    id: '4',
    name: 'Himalayan Pink Rock Salt',
    price: 300,
    rating: 4.7,
    seller: 'Village Cooperative',
    category: 'Organic Food',
    description: 'Natural pink rock salt mined from ancient Himalayan salt deposits. Rich in minerals and trace elements.',
    stock: 25,
    images: ['/api/placeholder/400/400'],
    createdAt: '2024-01-08T07:00:00Z',
    updatedAt: '2024-01-28T12:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredProducts = [...sampleProducts];

    // Filter by category
    if (category && category !== 'All') {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    const response = {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit)
      },
      filters: {
        categories: Array.from(new Set(sampleProducts.map(p => p.category))),
        sellers: Array.from(new Set(sampleProducts.map(p => p.seller)))
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productData.name,
      price: productData.price,
      rating: 0,
      seller: productData.seller,
      category: productData.category,
      description: productData.description,
      stock: productData.stock,
      images: productData.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ message: 'Product created successfully', product: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}