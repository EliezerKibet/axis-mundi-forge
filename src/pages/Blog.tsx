import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const Blog = () => {
  const [animatePosts, setAnimatePosts] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatePosts(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const posts = [
    {
      date: "JANUARY 25, 2025",
      title: "Quantum Computing: Breaking the Complexity Barrier",
      preview: "Exploring how quantum algorithms are revolutionizing computational problems previously thought unsolvable, from cryptography to drug discovery."
    },
    {
      date: "JANUARY 18, 2025", 
      title: "Zero-Knowledge Proofs in Production Systems",
      preview: "Implementing privacy-preserving authentication mechanisms at scale using ZK-SNARKs and their practical applications in enterprise environments."
    },
    {
      date: "JANUARY 10, 2025",
      title: "Edge AI: Processing at the Speed of Light", 
      preview: "How edge computing combined with neural processing units is enabling real-time AI inference with microsecond latency."
    },
    {
      date: "JANUARY 3, 2025",
      title: "Building Antifragile Systems",
      preview: "Beyond resilience: designing systems that gain from disorder using chaos engineering and adaptive architectures."
    },
    {
      date: "DECEMBER 28, 2024",
      title: "The Convergence of 6G and Neural Interfaces",
      preview: "Examining the infrastructure requirements for brain-computer interfaces and the role of next-generation wireless technologies."
    }
  ];

  return (
    <div className="min-h-screen bg-background tech-grid pt-20">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="blue-accent-line pl-8">
            <h1 className="mb-6">Technical Insights</h1>
            <p className="text-lg text-text-secondary max-w-3xl">
              Deep dives into emerging technologies and engineering practices
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Animated blue line */}
          <div 
            className={`h-px bg-primary mb-20 transition-all duration-500 ${
              animatePosts ? 'w-full opacity-100' : 'w-0 opacity-0'
            }`}
          />
          
          <div className="space-y-20">
            {posts.map((post, index) => (
              <article 
                key={index}
                className={`transition-all duration-600 hover:pl-6 hover:border-l-2 hover:border-primary cursor-pointer group ${
                  animatePosts 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: animatePosts ? `${index * 150}ms` : '0ms' 
                }}
              >
                <div className="mb-4">
                  <time className="text-sm text-primary tracking-widest">
                    {post.date}
                  </time>
                </div>
                
                <h2 className="mb-6 group-hover:text-primary-accent transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-text-secondary mb-6 leading-relaxed">
                  {post.preview}
                </p>
                
                <div className="flex items-center text-primary hover:text-primary-accent transition-colors group">
                  <span className="text-sm tracking-wider">READ ANALYSIS</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;