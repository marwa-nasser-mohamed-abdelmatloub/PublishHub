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
import { apiService } from "../services";
import {
  FaSyncAlt,
  FaEdit,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFileAlt,
  FaExclamationTriangle,
  FaArrowRight,
  FaHourglassHalf,
  FaComments,
} from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";

const MyRevisions = () => {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRevisions();
  }, []);

  const loadRevisions = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/my-revision-requests");
      setRevisions(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to load revisions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <div
          className="bg-primary p-3 rounded-circle me-3"
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          }}
        >
          <FaSyncAlt size={30} color="white" />
        </div>
        <div>
          <h1 className="fw-bold mb-1" style={{ color: "#2563eb" }}>
            My Revision Requests
          </h1>
          <p className="text-muted mb-0">
            Track and manage your article revision requests
          </p>
        </div>
      </div>

      {error && (
        <Alert
          variant="danger"
          onClose={() => setError("")}
          dismissible
          className="d-flex align-items-center gap-2"
          style={{ borderRadius: "10px" }}
        >
          <FaExclamationTriangle />
          <span>{error}</span>
        </Alert>
      )}

      {/* Stats Overview */}
      {revisions.length > 0 && (
        <Row className="g-3 mb-4">
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body className="d-flex align-items-center p-3">
                <FaHourglassHalf size={24} className="text-warning me-3" />
                <div>
                  <h6 className="mb-0">Pending</h6>
                  <p className="fw-bold mb-0">
                    {revisions.filter((r) => r.status === "pending").length}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body className="d-flex align-items-center p-3">
                <FaCheckCircle size={24} className="text-success me-3" />
                <div>
                  <h6 className="mb-0">Approved</h6>
                  <p className="fw-bold mb-0">
                    {revisions.filter((r) => r.status === "approved").length}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body className="d-flex align-items-center p-3">
                <FaTimesCircle size={24} className="text-danger me-3" />
                <div>
                  <h6 className="mb-0">Rejected</h6>
                  <p className="fw-bold mb-0">
                    {revisions.filter((r) => r.status === "rejected").length}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {revisions.length === 0 ? (
        <Card
          className="shadow-lg border-0 text-center"
          style={{
            borderRadius: "14px",
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          }}
        >
          <Card.Body className="py-5">
            <div className="mb-4">
              <div className="bg-light p-4 rounded-circle d-inline-block">
                <FaFileAlt size={50} className="text-muted" />
              </div>
            </div>
            <h5 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
              No Revision Requests
            </h5>
            <p className="text-muted mb-4">
              You haven't submitted any revision requests yet.
              <br />
              When an article needs revision, you'll see it here.
            </p>
            <Button
              href="/author/dashboard"
              variant="outline-primary"
              className="d-flex align-items-center gap-2 mx-auto"
              style={{
                borderRadius: "10px",
                fontWeight: "600",
              }}
            >
              <FaArrowRight />
              Back to Dashboard
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {revisions.map((revision) => (
            <Col md={6} key={revision.id}>
              <Card
                className="shadow-lg border-0 h-100 hover-shadow"
                style={{
                  borderRadius: "14px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(0,0,0,0.1)";
                }}
              >
                <Card.Body className="p-4">
                  {/* Header with Status */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-light p-2 rounded-circle me-3">
                        <HiDocumentText size={20} className="text-primary" />
                      </div>
                      <div>
                        <h5
                          className="fw-bold mb-0"
                          style={{ color: "#2563eb" }}
                        >
                          {revision.article?.title || "Untitled Article"}
                        </h5>
                        <p className="text-muted small mb-0">
                          Request #{revision.id}
                        </p>
                      </div>
                    </div>
                    <Badge
                      bg={getStatusBadge(revision.status)}
                      className="d-flex align-items-center gap-1 px-3 py-2"
                    >
                      {getStatusIcon(revision.status)}
                      {revision.status}
                    </Badge>
                  </div>

                  {/* Revision Details */}
                  <div className="mb-4">
                    <div className="d-flex align-items-start mb-3">
                      <FaComments
                        className="text-primary mt-1 me-2"
                        size={16}
                      />
                      <div>
                        <h6
                          className="fw-bold mb-1"
                          style={{ color: "#4b5563" }}
                        >
                          Revision Reason
                        </h6>
                        <p className="text-dark small mb-0">
                          {revision.reason}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-2">
                      <FaClock className="text-muted me-2" size={14} />
                      <span className="text-muted small">
                        <strong>Requested:</strong>{" "}
                        {new Date(revision.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>

                    {revision.updated_at &&
                      revision.updated_at !== revision.created_at && (
                        <div className="d-flex align-items-center mb-2">
                          <FaSyncAlt className="text-muted me-2" size={14} />
                          <span className="text-muted small">
                            <strong>Last Updated:</strong>{" "}
                            {new Date(revision.updated_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Action Buttons */}
                  <div className="d-grid gap-2">
                    {revision.status === "approved" && (
                      <Button
                        href={`/articles/${revision.article?.id}`}
                        className="d-flex align-items-center justify-content-center gap-2"
                        style={{
                          background:
                            "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          border: "none",
                          borderRadius: "10px",
                          fontWeight: "600",
                          padding: "0.75rem",
                        }}
                      >
                        <FaEdit />
                        Edit Article
                      </Button>
                    )}

                    {revision.status === "pending" && (
                      <Button
                        disabled
                        variant="light"
                        className="d-flex align-items-center justify-content-center gap-2"
                        style={{
                          borderRadius: "10px",
                          fontWeight: "600",
                          padding: "0.75rem",
                          color: "#f59e0b",
                        }}
                      >
                        <FaHourglassHalf />
                        Waiting for Approval
                      </Button>
                    )}

                    {revision.status === "rejected" && (
                      <div>
                        <Button
                          variant="light"
                          disabled
                          className="d-flex align-items-center justify-content-center gap-2 mb-2"
                          style={{
                            borderRadius: "10px",
                            fontWeight: "600",
                            padding: "0.75rem",
                            color: "#dc3545",
                          }}
                        >
                          <FaTimesCircle />
                          Revision Rejected
                        </Button>
                        <Button
                          href={`/articles/${revision.article?.id}`}
                          variant="outline-primary"
                          className="d-flex align-items-center justify-content-center gap-2"
                          style={{
                            borderRadius: "10px",
                            fontWeight: "600",
                            padding: "0.75rem",
                          }}
                        >
                          <FaFileAlt />
                          View Article Details
                        </Button>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

// Helper functions
const getStatusBadge = (status) => {
  const statusMap = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };
  return statusMap[status] || "secondary";
};

const getStatusIcon = (status) => {
  const iconMap = {
    pending: <FaClock size={12} />,
    approved: <FaCheckCircle size={12} />,
    rejected: <FaTimesCircle size={12} />,
  };
  return iconMap[status] || <FaSyncAlt size={12} />;
};

export default MyRevisions;
