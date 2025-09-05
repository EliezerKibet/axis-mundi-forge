import { useState, useEffect } from 'react';
import { Article, ArticleListResponse, ArticleFilters } from '../types/article';
import { articleService } from '../services/articleService';

export const useArticles = (filters: ArticleFilters = {}) => {
  const [data, setData] = useState<ArticleListResponse>({
    articles: [],
    total: 0,
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleService.getArticles(filters);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [JSON.stringify(filters)]);

  return {
    articles: data.articles,
    total: data.total,
    page: data.page,
    limit: data.limit,
    loading,
    error,
    refetch: fetchArticles
  };
};

export const useArticle = (slug: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await articleService.getArticleBySlug(slug);
        setArticle(data);
        if (!data) {
          setError('Article not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch article');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  return { article, loading, error };
};

export const useFeaturedArticles = (limit: number = 3) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await articleService.getFeaturedArticles(limit);
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured articles');
        console.error('Error fetching featured articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, [limit]);

  return { articles, loading, error };
};