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
  Form,
} from "react-bootstrap";
import { apiService } from "../services";
import {
  FaHistory,
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaUser,
  FaCalendarAlt,
  FaFilter,
  FaEye,
  FaClipboardList,
  FaExclamationTriangle,
  FaListAlt,
  FaCheckDouble,
} from "react-icons/fa";

const Revisions = () => {
  const [revisions, setRevisions] = useState([]);
  const [filteredRevisions, setFilteredRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadRevisions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.get("/revision-requests");
      setRevisions(response.data || []);
    } catch (err) {
      console.error("Error loading revisions:", err);
      setError(err.message || "Failed to load revisions");
      setRevisions([]);
    } finally {
      setLoading(false);
    }
  };

  const filterRevisions = useCallback(() => {
    if (statusFilter === "all") {
      setFilteredRevisions(revisions);
    } else {
      setFilteredRevisions(revisions.filter((r) => r.status === statusFilter));
    }
  }, [revisions, statusFilter]);

  useEffect(() => {
    loadRevisions();
  }, []);

  useEffect(() => {
    filterRevisions();
  }, [filterRevisions]);

  const getStats = () => {
    return {
      total: revisions.length,
      pending: revisions.filter((r) => r.status === "pending").length,
      approved: revisions.filter((r) => r.status === "approved").length,
      completed: revisions.filter((r) => r.status === "completed").length,
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          {error ? (
            <Alert variant="danger" className="mb-4">
              <FaExclamationTriangle className="me-2" /> {error}
            </Alert>
          ) : null}
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading revision requests...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5">
      <h1
        className="fw-bold mb-5 d-flex align-items-center"
        style={{ color: "#2563eb" }}
      >
        <FaHistory className="me-3" size={36} /> Revision Requests
      </h1>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          <FaExclamationTriangle className="me-2" /> {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col md={6} lg={3}>
          <Card
            className="shadow-lg border-0 text-center"
            style={{
              borderRadius: "14px",
              background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
              color: "white",
            }}
          >
            <Card.Body>
              <h3 className="fw-bold mb-2">{stats.total}</h3>
              <p className="mb-0 d-flex align-items-center justify-content-center">
                <FaFileAlt className="me-2" /> Total Revisions
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="shadow-lg border-0 text-center"
            style={{
              borderRadius: "14px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "white",
            }}
          >
            <Card.Body>
              <h3 className="fw-bold mb-2">{stats.pending}</h3>
              <p className="mb-0 d-flex align-items-center justify-content-center">
                <FaClock className="me-2" /> Pending
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="shadow-lg border-0 text-center"
            style={{
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
              color: "white",
            }}
          >
            <Card.Body>
              <h3 className="fw-bold mb-2">{stats.approved}</h3>
              <p className="mb-0 d-flex align-items-center justify-content-center">
                <FaCheckCircle className="me-2" /> Approved
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="shadow-lg border-0 text-center"
            style={{
              borderRadius: "14px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
            }}
          >
            <Card.Body>
              <h3 className="fw-bold mb-2">{stats.completed}</h3>
              <p className="mb-0 d-flex align-items-center justify-content-center">
                <FaCheckDouble className="me-2" /> Completed
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filter */}
      <Card
        className="shadow-lg border-0 mb-4"
        style={{ borderRadius: "14px" }}
      >
        <Card.Body className="p-4">
          <Form.Group>
            <Form.Label className="fw-bold mb-3 d-flex align-items-center">
              <FaFilter className="me-2" /> Filter by Status
            </Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                borderRadius: "10px",
                borderColor: "#2563eb",
                padding: "12px",
                fontSize: "1rem",
              }}
            >
              <option value="all">All Revisions</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Revisions List */}
      {filteredRevisions.length === 0 ? (
        <Card className="shadow-lg border-0" style={{ borderRadius: "14px" }}>
          <Card.Body className="text-center py-5">
            <p className="text-muted fs-5 d-flex align-items-center justify-content-center">
              <FaListAlt className="me-2" /> No revisions found
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {filteredRevisions.map((revision) => (
            <Col md={6} key={revision.id}>
              <Card
                className="shadow-lg border-0 h-100"
                style={{ borderRadius: "14px" }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                      <h5
                        className="fw-bold d-flex align-items-center"
                        style={{ color: "#2563eb" }}
                      >
                        <FaFileAlt className="me-2" size={16} />{" "}
                        {revision.article?.title}
                      </h5>
                      <p className="text-muted small mb-0 d-flex align-items-center">
                        <FaUser className="me-2" size={12} />
                        <strong>Author:</strong> {revision.author?.name}
                      </p>
                    </div>
                    <Badge
                      bg={getStatusColor(revision.status)}
                      className="d-flex align-items-center"
                    >
                      {getStatusIcon(revision.status)} {revision.status}
                    </Badge>
                  </div>

                  <p className="text-muted small mb-2">
                    <strong>Reason:</strong>{" "}
                    {revision.reason || "No reason provided"}
                  </p>

                  <p className="text-muted small mb-2 d-flex align-items-center">
                    <FaCalendarAlt className="me-2" size={12} />
                    <strong>Requested:</strong>{" "}
                    {new Date(revision.created_at).toLocaleDateString()}
                  </p>

                  <div
                    className="mt-3 p-3 bg-light rounded"
                    style={{ borderRadius: "8px" }}
                  >
                    <small className="d-block mb-2 d-flex align-items-center">
                      <FaClipboardList className="me-2" />
                      <strong>Feedback/Changes Required:</strong>
                    </small>
                    <small className="text-muted">
                      {revision.feedback ||
                        revision.changes_required ||
                        "No feedback yet"}
                    </small>
                  </div>

                  <Button
                    href={`/articles/${revision.article?.id}`}
                    className="w-100 mt-3 d-flex align-items-center justify-content-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "600",
                      padding: "10px 16px",
                    }}
                  >
                    <FaEye className="me-2" /> View Article
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

const getStatusColor = (status) => {
  const statusMap = {
    pending: "warning",
    approved: "info",
    completed: "success",
    rejected: "danger",
  };
  return statusMap[status] || "secondary";
};

const getStatusIcon = (status) => {
  const iconMap = {
    pending: <FaClock size={12} className="me-1" />,
    approved: <FaCheckCircle size={12} className="me-1" />,
    completed: <FaCheckDouble size={12} className="me-1" />,
    rejected: <FaExclamationTriangle size={12} className="me-1" />,
  };
  return iconMap[status] || <FaFileAlt size={12} className="me-1" />;
};

export default Revisions;
