import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';


export async function GET(req: Request) {
  try {
    let tags: string[] = [];

    try {
      const body = await req.json().catch(() => undefined);
      const raw = body?.tags as unknown;

      if (Array.isArray(raw)) {
        tags = raw.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof raw === 'string') {
        tags = raw
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    } catch {
    }

    if (!tags.length) {
      return NextResponse.json(
        { error: 'Request body must include `tags` as an array or comma-separated string' },
        { status: 400 },
      );
    }

    const datasets = await prisma.dataset.findMany({
      where: {
        OR: tags.map((tag) => ({
          tags: { contains: tag, mode: 'insensitive' },
        })),
      },
      orderBy: { id: 'desc' },
      select: {
        id: true,
        name: true,
        tags: true,
        description: true,
        owner: true,
        size: true,
        userId: true,
      },
    });

    return NextResponse.json({ ok: true, datasets });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch datasets' }, { status: 500 });
  }
}
