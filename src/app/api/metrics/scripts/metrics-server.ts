// scripts/metrics-server.ts
import http from 'http'

import client from 'prom-client'

client.collectDefaultMetrics({
  labels: {
    application_name: 'leafresh-frontend',
    env: 'production',
  },
})

const server = http.createServer(async (_req, res) => {
  res.setHeader('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
})

server.listen(9103, () => {
  console.log('Prometheus metrics server running on port 9103')
})

server.listen(9103)
