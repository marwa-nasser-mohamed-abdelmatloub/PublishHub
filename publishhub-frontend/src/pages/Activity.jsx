import { useEffect, useState } from "react";
import {
  Container,
  Card,
  ListGroup,
  Spinner,
  Alert,
  Badge,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { apiService } from "../services";
import {
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaUsers,
  FaUserCheck,
  FaClock,
  FaHistory,
  FaSyncAlt,
  FaArrowRight,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";

const Activity = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await apiService.get("/activity");

        const responseData = res.data?.data || res.data;

        const activities =
          responseData?.activities ||
          responseData?.data?.activities ||
          responseData ||
          [];

        setItems(Array.isArray(activities) ? activities : []);
      } catch (err) {
        setError(err?.message || "Failed to load activity");
        console.error("Error loading activity:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getActivityIcon = (type) => {
    const iconMap = {
      article_submitted: {
        icon: <FaFileAlt />,
        color: "#2563eb",
        bg: "#dbeafe",
      },
      article_approved: {
        icon: <FaCheckCircle />,
        color: "#10b981",
        bg: "#d1fae5",
      },
      article_rejected: {
        icon: <FaTimesCircle />,
        color: "#ef4444",
        bg: "#fee2e2",
      },
      article_reviewed: { icon: <FaEye />, color: "#f59e0b", bg: "#fef3c7" },
      user_registered: { icon: <FaUsers />, color: "#8b5cf6", bg: "#ede9fe" },
      user_updated: { icon: <FaUserCheck />, color: "#06b6d4", bg: "#cffafe" },
      default: { icon: <FaHistory />, color: "#6b7280", bg: "#f3f4f6" },
    };

    return iconMap[type] || iconMap.default;
  };

  const getActivityTypeLabel = (type) => {
    const typeMap = {
      article_submitted: "Article Submitted",
      article_approved: "Article Approved",
      article_rejected: "Article Rejected",
      article_reviewed: "Article Reviewed",
      user_registered: "User Registered",
      user_updated: "User Updated",
    };

    return typeMap[type] || "Activity";
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("/activity");
      const responseData = res.data?.data || res.data;
      const activities = responseData?.activities || responseData || [];
      setItems(Array.isArray(activities) ? activities : []);
    } catch (err) {
      setError(err?.message || "Failed to refresh activity");
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
          <p className="mt-3 text-muted">
            <FaClock className="me-2" />
            Loading activity...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
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
            <FaHistory size={24} />
          </div>
          <div>
            <h1 className="fw-bold mb-1">Activity Log</h1>
            <p className="text-muted mb-0">
              Track all system activities and events
            </p>
          </div>
        </div>
        <Button
          variant="outline-primary"
          onClick={refreshData}
          className="d-flex align-items-center"
        >
          <FaSyncAlt className="me-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert
          variant="danger"
          onClose={() => setError("")}
          dismissible
          className="mb-4"
        >
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <h2 className="fw-bold mb-2" style={{ color: "#2563eb" }}>
                {items.length}
              </h2>
              <p className="text-muted mb-0">Total Activities</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <h2 className="fw-bold mb-2" style={{ color: "#10b981" }}>
                {items.filter((item) => item.type?.includes("article")).length}
              </h2>
              <p className="text-muted mb-0">Article Activities</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <h2 className="fw-bold mb-2" style={{ color: "#8b5cf6" }}>
                {items.filter((item) => item.type?.includes("user")).length}
              </h2>
              <p className="text-muted mb-0">User Activities</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <h2 className="fw-bold mb-2" style={{ color: "#f59e0b" }}>
                {items.filter((item) => item.type?.includes("approved")).length}
              </h2>
              <p className="text-muted mb-0">Approvals</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Activity List */}
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-white border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">
              <FaHistory className="me-2" />
              Recent Activities
            </h5>
            <Badge bg="primary" pill>
              {items.length} items
            </Badge>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {items.length === 0 ? (
            <div className="text-center py-5">
              <FaHistory size={48} className="text-muted mb-3" />
              <h5 className="fw-bold mb-2">No activities found</h5>
              <p className="text-muted mb-0">
                There are no recent activities to display
              </p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {items.map((item, idx) => {
                const { icon, color, bg } = getActivityIcon(item.type);
                const typeLabel = getActivityTypeLabel(item.type);

                return (
                  <ListGroup.Item
                    key={item.id || idx}
                    className="border-0 py-3 px-4 hover-light"
                    style={{
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    <div className="d-flex align-items-start">
                      {/* Icon */}
                      <div
                        className="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: bg,
                          color: color,
                          width: "40px",
                          height: "40px",
                        }}
                      >
                        {icon}
                      </div>

                      {/* Content */}
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <div>
                            <h6 className="fw-bold mb-0">
                              {item.description || "Activity"}
                            </h6>
                            <Badge
                              bg="light"
                              text="dark"
                              className="mt-1"
                              style={{
                                backgroundColor: bg,
                                color: color,
                                fontWeight: "600",
                              }}
                            >
                              {typeLabel}
                            </Badge>
                          </div>
                          <small className="text-muted">
                            <FaClock size={12} className="me-1" />
                            {item.timestamp
                              ? new Date(item.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : "Just now"}
                          </small>
                        </div>

                        {/* Metadata */}
                        <div className="d-flex gap-3 mt-2">
                          <small className="text-muted">
                            <FaCalendarAlt size={12} className="me-1" />
                            {item.timestamp
                              ? new Date(item.timestamp).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  },
                                )
                              : "Unknown date"}
                          </small>

                          {item.user && (
                            <small className="text-muted">
                              <FaUser size={12} className="me-1" />
                              {item.user.name || "Unknown user"}
                            </small>
                          )}

                          {item.model && (
                            <small className="text-muted">
                              <FaFileAlt size={12} className="me-1" />
                              {item.model}: {item.model_id}
                            </small>
                          )}
                        </div>

                        {/* Action Button */}
                        {item.model && item.model_id && (
                          <div className="mt-3">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              href={`/${item.model}/${item.model_id}`}
                              className="d-inline-flex align-items-center"
                            >
                              View Details
                              <FaArrowRight className="ms-1" size={12} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </Card.Body>

        {/* Footer */}
        {items.length > 0 && (
          <Card.Footer className="bg-white border-0 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Showing {items.length} activities
              </small>
              <Button
                variant="link"
                size="sm"
                className="text-primary p-0 d-flex align-items-center"
                href="/admin/dashboard"
              >
                Back to Dashboard
                <FaArrowRight className="ms-1" size={12} />
              </Button>
            </div>
          </Card.Footer>
        )}
      </Card>
    </Container>
  );
};

export default Activity;
