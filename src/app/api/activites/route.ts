import { NextRequest, NextResponse } from 'next/server';
import { mockActivites } from '@/lib/mock-data';

// GET /api/activites
export async function GET(request: NextRequest) {
  try {
    // TODO(api): Replace with real database query
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const searchParams = request.nextUrl.searchParams;
    const module = searchParams.get('module');
    const statut = searchParams.get('statut');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let filteredActivites = mockActivites;
    
    if (module) {
      filteredActivites = filteredActivites.filter(a => a.module === module);
    }
    
    if (statut) {
      filteredActivites = filteredActivites.filter(a => a.statut === statut);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedActivites = filteredActivites.slice(startIndex, endIndex);
    
    return NextResponse.json({
      data: paginatedActivites,
      total: filteredActivites.length,
      page,
      limit,
      totalPages: Math.ceil(filteredActivites.length / limit)
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch activites' },
      { status: 500 }
    );
  }
}

// POST /api/activites
export async function POST(request: NextRequest) {
  try {
    const activiteData = await request.json();
    
    // TODO(api): Validate and save to database
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newActivite = {
      id: Date.now().toString(),
      ...activiteData,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json(newActivite, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create activite' },
      { status: 500 }
    );
  }
}