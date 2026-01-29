import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const dashboardLinks = {
    admin: [
      {
        label: "All Articles",
        path: "/articles",
        icon: "bi-file-text",
        color: "primary",
      },
      {
        label: "Pending Approval",
        path: "/pending-approval",
        icon: "bi-hourglass-split",
        color: "warning",
      },
      { label: "All Users", path: "/users", icon: "bi-people", color: "info" },
      {
        label: "Revisions",
        path: "/revisions",
        icon: "bi-arrow-repeat",
        color: "secondary",
      },
    ],
    author: [
      {
        label: "My Articles",
        path: "/articles",
        icon: "bi-file-text",
        color: "primary",
      },
      {
        label: "Create Article",
        path: "/articles/create",
        icon: "bi-plus-circle",
        color: "success",
      },
      {
        label: "My Revisions",
        path: "/revisions/my",
        icon: "bi-arrow-repeat",
        color: "warning",
      },
      {
        label: "My Reviews",
        path: "/reviews/my",
        icon: "bi-chat-quote",
        color: "info",
      },
    ],
    reviewer: [
      {
        label: "My Assignments",
        path: "/assignments",
        icon: "bi-inbox",
        color: "primary",
      },
      {
        label: "My Reviews",
        path: "/reviews",
        icon: "bi-chat-quote",
        color: "info",
      },
    ],
  };

  const links = dashboardLinks[user?.role] || [];

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="fw-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-muted">
            You are logged in as{" "}
            <span className={`badge role-${user?.role}`}>{user?.role}</span>
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        {links.map((link) => (
          <Col md={6} lg={3} key={link.path}>
            <Card
              className="h-100 shadow-sm border-0 article-card"
              onClick={() => navigate(link.path)}
            >
              <Card.Body
                className="d-flex flex-column align-items-center justify-content-center text-center"
                style={{ minHeight: "150px" }}
              >
                <i
                  className={`bi ${link.icon} text-${link.color}`}
                  style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
                ></i>
                <Card.Title className="mb-0">{link.label}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
