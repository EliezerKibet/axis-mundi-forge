import { X, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ContentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  interest: string;
}

const ContentPopup = ({ isOpen, onClose, interest }: ContentPopupProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getContentData = () => {
    switch (interest) {
      case "Quantum Computing":
        return {
          badge: "QUANTUM COMPUTING",
          title: "The Future of Quantum Computing in Enterprise",
          date: "JANUARY 15, 2025",
          readTime: "5 MIN READ",
          category: "ENTERPRISE TECHNOLOGY",
          description: "Quantum computing has reached an inflection point. What was once confined to research laboratories is now solving real enterprise problems. Discover how companies like JP Morgan and Volkswagen are leveraging quantum systems to achieve 10,000x speedups in complex optimization tasks.",
          metrics: [
            { value: "127", label: "QUBITS ACTIVE" },
            { value: "10,000x", label: "SPEED INCREASE" },
            { value: "$15M", label: "ROI FIRST YEAR" }
          ],
          link: "/blog/quantum-computing-enterprise"
        };
      case "Resilient AI Systems":
        return {
          badge: "AI & MACHINE LEARNING",
          title: "Building Resilient AI Systems",
          date: "JANUARY 10, 2025",
          readTime: "7 MIN READ",
          category: "AI ARCHITECTURE",
          description: "AI systems that work perfectly in labs often fail catastrophically in production. At Axis Mundi, we've learned that resilience—not just accuracy—determines AI success in real-world deployments. Discover our four-pillar approach that maintains 99.9% uptime even during model updates.",
          metrics: [
            { value: "99.9%", label: "UPTIME MAINTAINED" },
            { value: "94%", label: "AUTOMATION RATE" },
            { value: "60%", label: "INCIDENT REDUCTION" }
          ],
          link: "/blog/building-resilient-ai-systems"
        };
      case "Neural Commerce Platforms":
        return {
          badge: "E-COMMERCE TRANSFORMATION",
          title: "Neural Commerce Platform Case Study",
          date: "JANUARY 15, 2025",
          readTime: "8 MIN READ",
          category: "SUCCESS STORY",
          description: "See how we achieved 340% ROI with AI-powered commerce. Developed an AI-powered e-commerce platform processing $2M daily transactions with 99.99% uptime. The system uses deep learning for personalization, achieving remarkable conversion rate improvements.",
          metrics: [
            { value: "340%", label: "ROI ACHIEVED" },
            { value: "242%", label: "CONVERSION INCREASE" },
            { value: "$2M", label: "DAILY TRANSACTIONS" }
          ],
          link: "/projects/neural-commerce-platform"
        };
      default:
        return null;
    }
  };

  const content = getContentData();
  if (!content) return null;

  const handleReadMore = () => {
    navigate(content.link);
    onClose();
  };

  const badgeColor = interest === "Neural Commerce Platforms" ? "text-green-500 border-green-500 bg-green-500/20" : "text-primary border-primary bg-primary/20";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1f3a] border-t-2 border-primary max-w-lg w-full p-8 relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-primary text-xl transition-colors"
        >
          <X size={20} />
        </button>
        
        {/* Header badges */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`flex items-center gap-2 px-3 py-1 text-xs border ${badgeColor}`}>
            <span className="w-2 h-2 bg-current"></span>
            <span className="font-medium">{content.badge}</span>
          </div>
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-500 px-3 py-1 text-xs">
            <Star className="w-3 h-3 text-green-500" />
            <span className="text-green-500 font-medium">PERFECT MATCH</span>
          </div>
        </div>

        {/* Main content */}
        <div className="mb-8">
          <p className="text-text-secondary mb-4 text-sm">
            Since you're interested in <span className="text-primary">{interest}</span>, we thought you'd enjoy this{" "}
            {interest === "Neural Commerce Platforms" ? "case study" : "article"}
          </p>
          
          {/* Article meta */}
          <div className="flex items-center gap-6 text-xs text-primary mb-4">
            <span>{content.date}</span>
            <span>{content.readTime}</span>
            <span>{content.category}</span>
          </div>
          
          <h3 className="text-xl font-light text-white mb-4">
            {content.title}
          </h3>
          
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            {content.description}
          </p>
          
          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            {content.metrics.map((metric, index) => (
              <div key={index}>
                <div className="text-2xl font-light text-primary mb-1">{metric.value}</div>
                <div className="text-xs text-text-secondary">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Button */}
        <button 
          onClick={handleReadMore}
          className="w-full bg-transparent border border-primary text-primary py-3 px-6 hover:bg-primary hover:text-background transition-colors duration-300 font-medium tracking-wide mb-4"
        >
          {interest === "Neural Commerce Platforms" ? "VIEW FULL CASE STUDY" : "READ FULL ARTICLE"} →
        </button>
        
        {/* Footer */}
        <p 
          onClick={onClose}
          className="text-text-secondary/60 text-center text-xs cursor-pointer hover:text-text-secondary transition-colors"
        >
          Maybe later
        </p>
      </div>
    </div>
  );
};

export default ContentPopup;