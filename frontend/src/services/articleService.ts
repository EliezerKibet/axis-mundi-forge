import { Article, ArticleListResponse, ArticleFilters } from "../types/article";

class ArticleService {
  private apiUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://axis-mundi-backend.onrender.com/";

  async getArticles(
    filters: ArticleFilters = {}
  ): Promise<ArticleListResponse> {
    try {
      const queryParams = new URLSearchParams();

      // Add filter parameters
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.author) queryParams.append("author", filters.author);
      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.limit) queryParams.append("limit", filters.limit.toString());

      const response = await fetch(`${this.apiUrl}/articles?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        "ArticleService: getArticles success:",
        data.articles.length,
        "articles"
      );
      return data;
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw new Error("Failed to fetch articles");
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const response = await fetch(`${this.apiUrl}/articles/${slug}`);

      if (response.status === 404) {
        console.log("ArticleService: Article not found for slug:", slug);
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const article = await response.json();
      console.log("ArticleService: getArticleBySlug success:", article.title);
      return article;
    } catch (error) {
      console.error("Error fetching article:", error);
      throw new Error("Failed to fetch article");
    }
  }

  async getFeaturedArticles(limit: number = 3): Promise<Article[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/articles/featured?limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const articles = await response.json();
      console.log(
        "ArticleService: getFeaturedArticles success:",
        articles.length,
        "articles"
      );
      return articles;
    } catch (error) {
      console.error("Error fetching featured articles:", error);
      // Fallback: return first few articles if featured endpoint fails
      try {
        const fallbackResponse = await this.getArticles({ limit: limit });
        return fallbackResponse.articles.slice(0, limit);
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        return [];
      }
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiUrl}/articles/categories`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const categories = await response.json();
      console.log("ArticleService: getCategories success:", categories);
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Return fallback categories
      return [
        "Technology",
        "Science & Technology",
        "Science and Technology",
        "Quantum Computing",
        "Artificial Intelligence",
      ];
    }
  }

  async getTags(): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiUrl}/articles/tags`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const tags = await response.json();
      console.log("ArticleService: getTags success:", tags);
      return tags;
    } catch (error) {
      console.error("Error fetching tags:", error);
      // Return empty array since your current articles don't have tags
      return [];
    }
  }

  // NEW: Semantic search (placeholder for future AI integration)
  async searchArticles(
    query: string,
    limit: number = 5,
    categories?: string[]
  ): Promise<Article[]> {
    try {
      // For now, use regular search until AI embeddings are integrated
      const filters: ArticleFilters = {
        search: query,
        limit: limit,
      };

      if (categories && categories.length > 0) {
        filters.category = categories[0]; // Use first category for now
      }

      const response = await this.getArticles(filters);
      console.log(
        "ArticleService: searchArticles success:",
        response.articles.length,
        "results for query:",
        query
      );
      return response.articles;
    } catch (error) {
      console.error("Error searching articles:", error);
      throw new Error("Failed to search articles");
    }
  }
}

export const articleService = new ArticleService();
