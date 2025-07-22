import http from 'http'
import v8 from 'v8'

import client from 'prom-client'

// `collectDefaultMetrics()`는 내부적으로 `setInterval`을 사용하여 메모리 누수를 유발할 수 있으므로 사용하지 않습니다.
// 대신 Prometheus가 메트릭을 요청할 때마다 수동으로 필요한 메트릭을 수집합니다.

const heapLimitGauge = new client.Gauge({
  name: 'process_heap_size_limit_bytes',
  help: 'Maximum heap size limit in bytes',
})
const heapUsedGauge = new client.Gauge({
  name: 'nodejs_heap_size_used_bytes',
  help: 'Node.js heap size used in bytes',
})
const heapTotalGauge = new client.Gauge({
  name: 'nodejs_heap_size_total_bytes',
  help: 'Node.js heap size total in bytes',
})

const server = http.createServer(async (_req, res) => {
  // 메트릭 요청이 올 때마다 힙 통계를 업데이트합니다.
  const heapStats = v8.getHeapStatistics()
  heapLimitGauge.set(heapStats.heap_size_limit)
  heapUsedGauge.set(heapStats.used_heap_size)
  heapTotalGauge.set(heapStats.total_heap_size)

  res.setHeader('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
})

server.listen(9103, '0.0.0.0', () => {
  console.log('Prometheus metrics server running on port 9103')
})
