'use client'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'
import { theme } from '@shared/styles/emotion/theme'


type Post = {
  id: number
  title: string
  body: string
}

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export default function PostList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['test', 'posts'],
    queryFn: fetchPosts,
  })

  if (isLoading) return <p>로딩 중...</p>
  if (isError) return <p>에러 발생: {(error as Error).message}</p>

  return (
    <ul>
      {data?.slice(0, 10).map(post => (
        <Item key={post.id}>
          <strong>{'세상에 이런 폰트가 나오다니 천재인듯'}</strong>
          <p>{'나는 프리텐타드 폰트라고 적용해본건데 잘 된건가요?'}</p>
        </Item>
      ))}
    </ul>
  )
}

const Item = styled.li`
  font-family: ${theme.fontFamily.pretendard};
`
