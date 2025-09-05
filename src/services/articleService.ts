import { Article, ArticleListResponse, ArticleFilters } from "../types/article";

// Temporary mock data for testing
const mockArticles: Article[] = [
  {
    id: "1",
    title: "Test Article 1",
    excerpt: "This is a test article to verify the service is working",
    content: "# Test Content\n\nThis is temporary test content.",
    author: "Test Author",
    publishDate: "2024-01-15",
    date: "2024-01-15", // Your interface uses 'date'
    preview: "This is a test article to verify the service is working", // Your interface uses 'preview'
    readTime: "5",
    readingTime: "5", // Your interface uses 'readingTime'
    category: "Quantum Computing",
    tags: ["test", "quantum"],
    slug: "test-article-1",
    featuredImage: "https://via.placeholder.com/600x400",
    status: "published",
  },
  {
    id: "2",
    title: "Test Article 2",
    excerpt: "Another test article for verification",
    content: "# Another Test\n\nMore test content here.",
    author: "Test Author 2",
    publishDate: "2024-01-16",
    date: "2024-01-16", // Your interface uses 'date'
    preview: "Another test article for verification", // Your interface uses 'preview'
    readTime: "3",
    readingTime: "3", // Your interface uses 'readingTime'
    category: "Artificial Intelligence",
    tags: ["test", "ai"],
    slug: "test-article-2",
    featuredImage: "https://via.placeholder.com/600x400",
    status: "published",
  },
];

class ArticleService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

  async getArticles(
    filters: ArticleFilters = {}
  ): Promise<ArticleListResponse> {
    console.log("ArticleService: getArticles called with filters:", filters);

    // TODO: Remove this mock data when Supabase is connected
    // Return mock data for now to test the interface
    return {
      articles: mockArticles,
      total: mockArticles.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    console.log("ArticleService: getArticleBySlug called with slug:", slug);

    // TODO: Remove this mock data when Supabase is connected
    const article = mockArticles.find((article) => article.slug === slug);
    return article || null;
  }

  async getFeaturedArticles(limit: number = 3): Promise<Article[]> {
    console.log(
      "ArticleService: getFeaturedArticles called with limit:",
      limit
    );

    // TODO: Remove this mock data when Supabase is connected
    return mockArticles.slice(0, limit);
  }

  async getCategories(): Promise<string[]> {
    return [
      "Quantum Computing",
      "Artificial Intelligence",
      "Web3 & Decentralization",
      "Emerging Technology",
    ];
  }

  async getTags(): Promise<string[]> {
    console.log("ArticleService: getTags called");

    // TODO: Remove this mock data when Supabase is connected
    return ["test", "quantum", "ai", "technology"];
  }
}

export const articleService = new ArticleService();
