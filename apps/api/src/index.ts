/**
 * @recipra/api
 *
 * API server foundation.
 *
 * HITO 1: Health/readiness endpoints only.
 * No business endpoints yet.
 *
 * CRITICAL:
 * - tenant_id, user_id, roles derived from session, NOT from client
 * - No economic endpoints without proper auth
 */

import { createServer } from 'node:http';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const server = createServer((req, res) => {
  // Health endpoint
  if (req.url === '/health' || req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: '@recipra/api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      milestone: 'HITO-1',
    }));
    return;
  }

  // Readiness endpoint
  if (req.url === '/ready' || req.url === '/api/ready') {
    // In production, check DB connection, Redis, etc.
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ready: true,
      checks: {
        database: 'not_configured',
        redis: 'not_configured',
      },
    }));
    return;
  }

  // API v1 prefix (future)
  if (req.url?.startsWith('/api/v1/')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'not_found',
      message: 'API v1 endpoints not yet implemented (HITO 2+)',
    }));
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not_found' }));
});

server.listen(PORT, () => {
  console.log(`[RECIPRA API] Listening on port ${PORT}`);
  console.log(`[RECIPRA API] Health: http://localhost:${PORT}/health`);
  console.log(`[RECIPRA API] Ready: http://localhost:${PORT}/ready`);
});

export { server };
