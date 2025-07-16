import { Hono } from 'hono'
import { MicroCMSClient } from './microcms'

type Bindings = {
  MICROCMS_SERVICE_DOMAIN: string
  MICROCMS_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hono Blog</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .nav { margin: 20px 0; }
        .nav a { margin-right: 20px; }
      </style>
    </head>
    <body>
      <h1>Hono Blog</h1>
      <p>Welcome to our blog powered by Hono and microCMS!</p>
      <nav class="nav">
        <a href="/">ホーム</a>
        <a href="/posts">記事一覧</a>
      </nav>
    </body>
    </html>
  `)
})

app.get('/posts', async (c) => {
  try {
    const client = new MicroCMSClient(
      c.env.MICROCMS_SERVICE_DOMAIN,
      c.env.MICROCMS_API_KEY
    )
    
    const posts = await client.getPosts()
    
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>記事一覧 - Hono Blog</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .nav { margin: 20px 0; }
          .nav a { margin-right: 20px; }
          .post-list { margin-top: 30px; }
          .post-item { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
          .post-title { font-size: 1.5em; margin-bottom: 10px; }
          .post-date { color: #666; font-size: 0.9em; }
          .post-summary { margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>記事一覧</h1>
        <nav class="nav">
          <a href="/">ホーム</a>
          <a href="/posts">記事一覧</a>
        </nav>
        
        <div class="post-list">
          ${posts.contents.map(post => `
            <article class="post-item">
              <h2 class="post-title">
                <a href="/posts/${post.id}">${post.title}</a>
              </h2>
              <div class="post-date">${new Date(post.publishedAt).toLocaleDateString('ja-JP')}</div>
              ${post.summary ? `<div class="post-summary">${post.summary}</div>` : ''}
            </article>
          `).join('')}
        </div>
      </body>
      </html>
    `)
  } catch (error) {
    return c.html(`
      <h1>エラーが発生しました</h1>
      <p>記事の取得に失敗しました。</p>
      <a href="/">ホームに戻る</a>
    `, 500)
  }
})

app.get('/posts/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const client = new MicroCMSClient(
      c.env.MICROCMS_SERVICE_DOMAIN,
      c.env.MICROCMS_API_KEY
    )
    
    const post = await client.getPost(id)
    
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${post.title} - Hono Blog</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .nav { margin: 20px 0; }
          .nav a { margin-right: 20px; }
          .post-meta { color: #666; font-size: 0.9em; margin-bottom: 30px; }
          .post-content { line-height: 1.6; }
          .post-content h2 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px; }
          .post-content h3 { color: #555; }
          .post-content p { margin-bottom: 1em; }
          .post-content pre { background: #f5f5f5; padding: 15px; overflow-x: auto; }
          .post-content code { background: #f5f5f5; padding: 2px 4px; }
          .back-link { margin-top: 40px; }
        </style>
      </head>
      <body>
        <nav class="nav">
          <a href="/">ホーム</a>
          <a href="/posts">記事一覧</a>
        </nav>
        
        <article>
          <h1>${post.title}</h1>
          <div class="post-meta">
            公開日: ${new Date(post.publishedAt).toLocaleDateString('ja-JP')}
            ${post.updatedAt !== post.publishedAt ? 
              ` | 更新日: ${new Date(post.updatedAt).toLocaleDateString('ja-JP')}` : ''}
          </div>
          
          <div class="post-content">
            ${post.content}
          </div>
        </article>
        
        <div class="back-link">
          <a href="/posts">← 記事一覧に戻る</a>
        </div>
      </body>
      </html>
    `)
  } catch (error) {
    return c.html(`
      <h1>記事が見つかりません</h1>
      <p>指定された記事は存在しないか、削除された可能性があります。</p>
      <a href="/posts">記事一覧に戻る</a>
    `, 404)
  }
})

export default app