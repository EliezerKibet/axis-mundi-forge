import { Article, ArticleListResponse, ArticleFilters } from '../types/article';

class ArticleService {
  private baseUrl = process.env.VITE_API_BASE_URL || '/api';

  async getArticles(filters: ArticleFilters = {}): Promise<ArticleListResponse> {
    // For now, return empty data until Supabase is connected
    console.log('ArticleService: getArticles called with filters:', filters);
    return {
      articles: [],
      total: 0,
      page: filters.page || 1,
      limit: filters.limit || 10
    };
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    // For now, return null until Supabase is connected
    console.log('ArticleService: getArticleBySlug called with slug:', slug);
    return null;
  }

  async getFeaturedArticles(limit: number = 3): Promise<Article[]> {
    // For now, return empty array until Supabase is connected
    console.log('ArticleService: getFeaturedArticles called with limit:', limit);
    return [];
  }

  async getCategories(): Promise<string[]> {
    // For now, return static categories until Supabase is connected
    return [
      "Quantum Computing",
      "Artificial Intelligence", 
      "Web3 & Decentralization",
      "Emerging Technology"
    ];
  }

  async getTags(): Promise<string[]> {
    // For now, return empty array until Supabase is connected
    console.log('ArticleService: getTags called');
    return [];
  }
}

export const articleService = new ArticleService();