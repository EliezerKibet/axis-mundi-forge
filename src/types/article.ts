export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  slug: string;
  featuredImage?: string;
  status: 'published' | 'draft';
  date: string; // For backwards compatibility
  preview: string; // For backwards compatibility
  readingTime: string; // For backwards compatibility
}

export interface ArticleListResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}

export interface ArticleFilters {
  search?: string;
  category?: string;
  author?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}


export type ArticleCategory = string;