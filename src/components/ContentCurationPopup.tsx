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

  // Enhanced article selection with specific article targeting
  const getArticlesByInterest = (interest: string) => {
    const interestMapping: { [key: string]: { primary: string[], secondary: string[], articles: string[] } } = {
      "Quantum Computing": {
        primary: ["Quantum Computing"],
        secondary: ["Emerging Technology"],
        articles: [
          "quantum-drug-discovery-2030",
          "quantum-internet-unhackable-communications", 
          "neuromorphic-computing-brain-chips"
        ]
      },
      
      "Resilient AI Systems": {
        primary: ["Artificial Intelligence"], 
        secondary: ["Emerging Technology"],
        articles: [
          "ai-carbon-footprint-hidden-cost",
          "ai-paradox-dumber-smarter",
          "cognitive-overfitting-bigger-models"
        ]
      },
      
      "Neural Commerce Platforms": {
        primary: ["Emerging Technology", "Web3 & Decentralization"],
        secondary: ["Artificial Intelligence"],
        articles: [
          "neuromorphic-computing-brain-chips",
          "dao-comeback-2024", 
          "ai-paradox-dumber-smarter"
        ]
      }
    };
    
    const mapping = interestMapping[interest];
    if (!mapping) return blogArticles.slice(0, 3);
    
    // Try to get specific articles first, then fallback to category filtering
    const specificArticles = blogArticles.filter(article => 
      mapping.articles.includes(article.slug)
    );
    
    if (specificArticles.length >= 3) {
      return specificArticles.slice(0, 3);
    }
    
    // Fallback: category-based selection with preference for variety
    const categoryArticles = blogArticles.filter(article =>
      mapping.primary.includes(article.category) || 
      mapping.secondary.includes(article.category)
    );
    
    return categoryArticles.slice(0, 3);
  };

  // Generate dynamic tags based on selected articles
  const generateArticleTags = (articles: any[], interest: string) => {
    const tagMap: { [key: string]: string[] } = {
      "quantum-computing": ["Quantum Systems", "Drug Discovery", "Enterprise Solutions"],
      "quantum-internet": ["Quantum Networks", "Cryptography", "Security"],
      "ai-carbon-footprint": ["Environmental AI", "Green Computing", "Sustainability"],
      "ai-paradox": ["AGI Research", "Machine Learning", "AI Safety"],
      "ai-alignment": ["AI Ethics", "Safety Research", "Alignment"],
      "cognitive-overfitting": ["AI Limitations", "Model Training", "Benchmarks"],
      "dao-comeback": ["Decentralization", "Governance", "Web3"],
      "web3-future": ["Blockchain", "Smart Contracts", "DeFi"],
      "neuromorphic": ["Brain Computing", "Energy Efficiency", "Hardware"]
    };
    
    const relevantTags = new Set<string>();
    articles.forEach(article => {
      const articleKey = article.slug.split('-').slice(0, 2).join('-');
      const tags = tagMap[articleKey] || ["Advanced Tech", "Innovation", "Research"];
      tags.forEach(tag => relevantTags.add(tag));
    });
    
    return Array.from(relevantTags).slice(0, 3);
  };

  const articles = getArticlesByInterest(selectedInterest);
  const dynamicTags = generateArticleTags(articles, selectedInterest);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {articles.map((article, index) => (
            <div 
              key={article.id}
              className={`${index === 2 && articles.length === 3 ? 'md:col-span-2' : ''} bg-card/50 border-l-4 border-primary p-6 hover:bg-primary/5 transition-all duration-300 cursor-pointer group`}
              onClick={() => handleArticleClick(article.slug)}
            >
              {/* Article Category Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="category-badge text-xs text-primary border border-primary/30 px-2 py-1 bg-primary/10">
                  {article.category}
                </span>
                <span className="text-xs text-text-secondary">{article.readingTime}</span>
              </div>
              
              {/* Article Title */}
              <h3 className="text-lg font-light text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              
              {/* Article Description */}
              <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                {article.preview}
              </p>
              
              {/* Article Metadata */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-primary">
                  {article.date} • by {article.author}
                </span>
                <span className="text-primary text-sm font-medium hover:text-primary-accent">
                  READ ARTICLE →
                </span>
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