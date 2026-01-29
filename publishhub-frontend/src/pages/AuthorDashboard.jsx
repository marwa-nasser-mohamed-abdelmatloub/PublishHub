import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { articleService } from "../services";
import { useAuth } from "../hooks/useAuth";
import {
  FaPenFancy,
  FaPlus,
  FaFileAlt,
  FaEdit,
  FaEye,
  FaHistory,
  FaBook,
  FaBookOpen,
  FaChartBar,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaNewspaper,
  FaLink,
  FaArrowRight,
  FaSync,
  FaTimesCircle,
  FaChartPie,
  FaStar,
  FaAward,
  FaChartLine,
  FaShieldAlt,
  FaLightbulb,
  FaThumbsUp,
  FaEllipsisH,
  FaExternalLinkAlt,
  FaTrophy,
  FaPenAlt,
  FaFileContract,
  FaUserCheck,
  FaBalanceScale,
} from "react-icons/fa";

const AuthorDashboard = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentActivity, setRecentActivity] = useState([]);
  const loadAuthorArticles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await articleService.getAll();

      let allArticles = Array.isArray(response)
        ? response
        : response?.data || [];

      const authorArticles = allArticles.filter((a) => a.author_id === user.id);

      setArticles(authorArticles);

      setStats({
        total: authorArticles.length,
        draft: authorArticles.filter((a) => a.status === "draft").length,
        submitted: authorArticles.filter((a) => a.status === "submitted")
          .length,
        approved: authorArticles.filter((a) => a.status === "approved").length,
        rejected: authorArticles.filter((a) => a.status === "rejected").length,
      });

      const recent = [...authorArticles]
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 5);
      setRecentActivity(recent);
    } catch (err) {
      setError(err.message || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadAuthorArticles();
  }, [loadAuthorArticles]);

  const refreshDashboard = () => {
    loadAuthorArticles();
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">
            <FaClock className="me-2" />
            Loading author dashboard...
          </p>
        </div>
      </Container>
    );
  }

  const draftArticles = articles.filter((a) => a.status === "draft");
  const publishedArticles = articles.filter((a) => a.status === "approved");

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle p-3 me-3"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
              color: "white",
            }}
          >
            <FaPenFancy size={30} />
          </div>
          <div>
            <h1 className="fw-bold mb-1">Author Dashboard</h1>
            <p className="text-muted mb-0">
              Welcome back, {user?.name || "Author"}
            </p>
          </div>
        </div>
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <Button
            variant="outline-primary"
            onClick={refreshDashboard}
            size="sm"
            className="d-flex align-items-center"
          >
            <FaSync className="me-2" />
            Refresh
          </Button>
          <Button
            href="/articles/create"
            size="sm"
            className="d-flex align-items-center w-100 w-sm-auto"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              fontWeight: "600",
            }}
          >
            <FaPlus className="me-2" /> Create Article
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          variant="danger"
          onClose={() => setError("")}
          dismissible
          className="d-flex align-items-center"
        >
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      {/* Main Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(37, 99, 235, 0.1)" }}
              >
                <FaFileAlt size={24} color="#2563eb" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.total}</h2>
                <p className="text-muted mb-0">
                  <FaFileAlt size={14} className="me-1" />
                  Total Articles
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(107, 114, 128, 0.1)" }}
              >
                <FaBook size={24} color="#6b7280" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.draft}</h2>
                <p className="text-muted mb-0">
                  <FaBook size={14} className="me-1" />
                  Drafts
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
              >
                <FaClock size={24} color="#f59e0b" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.submitted}</h2>
                <p className="text-muted mb-0">
                  <FaClock size={14} className="me-1" />
                  Under Review
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
              >
                <FaCheckCircle size={24} color="#10b981" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.approved}</h2>
                <p className="text-muted mb-0">
                  <FaCheckCircle size={14} className="me-1" />
                  Published
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <FaChartBar className="text-primary me-2" />
                <h6 className="fw-bold mb-0">Approval Rate</h6>
              </div>
              <h3 className="fw-bold mb-0">
                {stats.total > 0
                  ? Math.round((stats.approved / stats.total) * 100)
                  : 0}
                %
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <FaStar className="text-warning me-2" />
                <h6 className="fw-bold mb-0">Avg. Reviews</h6>
              </div>
              <h3 className="fw-bold mb-0">2.3</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <FaClock className="text-info me-2" />
                <h6 className="fw-bold mb-0">Avg. Time</h6>
              </div>
              <h3 className="fw-bold mb-0">5.2 days</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <FaAward className="text-success me-2" />
                <h6 className="fw-bold mb-0">Performance</h6>
              </div>
              <h3 className="fw-bold mb-0">88%</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="g-4">
        {/* Draft Articles */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <FaBook className="me-2 text-secondary" size={20} />
                  <h5 className="fw-bold mb-0">
                    My Drafts ({draftArticles.length})
                  </h5>
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="d-flex align-items-center"
                  href="/articles?status=draft"
                >
                  View All
                  <FaArrowRight className="ms-2" size={14} />
                </Button>
              </div>

              {draftArticles.length === 0 ? (
                <div className="text-center py-5">
                  <FaCheckCircle size={48} className="text-success mb-3" />
                  <h5 className="fw-bold mb-2">No Draft Articles</h5>
                  <p className="text-muted mb-0">
                    All your articles are submitted!{" "}
                    <FaCheckCircle className="ms-1" />
                  </p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {draftArticles.slice(0, 5).map((article) => (
                    <div
                      key={article.id}
                      className="list-group-item list-group-item-action border-0 px-0 py-3"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-1">
                            <h6 className="fw-bold mb-0 me-2">
                              {article.title}
                            </h6>
                            <Badge
                              bg="secondary"
                              className="d-flex align-items-center"
                            >
                              <FaBook size={12} className="me-1" />
                              Draft
                            </Badge>
                          </div>
                          <p className="text-muted small mb-2">
                            {article.content?.substring(0, 80)}...
                          </p>
                          <div className="d-flex gap-3">
                            <small className="text-muted">
                              <FaCalendarAlt size={12} className="me-1" />
                              {new Date(
                                article.created_at,
                              ).toLocaleDateString()}
                            </small>
                            {article.updated_at && (
                              <small className="text-info">
                                <FaPenAlt size={12} className="me-1" />
                                Updated:{" "}
                                {new Date(
                                  article.updated_at,
                                ).toLocaleDateString()}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="d-flex flex-column gap-2 ms-3">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            href={`/articles/${article.id}/edit`}
                            className="d-flex align-items-center"
                          >
                            <FaEdit className="me-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            href={`/articles/${article.id}`}
                            className="d-flex align-items-center"
                          >
                            <FaEye className="me-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <FaHistory className="me-2 text-primary" size={20} />
                  <h5 className="fw-bold mb-0">Recent Activity</h5>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-muted p-0"
                  href="/articles"
                >
                  <FaEllipsisH />
                </Button>
              </div>

              <div className="list-group list-group-flush">
                {recentActivity.length > 0 ? (
                  recentActivity.map((article, index) => (
                    <div
                      key={article.id || index}
                      className="list-group-item border-0 px-0 py-3"
                    >
                      <div className="d-flex">
                        <div className="me-3 mt-1">
                          {article.status === "approved" ? (
                            <FaCheckCircle className="text-success" />
                          ) : article.status === "rejected" ? (
                            <FaTimesCircle className="text-danger" />
                          ) : article.status === "submitted" ? (
                            <FaClock className="text-warning" />
                          ) : (
                            <FaBook className="text-secondary" />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1 small">
                            {article.title?.substring(0, 40) || "Article"}
                            {article.title?.length > 40 && "..."}
                          </p>
                          <small className="text-muted">
                            <Badge
                              bg={getStatusColor(article.status)}
                              className="me-2"
                            >
                              {article.status}
                            </Badge>
                            <FaCalendarAlt size={12} className="me-1" />
                            {new Date(article.updated_at).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted mb-0">No recent activity</p>
                  </div>
                )}
              </div>

              {/* Article Statistics */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-bold mb-3">
                  <FaChartPie className="me-2 text-info" />
                  Article Statistics
                </h6>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Publication Rate</span>
                  <span className="fw-bold small text-success">
                    {stats.total > 0
                      ? Math.round((stats.approved / stats.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Under Review</span>
                  <span className="fw-bold small text-warning">
                    {stats.submitted}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Rejection Rate</span>
                  <span className="fw-bold small text-danger">
                    {stats.total > 0
                      ? Math.round((stats.rejected / stats.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Published Articles */}
      {publishedArticles.length > 0 && (
        <Card className="shadow-sm border-0 mt-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <FaCheckCircle className="me-2 text-success" size={20} />
                <h5 className="fw-bold mb-0">
                  Published Articles ({publishedArticles.length})
                </h5>
              </div>
              <Button
                variant="link"
                size="sm"
                className="text-primary p-0 d-flex align-items-center"
                href="/articles?status=approved"
              >
                View All
                <FaArrowRight className="ms-1" size={14} />
              </Button>
            </div>

            <Row className="g-3">
              {publishedArticles.slice(0, 3).map((article) => (
                <Col md={4} key={article.id}>
                  <Card className="border h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="fw-bold mb-0 flex-grow-1">
                          {article.title?.substring(0, 40) || "Article"}
                          {article.title?.length > 40 && "..."}
                        </h6>
                        <Badge bg="success" className="ms-2">
                          Published
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <FaCalendarAlt
                            size={12}
                            className="text-muted me-2"
                          />
                          <small className="text-muted">
                            Published:{" "}
                            {new Date(
                              article.published_at || article.updated_at,
                            ).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <FaEye size={12} className="text-muted me-2" />
                          <small className="text-muted">
                            Views: {article.views || "0"}
                          </small>
                        </div>
                      </div>

                      <p className="text-muted small mb-3">
                        {article.content?.substring(0, 80)}...
                      </p>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <FaThumbsUp className="text-success me-2" />
                          <small className="text-muted">
                            {article.likes || "0"} likes
                          </small>
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 d-flex align-items-center"
                          href={`/articles/${article.id}`}
                        >
                          View
                          <FaExternalLinkAlt className="ms-1" size={12} />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Quick Actions & Guidelines */}
      <Row className="g-4 mt-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-4">
                <FaLightbulb className="me-2 text-primary" />
                Quick Actions
              </h5>
              <Row className="g-3">
                <Col xs={6} md={3} lg={2}>
                  <Button
                    href="/articles/create"
                    variant="outline-primary"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <FaPlus size={20} className="mb-2" />
                    <span className="small">New Article</span>
                  </Button>
                </Col>
                <Col xs={6} md={3} lg={2}>
                  <Button
                    href="/articles"
                    variant="outline-success"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <FaBookOpen size={20} className="mb-2" />
                    <span className="small">My Articles</span>
                  </Button>
                </Col>
                <Col xs={6} md={3} lg={2}>
                  <Button
                    href="/revisions/my"
                    variant="outline-info"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <FaHistory size={20} className="mb-2" />
                    <span className="small">Revisions</span>
                  </Button>
                </Col>
                <Col xs={6} md={3} lg={2}>
                  <Button
                    href="/articles?status=approved"
                    variant="outline-warning"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <FaNewspaper size={20} className="mb-2" />
                    <span className="small">Published</span>
                  </Button>
                </Col>
                <Col xs={6} md={3} lg={2}>
                  <Button
                    href="/profile"
                    variant="outline-secondary"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <FaUserCheck size={20} className="mb-2" />
                    <span className="small">Profile</span>
                  </Button>
                </Col>
                <Col xs={6} md={3} lg={2}>
                  <Button
                    href="/guidelines"
                    variant="outline-dark"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <FaFileContract size={20} className="mb-2" />
                    <span className="small">Guidelines</span>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-4">
                <FaShieldAlt className="me-2 text-success" />
                Writing Tips
              </h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <FaCheckCircle className="text-success me-2" />
                  <small>Check submission guidelines</small>
                </li>
                <li className="mb-2">
                  <FaCheckCircle className="text-success me-2" />
                  <small>Verify references and citations</small>
                </li>
                <li className="mb-2">
                  <FaCheckCircle className="text-success me-2" />
                  <small>Review for clarity and structure</small>
                </li>
                <li className="mb-2">
                  <FaCheckCircle className="text-success me-2" />
                  <small>Proofread before submission</small>
                </li>
                <li>
                  <FaCheckCircle className="text-success me-2" />
                  <small>Respond to reviewer feedback</small>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Footer Stats */}
      <div className="mt-4 pt-3 border-top">
        <Row className="g-3">
          <Col md={4}>
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle p-2 me-3"
                style={{ backgroundColor: "rgba(37, 99, 235, 0.1)" }}
              >
                <FaChartLine size={20} color="#2563eb" />
              </div>
              <div>
                <h6 className="fw-bold mb-0">Monthly Progress</h6>
                <p className="text-muted small mb-0">
                  <FaStar size={12} className="me-1" />
                  {articles.length} articles this month
                </p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle p-2 me-3"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
              >
                <FaAward size={20} color="#10b981" />
              </div>
              <div>
                <h6 className="fw-bold mb-0">Achievements</h6>
                <p className="text-muted small mb-0">
                  <FaTrophy size={12} className="me-1" />
                  {stats.approved} articles published
                </p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle p-2 me-3"
                style={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
              >
                <FaBalanceScale size={20} color="#8b5cf6" />
              </div>
              <div>
                <h6 className="fw-bold mb-0">Quality Metrics</h6>
                <p className="text-muted small mb-0">
                  <FaLink size={12} className="me-1" />
                  <a href="/author/analytics" className="text-decoration-none">
                    View detailed analytics
                  </a>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

const getStatusColor = (status) => {
  const statusMap = {
    draft: "secondary",
    submitted: "info",
    under_review: "warning",
    approved: "success",
    rejected: "danger",
    revision_requested: "warning",
  };
  return statusMap[status] || "secondary";
};

export default AuthorDashboard;
