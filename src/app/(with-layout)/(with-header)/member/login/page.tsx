import { use } from 'react'

import { LoginPage } from '@/widgets/member'

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const authorized = use(searchParams).authorized
  const isExpired = use(searchParams).expired === 'true'

  return <LoginPage authorized={authorized} isExpired={isExpired} />
}
