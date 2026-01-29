import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Navbar, Nav, Container, Spinner } from "react-bootstrap";
import {
  FaBook,
  FaUserFriends,
  FaHistory,
  FaFileAlt,
  FaClipboardCheck,
  FaCog,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaUser,
  FaBookOpen,
} from "react-icons/fa";

const LoadingSpinner = () => (
  <div
    className="d-flex align-items-center justify-content-center"
    style={{ height: "100vh" }}
  >
    <Spinner animation="border" role="status" className="loading-spinner">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderNavLinks = () => {
    if (!isAuthenticated) {
      return (
        <div className="d-flex gap-2">
          <Link
            to="/login"
            className="btn btn-outline-primary btn-sm d-flex align-items-center"
          >
            <FaSignInAlt className="me-1" /> Login
          </Link>
          <Link
            to="/register"
            className="btn btn-primary btn-sm d-flex align-items-center"
          >
            <FaUserPlus className="me-1" /> Register
          </Link>
        </div>
      );
    }

    return (
      <>
        <Link to="/articles" className="nav-link d-flex align-items-center">
          <FaFileAlt className="me-1" /> Articles
        </Link>

        {user?.role === "admin" && (
          <>
            <Link
              to="/admin/dashboard"
              className="nav-link d-flex align-items-center"
            >
              <FaCog className="me-1" /> Dashboard
            </Link>
            <Link
              to="/admin/workflow"
              className="nav-link d-flex align-items-center"
            >
              <FaClipboardCheck className="me-1" /> Workflow
            </Link>
            <Link
              to="/manage-users"
              className="nav-link d-flex align-items-center"
            >
              <FaUserFriends className="me-1" /> Users
            </Link>
            <Link
              to="/revisions"
              className="nav-link d-flex align-items-center"
            >
              <FaHistory className="me-1" /> Revisions
            </Link>
          </>
        )}

        {user?.role === "author" && (
          <>
            <Link
              to="/author/dashboard"
              className="nav-link d-flex align-items-center"
            >
              <FaBookOpen className="me-1" /> Dashboard
            </Link>
            <Link
              to="/revisions/my"
              className="nav-link d-flex align-items-center"
            >
              <FaBookOpen className="me-1" /> My Revisions
            </Link>
          </>
        )}

        {user?.role === "reviewer" && (
          <>
            <Link
              to="/reviewer/dashboard"
              className="nav-link d-flex align-items-center"
            >
              <FaClipboardCheck className="me-1" /> Dashboard
            </Link>
            <Link
              to="/assignments"
              className="nav-link d-flex align-items-center"
            >
              <FaClipboardCheck className="me-1" /> My Assignments
            </Link>
          </>
        )}

        <div className="d-flex align-items-center gap-3 ms-2">
          <div className="d-flex align-items-center">
            <FaUser className="me-2 text-muted" />
            <span className="text-muted small">{user?.name}</span>
            <span className={`badge ms-2 role-${user?.role}`}>
              {user?.role}
            </span>
          </div>
          <Link
            to="/profile"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center"
          >
            <FaCog />
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm d-flex align-items-center"
          >
            <FaSignOutAlt className="me-1" /> Logout
          </button>
        </div>
      </>
    );
  };

  return (
    <Navbar
      bg="light"
      expand="lg"
      className="navbar-light mb-4 shadow-sm"
      sticky="top"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="navbar-brand fw-bold d-flex align-items-center"
        >
          <FaBook className="me-2" style={{ color: "#2563eb" }} />
          <span style={{ color: "#2563eb" }}>PublishHub</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            {renderNavLinks()}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export { LoadingSpinner, NavBar };
