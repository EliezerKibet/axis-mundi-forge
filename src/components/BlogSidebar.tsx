import { blogArticles, blogCategories, BlogArticle } from '../data/blogArticles';
import { Link } from 'react-router-dom';

interface BlogSidebarProps {
  currentArticle?: BlogArticle;
}

const BlogSidebar = ({ currentArticle }: BlogSidebarProps) => {
  // Filter out current article from recent posts
  const recentPosts = blogArticles.filter(article => 
    currentArticle ? article.id !== currentArticle.id : true
  ).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Recent Posts */}
      <div className="bg-card border border-primary/20 p-6">
        <h3 className="text-xl font-light tracking-wider text-text-primary mb-6">
          Recent Posts
        </h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Link 
              key={post.id}
              to={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="pb-4 border-b border-primary/10 last:border-b-0 last:pb-0">
                <h4 className="text-text-primary group-hover:text-primary-accent transition-colors mb-2 leading-snug">
                  {post.title}
                </h4>
                <time className="text-sm text-text-secondary">
                  {post.date}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-card border border-primary/20 p-6">
        <h3 className="text-xl font-light tracking-wider text-text-primary mb-6">
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {blogCategories.map((category) => (
            <span 
              key={category}
              className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-sm cursor-pointer hover:bg-primary/20 transition-colors"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-card border border-primary/20 p-6">
        <h3 className="text-xl font-light tracking-wider text-text-primary mb-4">
          Stay Updated
        </h3>
        <p className="text-text-secondary mb-6 text-sm leading-relaxed">
          Get the latest insights delivered to your inbox
        </p>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-background border border-primary/30 text-text-primary placeholder-text-secondary focus:border-primary focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="w-full px-4 py-3 bg-primary text-primary-foreground hover:bg-primary-accent transition-colors font-light tracking-wider"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogSidebar;