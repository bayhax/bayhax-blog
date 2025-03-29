import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

async function handleEvent(event) {
  const url = new URL(event.request.url)
  
  // 处理API请求
  if (url.pathname.startsWith('/api/')) {
    return handleApiRequest(event)
  }
  
  let options = {}

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    }
    const page = await getAssetFromKV(event, options)

    // allow headers to be altered
    const response = new Response(page.body, page)

    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'unsafe-url')
    response.headers.set('Feature-Policy', 'none')

    return response

  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
        })

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 })
  }
}

// 处理API请求
async function handleApiRequest(event) {
  const url = new URL(event.request.url)
  const path = url.pathname
  const method = event.request.method
  
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }
  
  // 处理OPTIONS请求（预检请求）
  if (method === 'OPTIONS') {
    return new Response(null, { headers })
  }
  
  // 处理阅读量API
  if (path.startsWith('/api/views/')) {
    const postSlug = path.replace('/api/views/', '')
    if (!postSlug) {
      return new Response(JSON.stringify({ error: '无效的文章ID' }), { 
        status: 400, 
        headers 
      })
    }
    
    if (method === 'GET') {
      // 获取文章阅读量
      const views = await BLOG_STATS.get(`views:${postSlug}`) || '0'
      return new Response(JSON.stringify({ views: parseInt(views, 10) }), { headers })
    } else if (method === 'POST') {
      // 增加文章阅读量
      const currentViews = parseInt(await BLOG_STATS.get(`views:${postSlug}`) || '0', 10)
      await BLOG_STATS.put(`views:${postSlug}`, (currentViews + 1).toString())
      return new Response(JSON.stringify({ views: currentViews + 1 }), { headers })
    }
  }
  
  // 处理点赞API
  if (path.startsWith('/api/likes/')) {
    const postSlug = path.replace('/api/likes/', '')
    
    if (method === 'GET') {
      // 获取文章点赞数
      const likes = await BLOG_STATS.get(`likes:${postSlug}`) || '0'
      return new Response(JSON.stringify({ likes: parseInt(likes, 10) }), { headers })
    } else if (method === 'POST') {
      // 增加文章点赞数
      const currentLikes = parseInt(await BLOG_STATS.get(`likes:${postSlug}`) || '0', 10)
      await BLOG_STATS.put(`likes:${postSlug}`, (currentLikes + 1).toString())
      return new Response(JSON.stringify({ likes: currentLikes + 1 }), { headers })
    }
  }
  
  // 处理评论API
  if (path.startsWith('/api/comments/')) {
    const postSlug = path.replace('/api/comments/', '')
    
    if (method === 'GET') {
      // 获取文章评论
      const commentsJson = await BLOG_STATS.get(`comments:${postSlug}`)
      const comments = commentsJson ? JSON.parse(commentsJson) : []
      return new Response(JSON.stringify({ comments }), { headers })
    } else if (method === 'POST') {
      // 添加新评论
      try {
        const requestData = await event.request.json()
        const { name, content } = requestData
        
        if (!name || !content) {
          return new Response(JSON.stringify({ error: '姓名和评论内容不能为空' }), { 
            status: 400, 
            headers 
          })
        }
        
        const commentsJson = await BLOG_STATS.get(`comments:${postSlug}`)
        const comments = commentsJson ? JSON.parse(commentsJson) : []
        
        const newComment = {
          id: Date.now().toString(),
          name,
          content,
          date: new Date().toISOString()
        }
        
        comments.push(newComment)
        await BLOG_STATS.put(`comments:${postSlug}`, JSON.stringify(comments))
        
        return new Response(JSON.stringify({ 
          success: true, 
          comment: newComment 
        }), { headers })
      } catch (error) {
        return new Response(JSON.stringify({ error: '无效的请求数据' }), { 
          status: 400, 
          headers 
        })
      }
    }
  }
  
  // 未找到API端点
  return new Response(JSON.stringify({ error: '未找到API端点' }), { 
    status: 404, 
    headers 
  })
} 