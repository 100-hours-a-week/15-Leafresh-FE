// app/api/metrics/route.ts
import { NextRequest } from 'next/server'

import client from 'prom-client'

const collectDefaultMetrics = client.collectDefaultMetrics

let isMetricsInitialized = false

if (process.env.NODE_ENV === 'production' && !isMetricsInitialized) {
  collectDefaultMetrics({
    labels: {
      application_name: 'leafresh-frontend',
      env: 'production',
    },
  })
  isMetricsInitialized = true
}

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return new Response('Not allowed in this environment', { status: 403 })
  }

  const metrics = await client.register.metrics()

  return new Response(metrics, {
    status: 200,
    headers: {
      'Content-Type': client.register.contentType,
    },
  })
}

export const dynamic = 'force-dynamic'
