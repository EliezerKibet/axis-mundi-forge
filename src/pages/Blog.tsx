import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogArticles } from '../data/blogArticles';

const Blog = () => {
  const [animatePosts, setAnimatePosts] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatePosts(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
            {blogArticles.map((post, index) => (
              <article 
                key={post.id}
                className={`transition-all duration-600 hover:pl-6 hover:border-l-2 hover:border-primary cursor-pointer group ${
                  animatePosts 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: animatePosts ? `${index * 150}ms` : '0ms' 
                }}
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <time className="text-primary tracking-widest">
                        {post.date.toUpperCase()}
                      </time>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{post.readingTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <span>{post.author}</span>
                    </div>
                    <span className="px-2 py-1 bg-primary/10 border border-primary/30 text-primary text-xs">
                      {post.category}
                    </span>
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
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;