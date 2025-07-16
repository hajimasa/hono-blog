export interface BlogPost {
  id: string
  title: string
  content: string
  publishedAt: string
  updatedAt: string
  createdAt: string
  revisedAt: string
  slug?: string
  summary?: string
  category?: {
    id: string
    name: string
  }
}

export interface MicroCMSListResponse<T> {
  contents: T[]
  totalCount: number
  offset: number
  limit: number
}