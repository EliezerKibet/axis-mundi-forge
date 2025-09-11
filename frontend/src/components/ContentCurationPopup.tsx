import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Article } from "../types/article";
import { useArticles, useFeaturedArticles } from "../hooks/useArticles";

interface ContentCurationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInterest: string;
}

interface RecommendedArticle {
  title: string;
  category: string;
  description: string;
  readTime: string;
  date: string;
  slug: string;
}

interface QuestionResponse {
  answer: string;
  recommendedArticles: RecommendedArticle[];
}

const generateArticleTags = (articles: Article[]): string[] => {
  if (articles.length === 0) return ["Advanced Tech", "Innovation", "Research"];

  // Extract unique categories from actual articles
  const categories = [...new Set(articles.map((article) => article.category))];

  // Generate tags from real categories
  const tags = new Set<string>();

  categories.forEach((category) => {
    // Split category names and add as tags
    const words = category.split(/[\s&]+/);
    words.forEach((word) => {
      if (word.length > 2) {
        tags.add(word);
      }
    });
  });

  // Add generic tags if we don't have enough
  if (tags.size < 3) {
    tags.add("Innovation");
    tags.add("Research");
    tags.add("Technology");
  }

  return Array.from(tags).slice(0, 3);
};

const getArticlesByInterest = (
  selectedInterest: string,
  availableArticles: Article[]
): Article[] => {
  if (availableArticles.length === 0) return [];

  // Dynamic filtering based on actual categories from your database
  const interestToCategory: { [key: string]: string[] } = {
    Technology: [
      "Technology",
      "Science & Technology",
      "Science and Technology",
    ],
    "Science & Technology": [
      "Science & Technology",
      "Technology",
      "Science and Technology",
    ],
    "Artificial Intelligence": [
      "Artificial Intelligence",
      "Technology",
      "Science & Technology",
    ],
    "Quantum Computing": [
      "Quantum Computing",
      "Technology",
      "Science & Technology",
    ],
  };

  // If the selected interest matches a category directly, use it
  let relevantCategories = interestToCategory[selectedInterest];

  // If no direct match, try to find partial matches
  if (!relevantCategories) {
    relevantCategories = [];
    Object.keys(interestToCategory).forEach((category) => {
      if (
        category.toLowerCase().includes(selectedInterest.toLowerCase()) ||
        selectedInterest.toLowerCase().includes(category.toLowerCase())
      ) {
        relevantCategories.push(...interestToCategory[category]);
      }
    });
  }

  // Fallback to showing all articles if no matches
  if (relevantCategories.length === 0) {
    return availableArticles.slice(0, 6);
  }

  // Filter articles by matching categories
  const filteredArticles = availableArticles.filter((article) =>
    relevantCategories.some(
      (cat) =>
        article.category.toLowerCase().includes(cat.toLowerCase()) ||
        cat.toLowerCase().includes(article.category.toLowerCase())
    )
  );

  // Return all matching articles (up to 6 for display)
  return filteredArticles.length > 0
    ? filteredArticles.slice(0, 6)
    : availableArticles.slice(0, 6);
};

const formatDateOnly = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return dateString; // Return original if parsing fails
  }
};

interface QuestionResponse {
  answer: string;
  recommendedArticles: RecommendedArticle[];
}

const generateContextualResponse = (
  question: string,
  interest: string,
  articles: Article[]
): QuestionResponse => {
  const responses: { [key: string]: { answer: string } } = {
    "Quantum Computing": {
      answer:
        "Based on your question, we've identified several cutting-edge technologies that address this challenge. Our research shows that combining quantum computing with advanced optimization algorithms can create robust solutions for modern enterprise needs. The articles below provide detailed insights into implementation strategies and real-world case studies.",
    },
    "Resilient AI Systems": {
      answer:
        "Your question touches on critical aspects of AI system design and implementation. Our analysis indicates that building resilient, production-ready AI systems requires careful consideration of scalability, safety, and environmental impact. The recommended articles explore proven strategies for addressing these challenges.",
    },
    "Neural Commerce Platforms": {
      answer:
        "This is an excellent question about the intersection of neural computing and commercial applications. Our research shows that neuromorphic systems and decentralized platforms are creating new opportunities for intelligent commerce solutions. The articles below detail specific implementations and emerging trends.",
    },
  };

  const responseTemplate =
    responses[interest] || responses["Quantum Computing"];

  // Select 2-3 most relevant articles
  const numArticles = Math.min(3, Math.max(2, articles.length));
  const selectedArticles = articles.slice(0, numArticles);

  return {
    answer: responseTemplate.answer,
    recommendedArticles: selectedArticles.map((article) => ({
      title: article.title,
      category: article.category,
      description:
        article.preview && article.preview.length > 80
          ? article.preview.substring(0, 80) + "..."
          : article.preview || article.excerpt || "No description available",
      readTime: article.readingTime || article.readTime,
      date: article.date,
      slug: article.slug,
    })),
  };
};

const ContentCurationPopup = ({
  isOpen,
  onClose,
  selectedInterest,
}: ContentCurationPopupProps) => {
  const navigate = useNavigate();
  const { articles: availableArticles, loading } = useArticles({ limit: 50 });
  const relevantArticles = getArticlesByInterest(
    selectedInterest,
    availableArticles
  );
  const dynamicTags = generateArticleTags(relevantArticles);

  const [userQuestion, setUserQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questionResponse, setQuestionResponse] =
    useState<QuestionResponse | null>(null);

  if (!isOpen) return null;

  const handleArticleClick = (slug: string) => {
    navigate(`/blog/${slug}`);
    onClose();
  };

  const handleAskQuestion = async () => {
    if (!userQuestion.trim()) return;

    setIsLoading(true);

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate contextual response based on user's interest and available articles
      const response = generateContextualResponse(
        userQuestion,
        selectedInterest,
        relevantArticles
      );

      setQuestionResponse(response);
      setUserQuestion(""); // Clear input after successful submission
    } catch (error) {
      console.error("Failed to process question:", error);
      setQuestionResponse({
        answer:
          "I apologize, but I'm unable to process your question at the moment. Please try again later.",
        recommendedArticles: relevantArticles.slice(0, 2).map((article) => ({
          title: article.title,
          category: article.category,
          description:
            (article.preview || article.excerpt || "").substring(0, 80) + "...",
          readTime: article.readingTime || article.readTime,
          date: article.date,
          slug: article.slug,
        })),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1f3a] border-t-2 border-primary max-w-4xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-primary text-xl transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-light text-white mb-3">
            Articles Curated for Your Interests ({relevantArticles.length}{" "}
            found)
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            Based on your selected topics:{" "}
            <span className="text-primary">{selectedInterest}</span>
          </p>

          {/* Dynamic Tags */}
          <div className="flex flex-wrap gap-3">
            {dynamicTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary text-xs tracking-wide"
              >
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="articles-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-card/50 border-l-4 border-primary p-6 animate-pulse"
              >
                <div className="h-4 bg-primary/20 rounded mb-3 w-1/3"></div>
                <div className="h-6 bg-text-secondary/20 rounded mb-4"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-text-secondary/20 rounded"></div>
                  <div className="h-3 bg-text-secondary/20 rounded w-4/5"></div>
                </div>
                <div className="h-4 bg-primary/20 rounded w-1/2"></div>
              </div>
            ))
          ) : relevantArticles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-text-secondary mb-4">
                No articles found for this interest
              </div>
              <p className="text-text-secondary text-sm">
                Try selecting different interests or check back later.
              </p>
            </div>
          ) : (
            relevantArticles.map((article) => (
              <div
                key={article.id}
                className="article-card bg-card/50 border-l-4 border-primary p-6 hover:bg-primary/5 transition-all duration-300 cursor-pointer group h-fit"
                onClick={() => handleArticleClick(article.slug)}
              >
                {/* Article Category Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="category-badge text-xs text-primary border border-primary/30 px-2 py-1 bg-primary/10">
                    {article.category}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {article.readingTime || article.readTime}
                  </span>
                </div>

                {/* Article Title */}
                <h3 className="text-lg font-light text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                {/* Article Description */}
                <p className="text-sm text-text-secondary mb-4 line-clamp-3">
                  {article.preview ||
                    article.excerpt ||
                    "No description available"}
                </p>

                {/* Article Metadata */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-primary">
                    {article.date} • by {article.author}
                  </span>
                  <span className="text-primary text-sm font-medium hover:text-primary-accent">
                    READ ARTICLE →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Question Section */}
        <div className="question-section border-t border-primary/20 pt-6 mt-6">
          {/* Question Input Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400 text-sm">💡</span>
              <h3 className="text-sm font-medium text-text-primary">
                Have a specific question? Ask and we'll find relevant articles
              </h3>
            </div>
          </div>

          {/* Input and Button */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="What would you like to learn about?"
              className="flex-1 bg-[#1a1f3a] border border-primary/30 px-3 py-2 text-text-primary placeholder-text-secondary/60 focus:border-primary focus:outline-none text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleAskQuestion()}
            />
            <button
              onClick={handleAskQuestion}
              disabled={!userQuestion.trim() || isLoading}
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              ASK
            </button>
          </div>

          {/* Response Section */}
          {(isLoading || questionResponse) && (
            <div className="response-container max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="loading-state flex items-center gap-3 py-4">
                  <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span className="text-text-secondary text-sm">
                    Analyzing your question...
                  </span>
                </div>
              ) : (
                questionResponse && (
                  <div className="response-content">
                    {/* Answer Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-background text-xs">✓</span>
                      </div>
                      <span className="text-primary text-sm font-medium">
                        ANSWER
                      </span>
                    </div>

                    {/* Generated Response */}
                    <div className="response-text text-text-secondary text-sm leading-relaxed mb-6">
                      {questionResponse.answer}
                    </div>

                    {/* Recommended Articles Header */}
                    <div className="recommended-header mb-4">
                      <span className="text-primary text-sm font-medium">
                        RECOMMENDED ARTICLES BASED ON YOUR QUESTION
                      </span>
                    </div>

                    {/* Recommended Articles List */}
                    <div className="recommended-articles space-y-4">
                      {questionResponse.recommendedArticles.map(
                        (article, index) => (
                          <div
                            key={index}
                            className="recommended-article bg-transparent border-l-4 border-primary pl-4 py-3 cursor-pointer hover:bg-primary/5 transition-colors"
                            onClick={() => handleArticleClick(article.slug)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs text-primary bg-primary/20 px-2 py-1">
                                    {article.category.toUpperCase()}
                                  </span>
                                </div>
                                <h4 className="text-text-primary font-medium mb-2 text-sm">
                                  {article.title}
                                </h4>
                                <p className="text-xs text-text-secondary mb-2">
                                  {article.description}
                                </p>
                                <div className="text-xs text-primary">
                                  {article.readTime} • {article.date}
                                </div>
                              </div>
                              <div className="ml-4">
                                <span className="text-primary text-xs font-medium hover:text-primary-accent">
                                  READ ARTICLE →
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-text-secondary/60 text-xs hover:text-text-secondary transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCurationPopup;
