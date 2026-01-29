import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Pagination,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { articleService } from "../services";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { formatDate, getStatusColor } from "../utils/helpers";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const { user } = useAuth();

  const loadArticles = useCallback(
    async (page = currentPage) => {
      setLoading(true);
      setError("");
      try {
        const response = await articleService.getAll(page);
        setArticles(response.data || []);
        setTotalPages(Math.ceil((response.meta?.total || 0) / 10));
      } catch (error) {
        console.error(error);
        setError(error?.message || "Failed to load articles");
      } finally {
        setLoading(false);
      }
    },
    [currentPage],
  );

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleDelete = async (id) => {
    try {
      await articleService.delete(id);
      loadArticles();
    } catch (err) {
      setError(`Failed to delete article: ${err.message || err.toString()}`);
    }
  };

  const handleSubmitArticle = async (id) => {
    try {
      setError("");
      await api.post(`/articles/${id}/submit`, {});
      loadArticles();
    } catch (err) {
      setError(`Failed to submit article: ${err.message || err.toString()}`);
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col md={8}>
          <h2 className="fw-bold">Articles</h2>
        </Col>
        {user?.role === "author" && (
          <Col md={4} className="text-end">
            <Button
              variant="success"
              onClick={() => navigate("/articles/create")}
              className="gap-2"
            >
              <i className="bi bi-plus-circle"></i> Create Article
            </Button>
          </Col>
        )}
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : articles.length === 0 ? (
        <Alert variant="info">No articles found</Alert>
      ) : (
        <>
          <Row className="g-4 mb-4">
            {articles.map((article) => (
              <Col md={6} lg={4} key={article.id}>
                <Card className="h-100 shadow-sm border-0 article-card">
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-2">
                      <Badge bg={getStatusColor(article.status)}>
                        {article.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <Card.Title className="text-truncate-2 mb-2">
                      {article.title}
                    </Card.Title>
                    <Card.Text className="text-muted text-truncate-2 flex-grow-1">
                      {article.content.substring(0, 100)}...
                    </Card.Text>
                    <small className="text-muted mb-3">
                      By {article.author?.name} •{" "}
                      {formatDate(article.created_at)}
                    </small>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/articles/${article.id}`)}
                        className="flex-grow-1"
                      >
                        View
                      </Button>
                      {user?.role === "author" &&
                        article.author_id === user.id &&
                        article.status === "draft" && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleSubmitArticle(article.id)}
                              title="Submit for Review"
                              className="flex-grow-1"
                            >
                              ✓ Submit for Review
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                navigate(`/articles/${article.id}/edit`)
                              }
                            >
                              ✏️
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(article.id)}
                            >
                              🗑️
                            </Button>
                          </>
                        )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                ),
              )}
              <Pagination.Next
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default ArticleList;
