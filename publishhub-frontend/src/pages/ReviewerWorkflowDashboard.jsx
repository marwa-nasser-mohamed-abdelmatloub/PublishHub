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
  ProgressBar,
} from "react-bootstrap";
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaFileAlt,
  FaUser,
  FaCalendar,
  FaChartBar,
  FaClipboardCheck,
  FaComments,
  FaArrowRight,
  FaStar,
  FaSync,
  FaEdit,
} from "react-icons/fa";

const ReviewerWorkflowDashboard = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [reviewDecision, setReviewDecision] = useState("");
  const [feedback, setFeedback] = useState("");
  const [activeTab, setActiveTab] = useState("assigned");

  const tabs = [
    {
      id: "assigned",
      label: "Assigned Articles",
      status: "assigned",
      icon: <FaFileAlt />,
      color: "warning",
    },
    {
      id: "completed",
      label: "Completed Reviews",
      status: "completed",
      icon: <FaCheck />,
      color: "success",
    },
    {
      id: "my-reviews",
      label: "My Reviews",
      icon: <FaClipboardCheck />,
      color: "info",
    },
  ];

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get("/review-assignments");
        setAssignments(response.data.data || response.data);
      } catch (fetchError) {
        console.error("Failed to fetch assignments:", fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleSubmitReview = async (assignmentId, articleId) => {
    if (!reviewDecision) {
      alert("Please select accept or reject");
      return;
    }

    try {
      await api.post(`/articles/${articleId}/workflow/submit-review`, {
        assignment_id: assignmentId,
        decision: reviewDecision,
        feedback: feedback,
      });

      setAssignments(
        assignments.map((assignment) =>
          assignment.id === assignmentId
            ? { ...assignment, status: "completed", decision: reviewDecision }
            : assignment,
        ),
      );

      setSelectedAssignment(null);
      setReviewDecision("");
      setFeedback("");
      alert("Review submitted successfully!");
    } catch (submitError) {
      console.error("Failed to submit review:", submitError);
      alert("Failed to submit review");
    }
  };

  const assignedCount = assignments.filter(
    (a) => a.status === "assigned",
  ).length;
  const completedCount = assignments.filter(
    (a) => a.status === "completed",
  ).length;
  const totalCount = assignments.length;

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
        <span className="ms-3">Loading assignments...</span>
      </Container>
    );
  }

  const filteredAssignments =
    activeTab === "my-reviews"
      ? assignments
      : assignments.filter(
          (assignment) =>
            assignment.status ===
            (tabs.find((tab) => tab.id === activeTab)?.status || "assigned"),
        );

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold text-primary">
            <FaClipboardCheck className="me-3" />
            Reviewer Dashboard
          </h1>
          <p className="text-muted">
            Review assigned articles and provide feedback
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
        <Col xs={6} md={4} lg={3}>
          <Card className="shadow-sm border-0 bg-warning bg-opacity-10">
            <Card.Body className="text-center">
              <div className="text-warning mb-2" style={{ fontSize: "2rem" }}>
                <FaFileAlt />
              </div>
              <h3 className="fw-bold">{assignedCount}</h3>
              <p className="text-muted mb-0">Assigned</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg={3}>
          <Card className="shadow-sm border-0 bg-success bg-opacity-10">
            <Card.Body className="text-center">
              <div className="text-success mb-2" style={{ fontSize: "2rem" }}>
                <FaCheck />
              </div>
              <h3 className="fw-bold">{completedCount}</h3>
              <p className="text-muted mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg={3}>
          <Card className="shadow-sm border-0 bg-info bg-opacity-10">
            <Card.Body className="text-center">
              <div className="text-info mb-2" style={{ fontSize: "2rem" }}>
                <FaChartBar />
              </div>
              <h3 className="fw-bold">{totalCount}</h3>
              <p className="text-muted mb-0">Total</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg={3}>
          <Card className="shadow-sm border-0 bg-primary bg-opacity-10">
            <Card.Body className="text-center">
              <div className="text-primary mb-2" style={{ fontSize: "2rem" }}>
                <FaStar />
              </div>
              <h3 className="fw-bold">
                {totalCount > 0
                  ? Math.round((completedCount / totalCount) * 100)
                  : 0}
                %
              </h3>
              <p className="text-muted mb-0">Completion</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Review Progress</span>
              <span className="fw-bold">
                {completedCount}/{totalCount} (
                {Math.round((completedCount / totalCount) * 100)}%)
              </span>
            </div>
            <ProgressBar
              now={(completedCount / totalCount) * 100}
              variant="success"
              style={{ height: "8px" }}
            />
          </Card.Body>
        </Card>
      )}

      {/* Main Content */}
      <Card className="shadow-lg border-0">
        <Card.Body>
          {/* Tabs */}
          <Nav variant="tabs" className="mb-4">
            {tabs.map((tab) => {
              const count =
                tab.id === "my-reviews"
                  ? assignments.length
                  : assignments.filter((a) => a.status === tab.status).length;

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
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-5">
              <div
                className={`text-${tabs.find((t) => t.id === activeTab)?.color || "secondary"}`}
                style={{ fontSize: "4rem" }}
              >
                {tabs.find((t) => t.id === activeTab)?.icon || <FaFileAlt />}
              </div>
              <h4 className="text-muted mt-3">No articles found</h4>
              <p className="text-muted">
                {activeTab === "assigned"
                  ? "No articles assigned for review"
                  : activeTab === "completed"
                    ? "No completed reviews yet"
                    : "No review history available"}
              </p>
            </div>
          ) : (
            <Row className="g-4">
              {filteredAssignments.map((assignment) => (
                <Col key={assignment.id} lg={6}>
                  <Card
                    className={`border-0 shadow-sm h-100 ${
                      assignment.status === "completed"
                        ? "border-success border-2"
                        : ""
                    }`}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5
                            className="fw-bold text-truncate"
                            style={{ maxWidth: "300px" }}
                          >
                            {assignment.article?.title || "Untitled Article"}
                          </h5>
                          <div className="d-flex gap-3 text-muted small">
                            <span>
                              <FaUser className="me-1" />
                              {assignment.article?.author?.name ||
                                "Unknown Author"}
                            </span>
                            <span>
                              <FaCalendar className="me-1" />
                              Assigned: {formatDate(assignment.assigned_at)}
                            </span>
                          </div>
                        </div>
                        <Badge
                          bg={
                            assignment.status === "completed"
                              ? "success"
                              : "warning"
                          }
                        >
                          {assignment.status === "completed"
                            ? "Completed"
                            : "Assigned"}
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
                          {assignment.article?.content?.substring(0, 150) ||
                            "No content available"}
                          ...
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/articles/${assignment.article_id}/review`,
                            )
                          }
                        >
                          <FaEye className="me-1" />
                          Review Article
                        </Button>

                        {assignment.status === "assigned" && (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() =>
                              setSelectedAssignment(
                                selectedAssignment === assignment.id
                                  ? null
                                  : assignment.id,
                              )
                            }
                          >
                            <FaEdit className="me-1" />
                            {selectedAssignment === assignment.id
                              ? "Cancel"
                              : "Submit Review"}
                          </Button>
                        )}

                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() =>
                            navigate(`/articles/${assignment.article_id}`)
                          }
                        >
                          <FaArrowRight className="me-1" />
                          View Details
                        </Button>
                      </div>

                      {/* Show decision if completed */}
                      {assignment.status === "completed" &&
                        assignment.decision && (
                          <div
                            className="mt-3 p-3 rounded"
                            style={{
                              backgroundColor:
                                assignment.decision === "accepted"
                                  ? "rgba(40, 167, 69, 0.1)"
                                  : "rgba(220, 53, 69, 0.1)",
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <div
                                className={`me-3 p-2 rounded-circle ${
                                  assignment.decision === "accepted"
                                    ? "bg-success text-white"
                                    : "bg-danger text-white"
                                }`}
                              >
                                {assignment.decision === "accepted" ? (
                                  <FaCheck />
                                ) : (
                                  <FaTimes />
                                )}
                              </div>
                              <div>
                                <h6 className="mb-0 fw-bold">
                                  Your Decision:{" "}
                                  <span
                                    className={
                                      assignment.decision === "accepted"
                                        ? "text-success"
                                        : "text-danger"
                                    }
                                  >
                                    {assignment.decision.toUpperCase()}
                                  </span>
                                </h6>
                                <small className="text-muted">
                                  Submitted on{" "}
                                  {formatDate(
                                    assignment.completed_at ||
                                      assignment.updated_at,
                                  )}
                                </small>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Review Submission Form */}
                      {selectedAssignment === assignment.id && (
                        <Card className="mt-3 border-warning">
                          <Card.Body>
                            <h6 className="text-warning mb-3">
                              <FaComments className="me-2" />
                              Submit Your Review
                            </h6>

                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold">
                                Decision
                              </Form.Label>
                              <div className="d-flex gap-3">
                                <Form.Check
                                  type="radio"
                                  id={`accept-${assignment.id}`}
                                  label={
                                    <span className="text-success fw-bold">
                                      <FaCheck className="me-1" /> Accept
                                    </span>
                                  }
                                  name={`decision-${assignment.id}`}
                                  value="accepted"
                                  checked={reviewDecision === "accepted"}
                                  onChange={(e) =>
                                    setReviewDecision(e.target.value)
                                  }
                                />
                                <Form.Check
                                  type="radio"
                                  id={`reject-${assignment.id}`}
                                  label={
                                    <span className="text-danger fw-bold">
                                      <FaTimes className="me-1" /> Reject
                                    </span>
                                  }
                                  name={`decision-${assignment.id}`}
                                  value="rejected"
                                  checked={reviewDecision === "rejected"}
                                  onChange={(e) =>
                                    setReviewDecision(e.target.value)
                                  }
                                />
                              </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold">
                                <FaComments className="me-1" /> Feedback
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={4}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Provide constructive feedback for the author..."
                              />
                              <Form.Text className="text-muted">
                                Your feedback will help improve the article
                                quality.
                              </Form.Text>
                            </Form.Group>

                            <div className="d-flex gap-2">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() =>
                                  handleSubmitReview(
                                    assignment.id,
                                    assignment.article_id,
                                  )
                                }
                                disabled={!reviewDecision}
                              >
                                <FaCheck className="me-1" />
                                Submit Review
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                  setSelectedAssignment(null);
                                  setReviewDecision("");
                                  setFeedback("");
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

export default ReviewerWorkflowDashboard;
