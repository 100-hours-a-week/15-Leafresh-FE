/**
 * 환경에 따라, Client Fetcher의 오리진을 반환한다.
 */
export const getClientFetchOrigin = () => {
  const runtimeEnv = process.env.NEXT_PUBLIC_RUNTIME
  console.log('runtimeEnv: ', runtimeEnv)

  switch (runtimeEnv) {
    case 'local':
      // return 'https://dev-leafresh.app/api/next/proxy' // Dev FE 라우트
      // return 'https://fe.dev-leafresh.app/api/next/proxy'
      return 'https://springboot.dev-leafresh.app' // TODO: 현재는 백엔드 임시 개방 -> 추후 프론트엔드 프록시로 연결
    case 'dev':
      return 'https://dev-leafresh.app/api/next/proxy' // Dev FE 라우트
    case 'prod':
      return 'https://leafresh.app' // 로드밸런서
    default:
      throw new Error(`Unknown Client NEXT_PUBLIC_RUNTIME: ${runtimeEnv}`)
  }
}

/**
 * 환경에 따라, Server Fetcher의 오리진을 반환한다.
 */
export const getServerFetchOrigin = () => {
  const runtimeEnv = process.env.NEXT_PUBLIC_RUNTIME
  console.log('🫠server runtimeEnv: ', runtimeEnv)

  switch (runtimeEnv) {
    case 'local':
      // return 'https://dev-leafresh.app/api/next/proxy' // Dev FE 라우트
      return 'https://springboot.dev-leafresh.app'
    case 'dev':
      // return '35.216.18.52' //외부망으로 임시 연결
      return 'http://10.0.1.67:8080' // 내부망
    case 'prod':
      return 'https://leafresh.app' // 로드밸런서
    default:
      throw new Error(`Unknown Server NEXT_PUBLIC_RUNTIME: ${runtimeEnv}`)
  }
}
