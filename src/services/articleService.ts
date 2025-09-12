import { Article, ArticleListResponse, ArticleFilters } from "../types/article";

class ArticleService {
  private apiUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://axis-mundi-backend.onrender.com/api";

  // Helper functions to transform backend data
  private calculateReadingTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  }

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private createPreview(content: string, maxLength: number = 150): string {
    const cleanContent = content
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\n+/g, ' ')
      .trim();
    
    if (cleanContent.length <= maxLength) return cleanContent;
    return cleanContent.substring(0, maxLength).trim() + '...';
  }

  private transformBackendArticle(backendArticle: any): Article {
    const content = backendArticle.content || '';
    const excerpt = backendArticle.summary || this.createPreview(content);
    const publishDate = backendArticle.published_date || backendArticle.created_at || new Date().toISOString();
    
    return {
      id: backendArticle.id,
      title: backendArticle.title,
      excerpt: excerpt,
      content: content,
      author: backendArticle.author || 'Anonymous',
      publishDate: backendArticle.published_date || backendArticle.created_at || new Date().toISOString(),
      readTime: backendArticle.readTime || this.calculateReadingTime(content),
      category: backendArticle.category || 'Technology',
      tags: Array.isArray(backendArticle.tags) ? (backendArticle.tags as string[]) : [],
      slug: this.createSlug(backendArticle.title),
      featuredImage: backendArticle.featuredImage || undefined,
      status: 'published' as const,
      // Backwards compatibility fields
      date: publishDate,
      preview: excerpt,
      readingTime: backendArticle.readingTime || this.calculateReadingTime(content),
    };
  }

  async getArticles(
    filters: ArticleFilters = {}
  ): Promise<ArticleListResponse> {
    try {
      // YOUR BACKEND DOESN'T USE QUERY PARAMS - just fetch all articles
      const response = await fetch(`${this.apiUrl}/articles`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform backend response format
      if (!data.success || !data.articles) {
        throw new Error('Invalid response format from API');
      }

      let articles = data.articles.map((article: any) => this.transformBackendArticle(article));

      // Apply client-side filtering since backend doesn't support it yet
      if (filters.category) {
        articles = articles.filter((article: Article) => 
          article.category.toLowerCase() === filters.category?.toLowerCase()
        );
      }

      if (filters.author) {
        articles = articles.filter((article: Article) => 
          article.author.toLowerCase().includes(filters.author?.toLowerCase() || '')
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        articles = articles.filter((article: Article) => 
          article.title.toLowerCase().includes(searchTerm) ||
          article.content.toLowerCase().includes(searchTerm) ||
          article.excerpt.toLowerCase().includes(searchTerm)
        );
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedArticles = articles.slice(startIndex, endIndex);

      console.log("ArticleService: getArticles success:", paginatedArticles.length, "articles");
      
      return {
        articles: paginatedArticles,
        total: articles.length,
        page: page,
        limit: limit,
      };
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw new Error("Failed to fetch articles");
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      // YOUR BACKEND DOESN'T HAVE SLUG ENDPOINT - fetch all and find by slug
      const response = await fetch(`${this.apiUrl}/articles`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.articles) {
        throw new Error('Invalid response format from API');
      }

      const articles = data.articles.map((article: any) => this.transformBackendArticle(article));
      const foundArticle = articles.find((article: Article) => article.slug === slug);

      if (!foundArticle) {
        console.log("ArticleService: Article not found for slug:", slug);
        return null;
      }

      console.log("ArticleService: getArticleBySlug success:", foundArticle.title);
      return foundArticle;
    } catch (error) {
      console.error("Error fetching article:", error);
      throw new Error("Failed to fetch article");
    }
  }

  async getFeaturedArticles(limit: number = 3): Promise<Article[]> {
    try {
      // YOUR BACKEND DOESN'T HAVE FEATURED ENDPOINT - use regular articles
      const response = await this.getArticles({ limit: limit });
      console.log("ArticleService: getFeaturedArticles success:", response.articles.length, "articles");
      return response.articles;
    } catch (error) {
      console.error("Error fetching featured articles:", error);
      return [];
    }
  }
async getCategories(): Promise<string[]> {
    try {
      // Extract categories from articles (no hardcoding)
      const response = await fetch(`${this.apiUrl}/articles`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.articles) {
        throw new Error('Invalid response format from API');
      }

      const articles = data.articles.map((article: any) => this.transformBackendArticle(article));
      const categories = [...new Set(articles.map((article: Article) => article.category))] as string[];
      
      console.log("ArticleService: getCategories success:", categories);
      return categories.filter(Boolean); // Remove any empty/null categories
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Return empty array instead of hardcoded categories
      return [];
    }
  }

  async getTags(): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiUrl}/articles`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.articles) {
        return [];
      }

      const articles = data.articles.map((article: any) => this.transformBackendArticle(article));
      const allTags = articles.flatMap((article: Article) => article.tags) as string[];
      const uniqueTags = [...new Set(allTags.filter(Boolean))]; // Remove empty tags
      
      console.log("ArticleService: getTags success:", uniqueTags);
      return uniqueTags;
    } catch (error) {
      console.error("Error fetching tags:", error);
      return [];
    }
  }

  async searchArticles(
    query: string,
    limit: number = 5,
    categories?: string[]
  ): Promise<Article[]> {
    try {
      const filters: ArticleFilters = {
        search: query,
        limit: limit,
      };

      if (categories && categories.length > 0) {
        filters.category = categories[0];
      }

      const response = await this.getArticles(filters);
      console.log("ArticleService: searchArticles success:", response.articles.length, "results for query:", query);
      return response.articles;
    } catch (error) {
      console.error("Error searching articles:", error);
      throw new Error("Failed to search articles");
    }
  }
}

export const articleService = new ArticleService();