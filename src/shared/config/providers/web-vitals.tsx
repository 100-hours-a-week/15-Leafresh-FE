'use client'

import { useReportWebVitals } from 'next/web-vitals'

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0]

// 각 지표별 기준값 정의
const METRIC_THRESHOLDS: Record<string, number> = {
  FCP: 1800, // ≤ 1.8s
  LCP: 2500, // ≤ 2.5s
  CLS: 0.1, // ≤ 0.1
  TBT: 200, // ≤ 200ms
  INP: 200, // ≤ 200ms
  TTFB: 200, // ≤ 200ms
}

const handleWebVitals: ReportWebVitalsCallback = metric => {
  const { name, value } = metric
  const threshold = METRIC_THRESHOLDS[name]
  if (threshold !== undefined) {
    const isPass = value <= threshold
    console.log(
      `%c📈 ${name}: ${value.toFixed(2)}ms → ${isPass ? '✅ 통과' : '❌ 기준 초과'} (기준: ${threshold}${name === 'CLS' ? '' : 'ms'})`,
      `color: ${isPass ? 'green' : 'red'}; font-weight: bold;`,
    )
  } else {
    console.log(`📊 ${name}: ${value}`)
  }
}

export function WebVitals() {
  useReportWebVitals(handleWebVitals)
  return null
}
