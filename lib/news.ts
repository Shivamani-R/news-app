import type { Article, NewsResponse } from "./types"

const API_KEY = "0ea2bdb2e0714ed0a010339f866ae4b0"
const BASE_URL = "https://newsapi.org/v2/everything"

// In-memory cache for articles
const articleCache = new Map<string, Article>()

interface FetchNewsParams {
  search?: string
  category?: string
  page?: number
}

export async function fetchNews({
  search = "",
  category = "general",
  page = 1,
}: FetchNewsParams): Promise<NewsResponse> {
  try {
    // Build query parameters
    const query = search || (category !== "general" ? category : "news")
    const pageSize = 12

    // Construct URL
    const url = new URL(BASE_URL)
    url.searchParams.append("q", query)
    url.searchParams.append("pageSize", pageSize.toString())
    url.searchParams.append("page", page.toString())
    url.searchParams.append("language", "en")
    url.searchParams.append("sortBy", "publishedAt")
    url.searchParams.append("apiKey", API_KEY)

    // Fetch data
    const response = await fetch(url.toString(), { next: { revalidate: 3600 } })

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`)
    }

    const data = await response.json()

    // Cache articles for detail view
    if (data.articles && Array.isArray(data.articles)) {
      data.articles.forEach((article: Article) => {
        const id = Buffer.from(article.title).toString("base64").replace(/[+/=]/g, "")
        articleCache.set(id, article)
      })
    }

    return {
      articles: data.articles || [],
      totalResults: data.totalResults || 0,
    }
  } catch (error) {
    console.error("Error fetching news:", error)
    return { articles: [], totalResults: 0 }
  }
}

export async function fetchArticleById(id: string): Promise<Article | null> {
  // Try to get from cache first
  if (articleCache.has(id)) {
    return articleCache.get(id) || null
  }

  // If not in cache, fetch a batch of recent articles to try to find it
  // This is a workaround since the free News API doesn't have a "get by ID" endpoint
  try {
    const { articles } = await fetchNews({ page: 1 })

    // Check if the article is in the fetched batch
    const article = articles.find((article) => {
      const articleId = Buffer.from(article.title).toString("base64").replace(/[+/=]/g, "")
      return articleId === id
    })

    if (article) {
      articleCache.set(id, article)
      return article
    }

    return null
  } catch (error) {
    console.error("Error fetching article by ID:", error)
    return null
  }
}
