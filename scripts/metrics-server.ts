// scripts/metrics-server.ts
import http from 'http'
import client from 'prom-client'

// 전역 객체에 타입 선언 (TypeScript에서 오류 방지)
declare global {
  // eslint-disable-next-line no-var
  var metricsCollected: boolean | undefined
}

// 메트릭 수집 중복 방지
if (!global.metricsCollected) {
  client.collectDefaultMetrics({
    labels: {
      application_name: 'leafresh-frontend',
      env: process.env.NEXT_PUBLIC_RUNTIME,
    },
  })
  global.metricsCollected = true
  console.log('Prometheus metrics collected.')
}

const server = http.createServer(async (_req, res) => {
  res.setHeader('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
})

const port = 9103

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Prometheus metrics server is already running on port ${port}`)
  } else {
    console.error('Unexpected server error:', err)
  }
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Prometheus metrics server running on port ${port}`)
})

