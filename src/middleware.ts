import { type NextRequest, NextResponse } from 'next/server'

import { checkAuth, checkMaintenance } from '@/shared/lib'

export async function middleware(request: NextRequest) {
  const maintenanceResponse = await checkMaintenance(request)
  if (maintenanceResponse) return maintenanceResponse

  const authResponse = await checkAuth(request)
  if (authResponse) return authResponse

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon\\.ico|.*\\..*).*)'],
}
