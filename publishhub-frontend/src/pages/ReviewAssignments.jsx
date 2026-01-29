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
  ProgressBar,
} from "react-bootstrap";
import { reviewService } from "../services";
import {
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaUser,
  FaArrowRight,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaCommentDots,
  FaStar,
} from "react-icons/fa";

const ReviewAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    pending: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0,
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await reviewService.myAssignments();
      const allAssignments = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      console.log("My assignments:", allAssignments);

      const assignmentsWithDetails = allAssignments.map((assignment) => ({
        id: assignment.article_id,
        article: assignment.article,
        review: assignment,
        assignmentDate: assignment.assigned_at || assignment.created_at,
        deadline: assignment.review_deadline || null,
        status: assignment.status || "pending",
      }));

      setAssignments(assignmentsWithDetails);

      const pendingCount = assignmentsWithDetails.filter(
        (a) => a.status === "pending",
      ).length;
      const inProgressCount = assignmentsWithDetails.filter(
        (a) => a.status === "in_progress",
      ).length;
      const completedCount = assignmentsWithDetails.filter(
        (a) => a.status === "completed",
      ).length;
      const overdueCount = assignmentsWithDetails.filter((a) => {
        if (!a.deadline) return false;
        const deadlineDate = new Date(a.deadline);
        const today = new Date();
        return deadlineDate < today && a.status !== "completed";
      }).length;

      setStats({
        pending: pendingCount,
        in_progress: inProgressCount,
        completed: completedCount,
        overdue: overdueCount,
      });
    } catch (err) {
      console.error("Error loading assignments:", err);
      setError(err.message || "Failed to load review assignments");
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentStatus = (assignment) => {
    if (assignment.status === "completed")
      return { text: "Completed", color: "success", icon: <FaCheckCircle /> };
    if (assignment.status === "in_progress")
      return { text: "In Progress", color: "info", icon: <FaHourglassHalf /> };

    if (assignment.deadline) {
      const deadlineDate = new Date(assignment.deadline);
      const today = new Date();
      if (deadlineDate < today) {
        return {
          text: "Overdue",
          color: "danger",
          icon: <FaExclamationTriangle />,
        };
      }
    }

    return { text: "Pending", color: "warning", icon: <FaClock /> };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDaysLeft = (deadline) => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading assignments...</span>
          </Spinner>
          <p className="mt-3 text-muted">
            <FaClock className="me-2" />
            Loading your review assignments...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold mb-2" style={{ color: "#2563eb" }}>
            <FaEye className="me-3" />
            My Review Assignments
          </h1>
          <p className="text-muted">
            Articles assigned to you for review and feedback
          </p>
        </div>
        <Button
          variant="outline-primary"
          onClick={loadAssignments}
          className="d-flex align-items-center"
        >
          <FaArrowRight className="me-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <div
                className="rounded-circle p-3 mb-3 d-inline-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  color: "#f59e0b",
                }}
              >
                <FaClock size={24} />
              </div>
              <h2 className="fw-bold mb-2">{stats.pending}</h2>
              <p className="text-muted mb-0">Pending Reviews</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <div
                className="rounded-circle p-3 mb-3 d-inline-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "rgba(37, 99, 235, 0.1)",
                  color: "#2563eb",
                }}
              >
                <FaHourglassHalf size={24} />
              </div>
              <h2 className="fw-bold mb-2">{stats.in_progress}</h2>
              <p className="text-muted mb-0">In Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <div
                className="rounded-circle p-3 mb-3 d-inline-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  color: "#10b981",
                }}
              >
                <FaCheckCircle size={24} />
              </div>
              <h2 className="fw-bold mb-2">{stats.completed}</h2>
              <p className="text-muted mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <div
                className="rounded-circle p-3 mb-3 d-inline-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                }}
              >
                <FaExclamationTriangle size={24} />
              </div>
              <h2 className="fw-bold mb-2">{stats.overdue}</h2>
              <p className="text-muted mb-0">Overdue</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <Card className="shadow-lg border-0" style={{ borderRadius: "14px" }}>
          <Card.Body className="text-center py-5">
            <div
              className="rounded-circle p-4 mb-4 d-inline-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "rgba(37, 99, 235, 0.1)",
                color: "#2563eb",
              }}
            >
              <FaEye size={48} />
            </div>
            <h4 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
              No Articles Assigned for Review
            </h4>
            <p className="text-muted fs-5 mb-4">
              You don't have any articles assigned for review at the moment.
            </p>
            <p className="text-muted">
              Articles will appear here when assigned by an administrator.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold" style={{ color: "#2563eb" }}>
              Assigned Articles ({assignments.length})
            </h3>
          </div>

          <Row className="g-4">
            {assignments.map((assignment) => {
              const status = getAssignmentStatus(assignment);
              const daysLeft = calculateDaysLeft(assignment.deadline);
              const article = assignment.article;

              return (
                <Col md={6} lg={4} key={assignment.id}>
                  <Card
                    className="shadow-lg border-0 h-100"
                    style={{ borderRadius: "14px" }}
                  >
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5
                          className="fw-bold mb-0 flex-grow-1"
                          style={{ color: "#2563eb" }}
                        >
                          {article?.title || "Untitled Article"}
                        </h5>
                        <Badge
                          bg={status.color}
                          className="d-flex align-items-center"
                        >
                          {status.icon}
                          <span className="ms-1">{status.text}</span>
                        </Badge>
                      </div>

                      <div className="mb-3 flex-grow-1">
                        <div className="d-flex align-items-center mb-2">
                          <FaUser
                            size={14}
                            className="text-muted me-2"
                            style={{ flexShrink: 0 }}
                          />
                          <span className="text-muted small">
                            <strong>Author:</strong>{" "}
                            {article?.author?.name || "Unknown"}
                          </span>
                        </div>

                        <div className="d-flex align-items-center mb-2">
                          <FaCalendarAlt
                            size={14}
                            className="text-muted me-2"
                            style={{ flexShrink: 0 }}
                          />
                          <span className="text-muted small">
                            <strong>Assigned:</strong>{" "}
                            {formatDate(assignment.assignmentDate)}
                          </span>
                        </div>

                        {assignment.deadline && (
                          <div className="d-flex align-items-center mb-3">
                            <FaClock
                              size={14}
                              className={
                                daysLeft && daysLeft < 3
                                  ? "text-danger me-2"
                                  : "text-muted me-2"
                              }
                              style={{ flexShrink: 0 }}
                            />
                            <span
                              className="small"
                              style={
                                daysLeft && daysLeft < 3
                                  ? { color: "#ef4444" }
                                  : { color: "#6b7280" }
                              }
                            >
                              <strong>Deadline:</strong>{" "}
                              {formatDate(assignment.deadline)}
                              {daysLeft !== null && (
                                <span className="ms-2">
                                  (
                                  {daysLeft > 0
                                    ? `${daysLeft} days left`
                                    : `Overdue by ${Math.abs(daysLeft)} days`}
                                  )
                                </span>
                              )}
                            </span>
                          </div>
                        )}

                        {assignment.review?.comments && (
                          <div className="d-flex align-items-center mb-2">
                            <FaCommentDots
                              size={14}
                              className="text-muted me-2"
                              style={{ flexShrink: 0 }}
                            />
                            <span className="text-muted small">
                              <strong>Comments:</strong>{" "}
                              {assignment.review.comments.length || 0}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress Indicator */}
                      {assignment.status === "in_progress" && (
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="small text-muted">
                              Review Progress
                            </span>
                            <span className="small text-muted">60%</span>
                          </div>
                          <ProgressBar
                            now={60}
                            variant="info"
                            style={{ height: "6px", borderRadius: "3px" }}
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-auto">
                        <div className="d-grid gap-2">
                          <Button
                            href={`/articles/${assignment.id}/review`}
                            style={{
                              background:
                                "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                              border: "none",
                              borderRadius: "10px",
                              fontWeight: "600",
                              padding: "10px",
                            }}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <FaEye className="me-2" />
                            {assignment.status === "pending"
                              ? "Start Review"
                              : "Continue Review"}
                          </Button>

                          <Button
                            variant="outline-primary"
                            href={`/articles/${assignment.id}`}
                            style={{
                              borderRadius: "10px",
                              fontWeight: "600",
                              padding: "10px",
                            }}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <FaArrowRight className="me-2" />
                            View Article Details
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}

      {/* Quick Stats */}
      {assignments.length > 0 && (
        <Card className="shadow-sm border-0 mt-5">
          <Card.Body>
            <h5 className="fw-bold mb-4" style={{ color: "#2563eb" }}>
              📊 Review Performance
            </h5>
            <Row className="text-center">
              <Col md={3}>
                <div className="p-3">
                  <h3 className="fw-bold mb-2">4.7</h3>
                  <p className="text-muted mb-0">Avg. Rating</p>
                </div>
              </Col>
              <Col md={3}>
                <div className="p-3">
                  <h3 className="fw-bold mb-2">2.5</h3>
                  <p className="text-muted mb-0">Avg. Days/Review</p>
                </div>
              </Col>
              <Col md={3}>
                <div className="p-3">
                  <h3 className="fw-bold mb-2">94%</h3>
                  <p className="text-muted mb-0">On-Time Completion</p>
                </div>
              </Col>
              <Col md={3}>
                <div className="p-3">
                  <h3 className="fw-bold mb-2">8</h3>
                  <p className="text-muted mb-0">Completed This Month</p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ReviewAssignments;
