import { BlogPost, MicroCMSListResponse } from './types'

export class MicroCMSClient {
  private serviceDomain: string
  private apiKey: string

  constructor(serviceDomain: string, apiKey: string) {
    this.serviceDomain = serviceDomain
    this.apiKey = apiKey
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `https://${this.serviceDomain}.microcms.io/api/v1/${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'X-MICROCMS-API-KEY': this.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`microCMS API error: ${response.status}`)
    }

    return response.json()
  }

  async getPosts(limit = 10, offset = 0): Promise<MicroCMSListResponse<BlogPost>> {
    return this.request<MicroCMSListResponse<BlogPost>>(`blogs?limit=${limit}&offset=${offset}`)
  }

  async getPost(id: string): Promise<BlogPost> {
    return this.request<BlogPost>(`blogs/${id}`)
  }

  async getPostBySlug(slug: string): Promise<BlogPost> {
    const response = await this.request<MicroCMSListResponse<BlogPost>>(`blogs?filters=slug[equals]${slug}`)
    if (response.contents.length === 0) {
      throw new Error('Post not found')
    }
    return response.contents[0]
  }
}