/**
 * 환경에 따라, Client Fetcher의 오리진을 반환한다.
 */
export const getClientFetchOrigin = () => {
  const runtimeEnv = process.env.NEXT_PUBLIC_RUNTIME

  switch (runtimeEnv) {
    case 'local':
      // return 'https://dev-leafresh.app/api/next/proxy' // V1
      // return 'https://springboot.dev-leafresh.app' // V2
      // return 'https://fe.dev-leafresh.app/api/next/proxy' // V2
      return 'https://leafresh.app'
    // case 'dev':
    //   return 'https://dev-leafresh.app/api/next/proxy' // V2
    case 'prod':
      return 'https://leafresh.app'
    default:
      throw new Error(`Unknown Client NEXT_PUBLIC_RUNTIME: ${runtimeEnv}`)
  }
}

/**
 * 환경에 따라, Server Fetcher의 오리진을 반환한다.
 */
export const getServerFetchOrigin = () => {
  const runtimeEnv = process.env.NEXT_PUBLIC_RUNTIME

  switch (runtimeEnv) {
    case 'local':
      // return 'https://springboot.dev-leafresh.app' // V2
      // return 'https://dev-leafresh.app/api/next/proxy' // V2
      return 'https://leafresh.app' // V3
    // case 'dev':
    // return 'http://10.0.1.67:8080' // V2
    // return 'http://backend-service.default.svc.cluster.local:80' // V3
    case 'prod':
      return 'https://leafresh.app' // V3
    default:
      throw new Error(`Unknown Server NEXT_PUBLIC_RUNTIME: ${runtimeEnv}`)
  }
}
