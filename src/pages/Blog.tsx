import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useArticles } from "../hooks/useArticles";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

const Blog = () => {
  const [animatePage, setAnimatePage] = useState(false);
  const [animatePosts, setAnimatePosts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  
  const { articles, total, loading, error } = useArticles({
    page: currentPage,
    limit: articlesPerPage
  });

  useEffect(() => {
    // Reset animations when page changes
    setAnimatePage(false);
    setAnimatePosts(false);
    
    const pageTimer = setTimeout(() => {
      setAnimatePage(true);
    }, 100);

    const postsTimer = setTimeout(() => {
      setAnimatePosts(true);
    }, 500);

    return () => {
      clearTimeout(pageTimer);
      clearTimeout(postsTimer);
    };
  }, [currentPage]);

  const totalPages = Math.ceil(total / articlesPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of page content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
            isActive={1 === currentPage}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and surrounding pages
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(totalPages);
              }}
              isActive={totalPages === currentPage}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    return items;
  };

  return (
    <div className="min-h-screen bg-background tech-grid pt-20">
      {/* Hero Section */}
      <section
        className={`py-20 px-6 transition-all duration-600 ${
          animatePage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
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
      <section
        className={`py-20 px-6 transition-all duration-600 ${
          animatePage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Animated blue line */}
          <div
            className={`h-px bg-primary mb-20 transition-all duration-500 ${
              animatePosts ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
          />

          <div className="space-y-20">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="h-4 bg-primary/20 rounded w-24"></div>
                    <div className="h-4 bg-text-secondary/20 rounded w-16"></div>
                    <div className="h-4 bg-text-secondary/20 rounded w-20"></div>
                    <div className="h-6 bg-primary/20 rounded w-32"></div>
                  </div>
                  <div className="h-8 bg-text-secondary/20 rounded mb-6"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-text-secondary/20 rounded"></div>
                    <div className="h-4 bg-text-secondary/20 rounded w-4/5"></div>
                    <div className="h-4 bg-text-secondary/20 rounded w-3/5"></div>
                  </div>
                  <div className="h-4 bg-primary/20 rounded w-32"></div>
                </div>
              ))
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 mb-4 text-2xl">
                  ⚠️ Unable to load articles
                </div>
                <p className="text-text-secondary mb-4">{error}</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-text-secondary mb-4 text-2xl">
                  📝 No articles available
                </div>
                <p className="text-text-secondary text-sm">
                  Connect to Supabase and add some articles to see them here.
                </p>
              </div>
            ) : (
              articles.map((post, index) => (
                <article
                  key={post.id}
                  className={`transition-all duration-600 hover:pl-6 hover:border-l-2 hover:border-primary cursor-pointer group ${
                    animatePosts
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: animatePosts ? `${index * 150}ms` : "0ms",
                  }}
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <time className="text-primary tracking-widest">
                          {new Date(post.publishDate)
                            .toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                            .toUpperCase()}
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
                      <span className="text-sm tracking-wider">
                        READ ANALYSIS
                      </span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </article>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && articles.length > 0 && totalPages > 1 && (
            <div className={`mt-20 transition-all duration-600 ${
              animatePosts ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: animatePosts ? `${articles.length * 150 + 200}ms` : "0ms" }}>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              {/* Page info */}
              <div className="text-center mt-6 text-sm text-text-secondary">
                Showing {((currentPage - 1) * articlesPerPage) + 1} to {Math.min(currentPage * articlesPerPage, total)} of {total} articles
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
