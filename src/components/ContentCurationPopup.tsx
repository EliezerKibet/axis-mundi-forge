import { X, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { blogArticles } from "../data/blogArticles";

interface ContentCurationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInterest: string;
}

const ContentCurationPopup = ({ isOpen, onClose, selectedInterest }: ContentCurationPopupProps) => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");

  if (!isOpen) return null;

  // Map contact form interests to article categories
  const getArticlesByInterest = (interest: string) => {
    const categoryMap: { [key: string]: string[] } = {
      "Quantum Computing": ["Quantum Computing"],
      "Resilient AI Systems": ["Artificial Intelligence"],
      "Neural Commerce Platforms": ["Artificial Intelligence", "Emerging Technology"]
    };

    const categories = categoryMap[interest] || ["Emerging Technology"];
    
    // Get articles from these categories, limit to 3
    const filteredArticles = blogArticles.filter(article => 
      categories.includes(article.category)
    ).slice(0, 3);
    
    // If we need more articles, fill with other articles
    if (filteredArticles.length < 3) {
      const remainingArticles = blogArticles.filter(article => 
        !filteredArticles.some(filtered => filtered.id === article.id)
      );
      filteredArticles.push(...remainingArticles.slice(0, 3 - filteredArticles.length));
    }

    return filteredArticles;
  };

  const articles = getArticlesByInterest(selectedInterest);

  const getInterestTags = (interest: string) => {
    const tagMap: { [key: string]: string[] } = {
      "Quantum Computing": ["QUANTUM COMPUTING"],
      "Resilient AI Systems": ["AI SYSTEMS"],
      "Neural Commerce Platforms": ["AI SYSTEMS", "WEB3 & DECENTRALIZATION"]
    };
    return tagMap[interest] || ["EMERGING TECHNOLOGY"];
  };

  const interestTags = getInterestTags(selectedInterest);

  const handleArticleClick = (slug: string) => {
    navigate(`/blog/${slug}`);
    onClose();
  };

  const handleQuestionSubmit = () => {
    if (question.trim()) {
      // For now, just navigate to blog page
      navigate('/blog');
      onClose();
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "QUANTUM COMPUTING": "bg-primary/20 border-primary text-primary",
      "AI SYSTEMS": "bg-blue-500/20 border-blue-500 text-blue-500",
      "WEB3 & DECENTRALIZATION": "bg-green-500/20 border-green-500 text-green-500",
      "EMERGING TECHNOLOGY": "bg-purple-500/20 border-purple-500 text-purple-500"
    };
    return colors[category] || "bg-primary/20 border-primary text-primary";
  };

  const formatCategoryForBadge = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      "Quantum Computing": "QUANTUM COMPUTING",
      "Artificial Intelligence": "AI SYSTEMS",
      "Web3 & Decentralization": "WEB3 & DECENTRALIZATION",
      "Emerging Technology": "EMERGING TECHNOLOGY"
    };
    return categoryMap[category] || category.toUpperCase();
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
          <h2 className="text-2xl font-light text-white mb-3">Articles Curated for Your Interests</h2>
          <p className="text-text-secondary text-sm mb-6">
            Based on your selected topics, we've found these relevant articles
          </p>
          
          {/* Interest Tags */}
          <div className="flex flex-wrap gap-3">
            {interestTags.map((tag, index) => (
              <div 
                key={index}
                className={`flex items-center gap-2 px-3 py-1 text-xs border ${getCategoryColor(tag)}`}
              >
                <span className="w-2 h-2 bg-current rounded-full"></span>
                <span className="font-medium">{tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {articles.map((article, index) => (
            <div 
              key={article.id}
              className={`${index === 2 && articles.length === 3 ? 'md:col-span-2' : ''} bg-[#0f1327] border border-primary/20 p-6 hover:border-primary/40 transition-all duration-300 cursor-pointer group`}
              onClick={() => handleArticleClick(article.slug)}
            >
              {/* Article Category Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs border mb-4 ${getCategoryColor(formatCategoryForBadge(article.category))}`}>
                <span className="w-2 h-2 bg-current rounded-full"></span>
                <span className="font-medium">{formatCategoryForBadge(article.category)}</span>
              </div>
              
              {/* Article Title */}
              <h3 className="text-lg font-light text-white mb-3 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              
              {/* Article Description */}
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                {article.preview}
              </p>
              
              {/* Article Metadata */}
              <div className="flex items-center gap-4 text-xs text-primary">
                <span>{article.readingTime}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Question Section */}
        <div className="border-t border-primary/20 pt-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm mb-4">
                Have a specific question? Ask and we'll find relevant articles
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What would you like to learn about?"
                  className="flex-1 bg-[#0f1327] border border-primary/30 px-4 py-3 text-white placeholder-text-secondary focus:border-primary focus:outline-none text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleQuestionSubmit()}
                />
                <button 
                  onClick={handleQuestionSubmit}
                  className="px-6 py-3 bg-primary hover:bg-primary-accent text-white font-medium tracking-wide transition-colors text-sm"
                >
                  ASK
                </button>
              </div>
            </div>
          </div>
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