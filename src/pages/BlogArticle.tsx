import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { useArticle } from "../hooks/useArticles";
import BlogSidebar from "../components/BlogSidebar";
import QuantumCircuit from "../components/QuantumCircuit";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const { article, loading, error } = useArticle(slug || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-background tech-grid pt-20">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-text-secondary/20 rounded mb-8 w-1/3"></div>
            <div className="h-16 bg-text-secondary/20 rounded mb-4"></div>
            <div className="h-4 bg-text-secondary/20 rounded mb-8 w-1/2"></div>
            <div className="space-y-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="h-4 bg-text-secondary/20 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background tech-grid pt-20">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-light text-text-primary mb-4">
            Article Not Found
          </h1>
          <p className="text-text-secondary mb-8">
            {error || "The article you're looking for doesn't exist or hasn't been loaded yet."}
          </p>
          <p className="text-text-secondary text-sm mb-8">
            Connect to Supabase to enable dynamic article loading.
          </p>
          <Link to="/blog" className="text-primary hover:text-primary-accent">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      line = line.trim();
      if (!line) return <br key={index} />;

      if (line.startsWith("# ")) {
        return (
          <h1
            key={index}
            className="text-4xl font-light text-text-primary mb-6 mt-8"
          >
            {line.slice(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-2xl font-light text-text-primary mb-4 mt-8"
          >
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-xl font-light text-text-primary mb-3 mt-6"
          >
            {line.slice(4)}
          </h3>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={index} className="text-text-primary font-medium mb-4">
            {line.slice(2, -2)}
          </p>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="text-text-secondary mb-2 ml-4 relative">
            <span className="absolute -left-4 text-primary">•</span>
            {line.slice(2)}
          </li>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <li key={index} className="text-text-secondary mb-2 ml-6 relative">
            <span className="absolute -left-6 text-primary">
              {line.match(/^\d+\./)![0]}
            </span>
            {line.replace(/^\d+\.\s*/, "")}
          </li>
        );
      }

      return (
        <p key={index} className="text-text-secondary mb-4 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background tech-grid pt-20">
      {/* Back Navigation */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <Link
          to="/blog"
          className="inline-flex items-center text-primary hover:text-primary-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <section className="bg-card border-l-4 border-primary py-12 px-6 mb-12">
        <div className="max-w-6xl mx-auto">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {article.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {article.readingTime}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              {article.author}
            </div>
            <span className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary">
              {article.category}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-5xl md:text-6xl font-extralight tracking-wider text-text-primary">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-2">

            {/* Quantum Circuit Visualization (for quantum article) */}
            {article.slug === "quantum-computing-enterprise" && (
              <div className="mb-12">
                <QuantumCircuit />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-invert max-w-none">
              {formatContent(article.content)}
            </div>

            {/* Key Takeaways Box */}
            {article.content.includes("Key Takeaways:") && (
              <div className="mt-12 p-6 bg-primary/5 border-l-4 border-primary">
                <h3 className="text-xl font-light text-text-primary mb-4">
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  <li className="text-text-secondary flex items-start">
                    <span className="text-primary mr-3">•</span>
                    Quantum computing is production-ready for specific use cases
                  </li>
                  <li className="text-text-secondary flex items-start">
                    <span className="text-primary mr-3">•</span>
                    Hybrid quantum-classical systems offer immediate value
                  </li>
                  <li className="text-text-secondary flex items-start">
                    <span className="text-primary mr-3">•</span>
                    Early adoption provides competitive advantage
                  </li>
                  <li className="text-text-secondary flex items-start">
                    <span className="text-primary mr-3">•</span>
                    Investment in quantum literacy is critical now
                  </li>
                </ul>
              </div>
            )}

            {/* Article Navigation */}
            <div className="mt-16 pt-8 border-t border-primary/20">
              <div className="flex justify-between items-center">
                <div>
                  <Link
                    to="/blog"
                    className="text-primary hover:text-primary-accent"
                  >
                    View All Articles
                  </Link>
                </div>
                <div className="text-right">
                  <Link
                    to="/blog"
                    className="text-primary hover:text-primary-accent"
                  >
                    Explore More
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar currentSlug={article.slug} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticle;
