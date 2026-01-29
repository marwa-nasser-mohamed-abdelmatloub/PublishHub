import { useEffect, useState, useMemo } from "react";
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
  Modal,
  Form,
  Nav,
} from "react-bootstrap";
import {
  FaEye,
  FaHistory,
  FaCheck,
  FaTimes,
  FaUserCheck,
  FaGlobe,
  FaFileAlt,
  FaUsers,
  FaHourglassHalf,
  FaEdit,
  FaChartBar,
  FaSync,
} from "react-icons/fa";

const AdminWorkflowDashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewers, setReviewers] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showChangeTracker, setShowChangeTracker] = useState(false);
  const [articleChanges, setArticleChanges] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  const tabs = useMemo(
    () => [
      {
        id: "draft",
        label: "Drafts",
        status: "draft",
        icon: <FaFileAlt />,
        color: "secondary",
        count: 0,
      },
      {
        id: "pending",
        label: "Pending Approval",
        status: "submitted",
        icon: <FaHourglassHalf />,
        color: "warning",
        count: 0,
      },
      {
        id: "review",
        label: "Under Review",
        status: "under_review",
        icon: <FaEye />,
        color: "info",
        count: 0,
      },
      {
        id: "approved",
        label: "Approved",
        status: "approved",
        icon: <FaCheck />,
        color: "success",
        count: 0,
      },
      {
        id: "revision",
        label: "Revision",
        status: "revision_requested",
        icon: <FaEdit />,
        color: "warning",
        count: 0,
      },
      {
        id: "published",
        label: "Published",
        status: "published",
        icon: <FaGlobe />,
        color: "success",
        count: 0,
      },
    ],
    [],
  );

  const tabsWithCounts = useMemo(() => {
    return tabs.map((tab) => ({
      ...tab,
      count: articles.filter((article) => article.status === tab.status).length,
    }));
  }, [articles, tabs]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, reviewersRes] = await Promise.all([
          api.get("/articles", { params: { per_page: 100 } }),
          api.get("/users", { params: { role: "reviewer" } }),
        ]);
        const allArticles = articlesRes.data.data || articlesRes.data;
        setArticles(Array.isArray(allArticles) ? allArticles : []);
        setReviewers(reviewersRes.data.data || reviewersRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproveArticle = async (articleId) => {
    try {
      await api.post(`/articles/${articleId}/workflow/approve-article`, {});
      setArticles(
        articles.map((article) =>
          article.id === articleId
            ? { ...article, status: "approved" }
            : article,
        ),
      );
    } catch (error) {
      console.error("Failed to approve article:", error);
      alert("Failed to approve article");
    }
  };

  const handleRejectArticle = async (articleId) => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      await api.post(`/articles/${articleId}/workflow/reject-article`, {
        reason: rejectReason,
      });
      setArticles(
        articles.map((article) =>
          article.id === articleId
            ? { ...article, status: "rejected" }
            : article,
        ),
      );
      setRejectReason("");
      setSelectedArticle(null);
    } catch (error) {
      console.error("Failed to reject article:", error);
      alert("Failed to reject article");
    }
  };

  const handleAssignReviewer = async (articleId) => {
    if (!selectedReviewer) {
      alert("Please select a reviewer");
      return;
    }

    try {
      await api.post(`/articles/${articleId}/workflow/assign-reviewer`, {
        reviewer_id: selectedReviewer,
      });
      setArticles(
        articles.map((article) =>
          article.id === articleId
            ? { ...article, status: "under_review" }
            : article,
        ),
      );
      setSelectedReviewer("");
    } catch (error) {
      console.error("Failed to assign reviewer:", error);
      alert("Failed to assign reviewer");
    }
  };

  const handleViewChanges = async (articleId) => {
    try {
      const response = await api.get(`/articles/${articleId}/workflow/changes`);
      setArticleChanges(response.data.data || response.data);
      setSelectedArticle(articleId);
      setShowChangeTracker(true);
    } catch (error) {
      console.error("Failed to fetch changes:", error);
      alert("Failed to fetch changes");
    }
  };

  const handleApproveChange = async (changeId) => {
    try {
      await api.post(
        `/articles/${selectedArticle}/workflow/changes/${changeId}/approve`,
        {},
      );
      setArticleChanges(
        articleChanges.map((change) =>
          change.id === changeId ? { ...change, status: "approved" } : change,
        ),
      );
    } catch (error) {
      console.error("Failed to approve change:", error);
      alert("Failed to approve change");
    }
  };

  const handleRejectChange = async (changeId) => {
    try {
      await api.post(
        `/articles/${selectedArticle}/workflow/changes/${changeId}/reject`,
        { reason: "Change rejected by admin" },
      );
      setArticleChanges(
        articleChanges.map((change) =>
          change.id === changeId ? { ...change, status: "rejected" } : change,
        ),
      );
    } catch (error) {
      console.error("Failed to reject change:", error);
      alert("Failed to reject change");
    }
  };

  const handlePublishArticle = async (articleId) => {
    try {
      await api.post(`/articles/${articleId}/workflow/publish`, {});
      setArticles(
        articles.map((article) =>
          article.id === articleId
            ? { ...article, status: "published" }
            : article,
        ),
      );
    } catch (error) {
      console.error("Failed to publish article:", error);
      alert("Failed to publish article");
    }
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

  const activeTabConfig =
    tabsWithCounts.find((tab) => tab.id === activeTab) || tabsWithCounts[0];
  const filteredArticles = articles.filter(
    (article) => article.status === activeTabConfig.status,
  );

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold text-primary">
            <FaChartBar className="me-3" />
            Article Workflow Dashboard
          </h1>
          <p className="text-muted">
            Manage publication workflow and track article progress
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
        {tabsWithCounts.map((tab) => (
          <Col key={tab.id} xs={6} md={4} lg={2}>
            <Card
              className={`shadow-sm border-0 h-100 cursor-pointer ${activeTab === tab.id ? "border-primary border-2" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Card.Body className="text-center">
                <div
                  className={`text-${tab.color} mb-2`}
                  style={{ fontSize: "2rem" }}
                >
                  {tab.icon}
                </div>
                <h3 className="fw-bold">{tab.count}</h3>
                <p className="text-muted mb-0">{tab.label}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content */}
      <Card className="shadow-lg border-0">
        <Card.Body>
          {/* Tabs */}
          <Nav variant="tabs" className="mb-4">
            {tabsWithCounts.map((tab) => (
              <Nav.Item key={tab.id}>
                <Nav.Link
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="d-flex align-items-center gap-2"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <Badge bg={tab.color} pill>
                      {tab.count}
                    </Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {/* Articles List */}
          <Row className="g-4">
            {filteredArticles.length === 0 ? (
              <Col className="text-center py-5">
                <FaFileAlt className="display-1 text-muted mb-3" />
                <h4 className="text-muted">No articles found</h4>
                <p className="text-muted">
                  There are no articles in "{activeTabConfig.label}" status.
                </p>
              </Col>
            ) : (
              filteredArticles.map((article) => (
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
                              <FaUserCheck className="me-1" />
                              {article.author?.name || "Unknown Author"}
                            </span>
                            <span>
                              <FaFileAlt className="me-1" />
                              {formatDate(article.created_at)}
                            </span>
                          </div>
                        </div>
                        <Badge
                          bg={
                            tabsWithCounts.find(
                              (t) => t.status === article.status,
                            )?.color || "secondary"
                          }
                        >
                          {article.status?.replace(/_/g, " ") || "Unknown"}
                        </Badge>
                      </div>

                      <p
                        className="text-muted small mb-4"
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

                      {/* Action Buttons */}
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/articles/${article.id}`)}
                        >
                          <FaEye className="me-1" />
                          View
                        </Button>

                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleViewChanges(article.id)}
                        >
                          <FaHistory className="me-1" />
                          Changes
                        </Button>

                        {/* Status-specific actions */}
                        {article.status === "submitted" && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApproveArticle(article.id)}
                            >
                              <FaCheck className="me-1" />
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setSelectedArticle(article.id)}
                            >
                              <FaTimes className="me-1" />
                              Reject
                            </Button>
                          </>
                        )}

                        {article.status === "approved" && (
                          <div className="d-flex gap-2 align-items-center mt-2 w-100">
                            <Form.Select
                              size="sm"
                              value={selectedReviewer}
                              onChange={(e) =>
                                setSelectedReviewer(e.target.value)
                              }
                              style={{ flex: 1 }}
                            >
                              <option value="">Select Reviewer</option>
                              {reviewers.map((reviewer) => (
                                <option key={reviewer.id} value={reviewer.id}>
                                  {reviewer.name || `Reviewer ${reviewer.id}`}
                                </option>
                              ))}
                            </Form.Select>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAssignReviewer(article.id)}
                              disabled={!selectedReviewer}
                            >
                              <FaUsers className="me-1" />
                              Assign
                            </Button>
                          </div>
                        )}

                        {article.status === "ready_for_review" && (
                          <div className="d-flex gap-2 align-items-center mt-2 w-100">
                            <Form.Select
                              size="sm"
                              value={selectedReviewer}
                              onChange={(e) =>
                                setSelectedReviewer(e.target.value)
                              }
                              style={{ flex: 1 }}
                            >
                              <option value="">Re-assign Reviewer</option>
                              {reviewers.map((reviewer) => (
                                <option key={reviewer.id} value={reviewer.id}>
                                  {reviewer.name || `Reviewer ${reviewer.id}`}
                                </option>
                              ))}
                            </Form.Select>
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => handleAssignReviewer(article.id)}
                              disabled={!selectedReviewer}
                            >
                              <FaSync className="me-1" />
                              Re-assign
                            </Button>
                          </div>
                        )}

                        {article.status === "approved" &&
                          activeTab === "approved" && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handlePublishArticle(article.id)}
                              className="mt-2"
                            >
                              <FaGlobe className="me-1" />
                              Publish
                            </Button>
                          )}

                        {article.status === "revision_pending" && (
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handlePublishArticle(article.id)}
                          >
                            <FaCheck className="me-1" />
                            Approve Revision
                          </Button>
                        )}
                      </div>

                      {/* Reject Modal for this article */}
                      {selectedArticle === article.id && (
                        <Card className="mt-3 border-danger">
                          <Card.Body>
                            <h6 className="text-danger mb-3">
                              <FaTimes className="me-2" />
                              Reject Article
                            </h6>
                            <Form.Group className="mb-3">
                              <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Reason for rejection..."
                                value={rejectReason}
                                onChange={(e) =>
                                  setRejectReason(e.target.value)
                                }
                              />
                            </Form.Group>
                            <div className="d-flex gap-2">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleRejectArticle(article.id)}
                                disabled={!rejectReason.trim()}
                              >
                                Confirm Rejection
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setSelectedArticle(null)}
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
              ))
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Change Tracker Modal */}
      <Modal
        show={showChangeTracker}
        onHide={() => setShowChangeTracker(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FaHistory className="me-2" />
            Track Changes
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {articleChanges.length === 0 ? (
            <div className="text-center py-4">
              <FaFileAlt className="display-4 text-muted mb-3" />
              <h5 className="text-muted">No changes to track</h5>
            </div>
          ) : (
            articleChanges.map((change) => (
              <Card key={change.id} className="mb-3 border-warning">
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={6}>
                      <h6 className="text-danger">
                        <FaTimes className="me-2" />
                        Old Text
                      </h6>
                      <div className="p-2 bg-light rounded">
                        {change.old_text || "No old text"}
                      </div>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-success">
                        <FaCheck className="me-2" />
                        New Text
                      </h6>
                      <div className="p-2 bg-light rounded">
                        {change.new_text || "No new text"}
                      </div>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Badge
                        bg={
                          change.status === "approved"
                            ? "success"
                            : change.status === "rejected"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {change.status?.toUpperCase() || "UNKNOWN"}
                      </Badge>
                    </div>
                    {change.status === "pending" && (
                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApproveChange(change.id)}
                        >
                          <FaCheck className="me-1" />
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRejectChange(change.id)}
                        >
                          <FaTimes className="me-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowChangeTracker(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};;

export default AdminWorkflowDashboard;
