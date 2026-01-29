import { useState, useEffect } from "react";
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
import { reviewService } from "../services";
import { useAuth } from "../hooks/useAuth";
import {
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaClipboardCheck,
  FaUser,
  FaCalendarAlt,
  FaArrowRight,
  FaSync,
  FaExclamationTriangle,
  FaChartBar,
  FaHistory,
  FaCalendar,
  FaStar,
  FaAward,
  FaChartLine,
  FaShieldAlt,
  FaLightbulb,
  FaBookOpen,
  FaHourglassHalf,
  FaChartPie,
  FaFileContract,
  FaUserCheck,
  FaBalanceScale,
  FaSearch,
  FaEdit,
  FaCommentDots,
  FaThumbsUp,
  FaThumbsDown,
  FaEllipsisH,
  FaExternalLinkAlt,
  FaTrophy,
  FaLink,
} from "react-icons/fa";

const ReviewerDashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await reviewService.myAssignments();
      const reviewAssignments = Array.isArray(response.data)
        ? response.data
        : [];
      setAssignments(reviewAssignments);

      const pendingCount = reviewAssignments.filter(
        (a) => a.status === "pending" || a.status === "assigned",
      ).length;
      const completedCount = reviewAssignments.filter(
        (a) => a.status === "completed" || a.status === "approved",
      ).length;
      const rejectedCount = reviewAssignments.filter(
        (a) => a.status === "rejected",
      ).length;

      setStats({
        pending: pendingCount,
        completed: completedCount,
        rejected: rejectedCount,
      });

      const recent = reviewAssignments
        .filter(
          (a) =>
            a.status === "completed" ||
            a.status === "approved" ||
            a.status === "rejected",
        )
        .slice(0, 5);
      setRecentReviews(recent);
    } catch (err) {
      console.error("Error loading assignments:", err);
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = () => {
    loadAssignments();
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
            Loading reviewer dashboard...
          </p>
        </div>
      </Container>
    );
  }

  const pendingAssignments = assignments.filter(
    (a) => a.status === "pending" || a.status === "assigned",
  );
  const completedAssignments = assignments.filter(
    (a) =>
      a.status === "completed" ||
      a.status === "approved" ||
      a.status === "rejected",
  );

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle p-3 me-3"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "white",
            }}
          >
            <FaEye size={30} />
          </div>
          <div>
            <h1 className="fw-bold mb-1">Reviewer Dashboard</h1>
            <p className="text-muted mb-0">
              Welcome back, {user?.name || "Reviewer"}
            </p>
          </div>
        </div>
        <Button
          variant="outline-primary"
          onClick={refreshDashboard}
          className="d-flex align-items-center"
        >
          <FaSync className="me-2" />
          Refresh
        </Button>
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

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={6} lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
              >
                <FaClock size={24} color="#f59e0b" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.pending}</h2>
                <p className="text-muted mb-0">
                  <FaClock size={14} className="me-1" />
                  Pending Reviews
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
              >
                <FaCheckCircle size={24} color="#10b981" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.completed}</h2>
                <p className="text-muted mb-0">
                  <FaCheckCircle size={14} className="me-1" />
                  Completed Reviews
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
              >
                <FaTimesCircle size={24} color="#ef4444" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.rejected}</h2>
                <p className="text-muted mb-0">
                  <FaTimesCircle size={14} className="me-1" />
                  Rejected Articles
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
                <h6 className="fw-bold mb-0">Total Assignments</h6>
              </div>
              <h3 className="fw-bold mb-0">{assignments.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <FaStar className="text-warning me-2" />
                <h6 className="fw-bold mb-0">Avg. Rating</h6>
              </div>
              <h3 className="fw-bold mb-0">4.8</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <FaCalendar className="text-info me-2" />
                <h6 className="fw-bold mb-0">This Week</h6>
              </div>
              <h3 className="fw-bold mb-0">{Math.ceil(stats.pending / 4)}</h3>
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
              <h3 className="fw-bold mb-0">96%</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="g-4">
        {/* Pending Reviews */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <FaClipboardList className="me-2 text-warning" size={20} />
                  <h5 className="fw-bold mb-0">
                    My Assignments ({pendingAssignments.length})
                  </h5>
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="d-flex align-items-center"
                  href="/assignments"
                >
                  View All
                  <FaArrowRight className="ms-2" size={14} />
                </Button>
              </div>

              {pendingAssignments.length === 0 ? (
                <div className="text-center py-5">
                  <FaCheckCircle size={48} className="text-success mb-3" />
                  <h5 className="fw-bold mb-2">No Pending Assignments</h5>
                  <p className="text-muted mb-0">
                    All assignments are reviewed! Great work!{" "}
                    <FaAward className="ms-1" />
                  </p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {pendingAssignments.slice(0, 5).map((assignment) => (
                    <div
                      key={assignment.id}
                      className="list-group-item list-group-item-action border-0 px-0 py-3"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-1">
                            <h6 className="fw-bold mb-0 me-2">
                              {assignment.article?.title || "Untitled Article"}
                            </h6>
                            <Badge
                              bg="warning"
                              className="d-flex align-items-center"
                            >
                              <FaClock size={12} className="me-1" />
                              Pending
                            </Badge>
                          </div>
                          <p className="text-muted small mb-2">
                            <FaUser size={12} className="me-1" />
                            {assignment.article?.author?.name ||
                              "Unknown Author"}
                          </p>
                          <div className="d-flex gap-3">
                            <small className="text-muted">
                              <FaCalendarAlt size={12} className="me-1" />
                              {assignment.created_at
                                ? new Date(
                                    assignment.created_at,
                                  ).toLocaleDateString()
                                : "Unknown date"}
                            </small>
                            {assignment.deadline && (
                              <small className="text-warning">
                                <FaHourglassHalf size={12} className="me-1" />
                                Due:{" "}
                                {new Date(
                                  assignment.deadline,
                                ).toLocaleDateString()}
                              </small>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          href={`/articles/${assignment.article?.id}/review`}
                          className="d-flex align-items-center"
                        >
                          <FaSearch className="me-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activity & Quick Stats */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <FaHistory className="me-2 text-primary" size={20} />
                  <h5 className="fw-bold mb-0">Recent Reviews</h5>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-muted p-0"
                  href="/review-history"
                >
                  <FaEllipsisH />
                </Button>
              </div>

              <div className="list-group list-group-flush">
                {recentReviews.length > 0 ? (
                  recentReviews.map((review, index) => (
                    <div
                      key={review.id || index}
                      className="list-group-item border-0 px-0 py-3"
                    >
                      <div className="d-flex">
                        <div className="me-3 mt-1">
                          {review.status === "completed" ||
                          review.status === "approved" ? (
                            <FaCheckCircle className="text-success" />
                          ) : review.status === "rejected" ? (
                            <FaTimesCircle className="text-danger" />
                          ) : (
                            <FaClipboardCheck className="text-secondary" />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1 small">
                            {review.article?.title?.substring(0, 40) ||
                              "Review"}
                            {review.article?.title?.length > 40 && "..."}
                          </p>
                          <small className="text-muted">
                            <FaClock size={12} className="me-1" />
                            {review.updated_at
                              ? new Date(review.updated_at).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : "Recently"}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted mb-0">No recent reviews</p>
                  </div>
                )}
              </div>

              {/* Review Statistics */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-bold mb-3">
                  <FaChartPie className="me-2 text-info" />
                  Review Statistics
                </h6>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Approval Rate</span>
                  <span className="fw-bold small text-success">85%</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Avg. Review Time</span>
                  <span className="fw-bold small text-primary">2.5 days</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Quality Score</span>
                  <span className="fw-bold small text-warning">4.7/5</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Review History */}
      {completedAssignments.length > 0 && (
        <Card className="shadow-sm border-0 mt-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <FaClipboardCheck className="me-2 text-success" size={20} />
                <h5 className="fw-bold mb-0">
                  Review History ({completedAssignments.length})
                </h5>
              </div>
              <Button
                variant="link"
                size="sm"
                className="text-primary p-0 d-flex align-items-center"
                href="/review-history"
              >
                View All
                <FaArrowRight className="ms-1" size={14} />
              </Button>
            </div>

            <Row className="g-3">
              {completedAssignments.slice(0, 3).map((assignment) => (
                <Col md={4} key={assignment.id}>
                  <Card className="border h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="fw-bold mb-0 flex-grow-1">
                          {assignment.article?.title?.substring(0, 40) ||
                            "Article"}
                          {assignment.article?.title?.length > 40 && "..."}
                        </h6>
                        <Badge
                          bg={
                            assignment.status === "completed" ||
                            assignment.status === "approved"
                              ? "success"
                              : "danger"
                          }
                          className="ms-2"
                        >
                          {assignment.status}
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <FaUser size={12} className="text-muted me-2" />
                          <small className="text-muted">
                            {assignment.article?.author?.name || "Unknown"}
                          </small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <FaCalendarAlt
                            size={12}
                            className="text-muted me-2"
                          />
                          <small className="text-muted">
                            {assignment.updated_at
                              ? new Date(
                                  assignment.updated_at,
                                ).toLocaleDateString()
                              : "Unknown date"}
                          </small>
                        </div>
                      </div>

                      {assignment.comments && (
                        <p className="text-muted small mb-3">
                          <FaCommentDots className="me-1" />
                          {assignment.comments.substring(0, 60)}...
                        </p>
                      )}

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          {assignment.decision === "approve" ? (
                            <FaThumbsUp className="text-success" />
                          ) : assignment.decision === "reject" ? (
                            <FaThumbsDown className="text-danger" />
                          ) : (
                            <FaEdit className="text-warning" />
                          )}
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 d-flex align-items-center"
                          href={`/articles/${assignment.article?.id}`}
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
                    href="/assignments"
                    variant="outline-primary"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <FaClipboardList size={20} className="mb-2" />
                    <span className="small">All Assignments</span>
                  </Button>
                </Col>
                <Col xs={6} md={3} lg={2}>
                  <Button
                    href="/articles"
                    variant="outline-success"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <FaBookOpen size={20} className="mb-2" />
                    <span className="small">View Articles</span>
                  </Button>
                </Col>
                <Col xs={6} md={3} lg={2}>
                  <Button
                    href="/review-history"
                    variant="outline-info"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <FaHistory size={20} className="mb-2" />
                    <span className="small">Review History</span>
                  </Button>
                </Col>
                <Col xs={6} md={3} lg={2}>
                  <Button
                    href="/reports"
                    variant="outline-warning"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <FaChartBar size={20} className="mb-2" />
                    <span className="small">Reports</span>
                  </Button>
                </Col>
                <Col xs={6} md={3} lg={2}>
                  <Button
                    href="/guidelines"
                    variant="outline-secondary"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <FaFileContract size={20} className="mb-2" />
                    <span className="small">Guidelines</span>
                  </Button>
                </Col>
                <Col xs={6} md={3} lg={2}>
                  <Button
                    href="/profile"
                    variant="outline-dark"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <FaUserCheck size={20} className="mb-2" />
                    <span className="small">Profile</span>
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
                Review Guidelines
              </h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <FaCheckCircle className="text-success me-2" />
                  <small>Check for originality</small>
                </li>
                <li className="mb-2">
                  <FaCheckCircle className="text-success me-2" />
                  <small>Verify references</small>
                </li>
                <li className="mb-2">
                  <FaCheckCircle className="text-success me-2" />
                  <small>Assess methodology</small>
                </li>
                <li className="mb-2">
                  <FaCheckCircle className="text-success me-2" />
                  <small>Provide constructive feedback</small>
                </li>
                <li>
                  <FaCheckCircle className="text-success me-2" />
                  <small>Submit within deadline</small>
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
                <h6 className="fw-bold mb-0">Monthly Performance</h6>
                <p className="text-muted small mb-0">
                  <FaStar size={12} className="me-1" />
                  Top 10% Reviewer
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
                  <FaTrophy size={12} className="me-1" />8 awards earned
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
                  <a href="/metrics" className="text-decoration-none">
                    View detailed metrics
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

export default ReviewerDashboard;
