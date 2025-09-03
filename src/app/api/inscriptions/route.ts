import { NextRequest, NextResponse } from 'next/server';
import { mockInscriptions } from '@/lib/mock-data';

// GET /api/inscriptions
export async function GET(request: NextRequest) {
  try {
    // TODO(api): Replace with real database query
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const activiteId = searchParams.get('activiteId');
    const statut = searchParams.get('statut');
    
    let filteredInscriptions = mockInscriptions;
    
    if (userId) {
      filteredInscriptions = filteredInscriptions.filter(i => i.userId === userId);
    }
    
    if (activiteId) {
      filteredInscriptions = filteredInscriptions.filter(i => i.activiteId === activiteId);
    }
    
    if (statut) {
      filteredInscriptions = filteredInscriptions.filter(i => i.statut === statut);
    }
    
    return NextResponse.json({
      data: filteredInscriptions,
      total: filteredInscriptions.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch inscriptions' },
      { status: 500 }
    );
  }
}

// POST /api/inscriptions
export async function POST(request: NextRequest) {
  try {
    const inscriptionData = await request.json();
    
    // TODO(api): Validate eligibility rules and save to database
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newInscription = {
      id: Date.now().toString(),
      ...inscriptionData,
      dateInscription: new Date().toISOString(),
      statut: 'soumise'
    };
    
    return NextResponse.json(newInscription, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create inscription' },
      { status: 500 }
    );
  }
}