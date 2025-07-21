import http from 'http'
import v8 from 'v8'

import client from 'prom-client'

client.collectDefaultMetrics({
  labels: {
    application_name: 'leafresh-frontend',
    env: process.env.NEXT_PUBLIC_RUNTIME,
  },
})

const heapLimitGauge = new client.Gauge({
  name: 'process_heap_size_limit_bytes',
  help: 'Maximum heap size limit in bytes',
})
heapLimitGauge.set(v8.getHeapStatistics().heap_size_limit)

const server = http.createServer(async (_req, res) => {
  res.setHeader('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
})

server.listen(9103, '0.0.0.0', () => {
  console.log('Prometheus metrics server running on port 9103')
})
