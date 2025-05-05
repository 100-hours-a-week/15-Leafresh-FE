'use client'

import { useQuery } from '@tanstack/react-query'

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
        <li key={post.id}>
          <strong>{post.title}</strong>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  )
}
