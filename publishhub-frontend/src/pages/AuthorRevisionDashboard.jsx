import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Form,
  Nav,
} from "react-bootstrap";
import {
  FaEdit,
  FaEye,
  FaHistory,
  FaFileAlt,
  FaUser,
  FaCalendar,
  FaCheck,
  FaTimes,
  FaSync,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaRegEdit,
  FaComments,
  FaRedo,
} from "react-icons/fa";

const AuthorRevisionDashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [revisionReason, setRevisionReason] = useState("");
  const [editingArticle, setEditingArticle] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [activeTab, setActiveTab] = useState("revision");

  const tabs = [
    {
      id: "revision",
      label: "Needs Revision",
      statuses: ["revision_pending", "revision_approved"],
      icon: <FaEdit />,
      color: "warning",
    },
    {
      id: "rejected",
      label: "Rejected",
      statuses: ["review_rejected"],
      icon: <FaTimes />,
      color: "danger",
    },
    {
      id: "under_review",
      label: "Under Review",
      statuses: ["under_review"],
      icon: <FaHourglassHalf />,
      color: "info",
    },
    {
      id: "published",
      label: "Published",
      statuses: ["published"],
      icon: <FaCheck />,
      color: "success",
    },
  ];

  const statusMap = {
    review_rejected: { label: "Rejected by Reviewer", color: "danger" },
    revision_pending: { label: "Revision Requested", color: "warning" },
    revision_approved: { label: "Approved for Revision", color: "info" },
    under_review: { label: "Under Review", color: "info" },
    published: { label: "Published", color: "success" },
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/articles");
        setArticles(response.data.data || response.data);
      } catch (fetchError) {
        console.error("Failed to fetch articles:", fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleRequestRevision = async (articleId) => {
    if (!revisionReason.trim()) {
      alert("Please provide a reason for revision request");
      return;
    }

    try {
      await api.post(`/articles/${articleId}/workflow/request-revision`, {
        reason: revisionReason,
      });

      setArticles(
        articles.map((article) =>
          article.id === articleId
            ? { ...article, status: "revision_pending" }
            : article,
        ),
      );

      setSelectedArticle(null);
      setRevisionReason("");
    } catch (requestError) {
      console.error("Failed to request revision:", requestError);
      alert("Failed to request revision");
    }
  };

  const handleStartEditing = (article) => {
    setEditingArticle(article.id);
    setEditedContent(article.content || "");
  };

  const handleSaveRevision = async (articleId) => {
    if (!editedContent.trim()) {
      alert("Article content cannot be empty");
      return;
    }

    try {
      const response = await api.put(`/articles/${articleId}`, {
        content: editedContent,
      });

      setArticles(
        articles.map((article) =>
          article.id === articleId
            ? {
                ...article,
                content: editedContent,
                version: response.data.data.version,
              }
            : article,
        ),
      );

      setEditingArticle(null);
      setEditedContent("");
      alert("Revision saved successfully!");
    } catch (saveError) {
      console.error("Failed to save revision:", saveError);
      alert("Failed to save revision");
    }
  };

  const handleViewTrackedChanges = (articleId) => {
    navigate(`/articles/${articleId}/changes`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading articles...</span>
      </Container>
    );
  }

  const revisionArticles = articles.filter((article) =>
    tabs
      .find((tab) => tab.id === "revision")
      ?.statuses.includes(article.status),
  );
  const rejectedArticles = articles.filter((article) =>
    tabs
      .find((tab) => tab.id === "rejected")
      ?.statuses.includes(article.status),
  );
  const underReviewArticles = articles.filter((article) =>
    tabs
      .find((tab) => tab.id === "under_review")
      ?.statuses.includes(article.status),
  );
  const publishedArticles = articles.filter((article) =>
    tabs
      .find((tab) => tab.id === "published")
      ?.statuses.includes(article.status),
  );

  const filteredArticles = articles.filter((article) =>
    tabs.find((tab) => tab.id === activeTab)?.statuses.includes(article.status),
  );

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold text-primary">
            <FaRegEdit className="me-3" />
            Author Revision Dashboard
          </h1>
          <p className="text-muted">
            Manage and revise your articles based on reviewer feedback
          </p>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <FaSync className="me-2" />
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col xs={6} md={3}>
          <Card className="shadow-sm border-0 bg-warning bg-opacity-10">
            <Card.Body className="text-center">
              <div className="text-warning mb-2" style={{ fontSize: "2rem" }}>
                <FaEdit />
              </div>
              <h3 className="fw-bold">{revisionArticles.length}</h3>
              <p className="text-muted mb-0">Needs Revision</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="shadow-sm border-0 bg-danger bg-opacity-10">
            <Card.Body className="text-center">
              <div className="text-danger mb-2" style={{ fontSize: "2rem" }}>
                <FaTimes />
              </div>
              <h3 className="fw-bold">{rejectedArticles.length}</h3>
              <p className="text-muted mb-0">Rejected</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="shadow-sm border-0 bg-info bg-opacity-10">
            <Card.Body className="text-center">
              <div className="text-info mb-2" style={{ fontSize: "2rem" }}>
                <FaHourglassHalf />
              </div>
              <h3 className="fw-bold">{underReviewArticles.length}</h3>
              <p className="text-muted mb-0">Under Review</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="shadow-sm border-0 bg-success bg-opacity-10">
            <Card.Body className="text-center">
              <div className="text-success mb-2" style={{ fontSize: "2rem" }}>
                <FaCheck />
              </div>
              <h3 className="fw-bold">{publishedArticles.length}</h3>
              <p className="text-muted mb-0">Published</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card className="shadow-lg border-0">
        <Card.Body>
          {/* Tabs */}
          <Nav variant="tabs" className="mb-4">
            {tabs.map((tab) => {
              const count = articles.filter((article) =>
                tab.statuses.includes(article.status),
              ).length;

              return (
                <Nav.Item key={tab.id}>
                  <Nav.Link
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="d-flex align-items-center gap-2"
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {count > 0 && (
                      <Badge bg={tab.color} pill>
                        {count}
                      </Badge>
                    )}
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>

          {/* Content */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-5">
              <div
                className={`text-${tabs.find((t) => t.id === activeTab)?.color || "secondary"}`}
                style={{ fontSize: "4rem" }}
              >
                {tabs.find((t) => t.id === activeTab)?.icon || <FaFileAlt />}
              </div>
              <h4 className="text-muted mt-3">No articles found</h4>
              <p className="text-muted">
                {activeTab === "revision"
                  ? "No articles require revision at this time"
                  : activeTab === "rejected"
                    ? "No rejected articles"
                    : activeTab === "under_review"
                      ? "No articles under review"
                      : "No published articles"}
              </p>
            </div>
          ) : (
            <Row className="g-4">
              {filteredArticles.map((article) => (
                <Col key={article.id} lg={6}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5
                            className="fw-bold text-truncate"
                            style={{ maxWidth: "300px" }}
                          >
                            {article.title || "Untitled Article"}
                          </h5>
                          <div className="d-flex gap-3 text-muted small">
                            <span>
                              <FaUser className="me-1" />
                              Version: {article.version || "1.0"}
                            </span>
                            <span>
                              <FaCalendar className="me-1" />
                              Updated: {formatDate(article.updated_at)}
                            </span>
                          </div>
                        </div>
                        <Badge
                          bg={statusMap[article.status]?.color || "secondary"}
                        >
                          {statusMap[article.status]?.label || article.status}
                        </Badge>
                      </div>

                      <div className="mb-4">
                        <p
                          className="text-muted small"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {article.content?.substring(0, 150) ||
                            "No content available"}
                          ...
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/articles/${article.id}`)}
                        >
                          <FaEye className="me-1" />
                          View Article
                        </Button>

                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleViewTrackedChanges(article.id)}
                        >
                          <FaHistory className="me-1" />
                          View Changes
                        </Button>

                        {/* Status-specific actions */}
                        {article.status === "revision_approved" && (
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleStartEditing(article)}
                          >
                            <FaEdit className="me-1" />
                            Edit Article
                          </Button>
                        )}

                        {article.status === "review_rejected" && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              setSelectedArticle(
                                selectedArticle === article.id
                                  ? null
                                  : article.id,
                              )
                            }
                          >
                            <FaRedo className="me-1" />
                            {selectedArticle === article.id
                              ? "Cancel"
                              : "Request Revision"}
                          </Button>
                        )}
                      </div>

                      {/* Edit Form */}
                      {editingArticle === article.id && (
                        <Card className="mt-3 border-warning">
                          <Card.Body>
                            <h6 className="text-warning mb-3">
                              <FaEdit className="me-2" />
                              Edit Article
                            </h6>
                            <Form.Group className="mb-3">
                              <Form.Control
                                as="textarea"
                                rows={8}
                                value={editedContent}
                                onChange={(e) =>
                                  setEditedContent(e.target.value)
                                }
                              />
                            </Form.Group>
                            <div className="d-flex gap-2">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleSaveRevision(article.id)}
                              >
                                <FaCheck className="me-1" />
                                Save Revision
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                  setEditingArticle(null);
                                  setEditedContent("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      )}

                      {/* Request Revision Form */}
                      {selectedArticle === article.id && (
                        <Card className="mt-3 border-danger">
                          <Card.Body>
                            <h6 className="text-danger mb-3">
                              <FaExclamationTriangle className="me-2" />
                              Request Revision
                            </h6>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold">
                                <FaComments className="me-1" /> Revision Plan
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={4}
                                value={revisionReason}
                                onChange={(e) =>
                                  setRevisionReason(e.target.value)
                                }
                                placeholder="Explain what revisions you plan to make..."
                              />
                              <Form.Text className="text-muted">
                                Describe how you plan to address the reviewer's
                                feedback
                              </Form.Text>
                            </Form.Group>
                            <div className="d-flex gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  handleRequestRevision(article.id)
                                }
                                disabled={!revisionReason.trim()}
                              >
                                <FaCheck className="me-1" />
                                Submit Request
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                  setSelectedArticle(null);
                                  setRevisionReason("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuthorRevisionDashboard;
