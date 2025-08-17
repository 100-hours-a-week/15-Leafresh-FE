const RUNTIME = process.env.NEXT_PUBLIC_RUNTIME // 'local', 'dev', 'prod'

export const GCS_BUCKET = RUNTIME === 'prod' ? 'leafresh-prod-images' : 'leafresh-gcs-images'
