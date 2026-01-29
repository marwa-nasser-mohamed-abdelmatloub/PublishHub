import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { articleService } from "../services";
import { useAuth } from "../hooks/useAuth";
import ArticleCard from "../components/ArticleCard";
import { LoadingSpinner } from "../components/Common";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const { isAuthor } = useAuth();
  const navigate = useNavigate();

  const loadArticles = useCallback(
    async (p = page) => {
      setLoading(true);
      setError("");
      try {
        const response = await articleService.getAll(p);
        setArticles(response.data || []);
      } catch (error) {
        console.error(error);
        setError(error?.message || "Failed to load articles");
      } finally {
        setLoading(false);
      }
    },
    [page],
  );

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleDelete = async (articleId) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      await articleService.delete(articleId);
      loadArticles();
    } catch (error) {
      console.error(error);
      alert(error?.message || "Failed to delete article");
    }
  };

  if (loading && articles.length === 0) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Articles</h1>
          {isAuthor && (
            <button
              onClick={() => navigate("/articles/create")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Article
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onView={(id) => navigate(`/articles/${id}`)}
                onEdit={
                  isAuthor ? (id) => navigate(`/articles/${id}/edit`) : null
                }
                onDelete={isAuthor ? handleDelete : null}
              />
            ))
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600">No articles found</p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={articles.length === 0}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Articles;
