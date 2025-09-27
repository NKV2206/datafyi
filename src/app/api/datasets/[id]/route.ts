import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const idNum = parseInt(params.id, 10);
  if (isNaN(idNum)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const dataset = await prisma.dataset.findUnique({ where: { id: idNum } });
  if (!dataset) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ dataset });
}
