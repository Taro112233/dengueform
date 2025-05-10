import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (data.age === null || data.gender === null || data.priorExposure === null) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create assessment record in database
    const assessment = await prisma.assessment.create({
      data: {
        age: data.age,
        gender: data.gender,
        priorExposure: data.priorExposure,
        conditions: data.conditions,
        recommendation: data.recommendation,
        reason: data.reason
      },
    });

    return NextResponse.json({ success: true, id: assessment.id }, { status: 201 });
  } catch (error) {
    console.error('Error saving assessment:', error);
    return NextResponse.json(
      { error: 'Failed to save assessment' },
      { status: 500 }
    );
  }
}