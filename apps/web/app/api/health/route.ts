import { NextResponse } from 'next/server';

/**
 * RECIPRA Web — Health API Route.
 *
 * HITO 1: Basic health check endpoint.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: '@recipra/web',
    version: '0.1.0',
    milestone: 'HITO-1',
    timestamp: new Date().toISOString(),
  });
}
