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
import { articleService, apiService } from "../services";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaUsers,
  FaUserCheck,
  FaRedo,
  FaCog,
  FaFilter,
  FaDownload,
  FaEllipsisH,
  FaChartBar,
  FaChartPie,
  FaBell,
  FaCalendarAlt,
  FaTag,
  FaLink,
  FaChartLine,
  FaTrophy,
  FaStar,
  FaAward,
  FaLightbulb,
  FaBook,
  FaPen,
  FaTachometerAlt,
  FaExternalLinkAlt,
  FaUser,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCaretRight,
  FaArrowRight,
  FaSync,
  FaHistory,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalUsers: 0,
    totalReviewers: 0,
    pendingApproval: 0,
    approved: 0,
    rejected: 0,
    underReview: 0,
    revisionRequested: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);

  const COLORS = ["#2563eb", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const articlesResponse = await articleService.getAll();
      const allArticles = articlesResponse.data || [];
      setArticles(allArticles);

      const usersResponse = await apiService.get("/users");
      const allUsers = usersResponse.data || [];

   const activityResponse = await apiService.get("/activity");

   const activityData =
     activityResponse.data?.data?.activities ||
     activityResponse.data?.activities ||
     activityResponse.data ||
     [];

   setRecentActivity(
     Array.isArray(activityData) ? activityData.slice(0, 5) : [],
   );

      const statsData = {
        totalArticles: allArticles.length,
        totalUsers: allUsers.length,
        totalReviewers: allUsers.filter((u) => u.role === "reviewer").length,
        pendingApproval: allArticles.filter((a) => a.status === "submitted")
          .length,
        approved: allArticles.filter((a) => a.status === "approved").length,
        rejected: allArticles.filter((a) => a.status === "rejected").length,
        underReview: allArticles.filter((a) => a.status === "under_review")
          .length,
        revisionRequested: allArticles.filter(
          (a) => a.status === "revision_requested",
        ).length,
      };
      setStats(statsData);

      const chartData = [
        {
          name: "Pending",
          value: statsData.pendingApproval,
          icon: <FaClock />,
        },
        {
          name: "Approved",
          value: statsData.approved,
          icon: <FaCheckCircle />,
        },
        {
          name: "Rejected",
          value: statsData.rejected,
          icon: <FaTimesCircle />,
        },
        {
          name: "Under Review",
          value: statsData.underReview,
          icon: <FaEye />,
        },
        {
          name: "Revision",
          value: statsData.revisionRequested,
          icon: <FaRedo />,
        },
      ];
      setChartData(chartData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
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
            Loading dashboard data...
          </p>
        </div>
      </Container>
    );
  }

  const pendingArticles = articles.filter((a) => a.status === "submitted");
  const recentArticles = articles.slice(0, 3);

  const activityIcons = {
    article_submitted: <FaFileAlt className="text-primary" />,
    article_approved: <FaCheckCircle className="text-success" />,
    article_rejected: <FaTimesCircle className="text-danger" />,
    article_reviewed: <FaEye className="text-warning" />,
    user_registered: <FaUsers className="text-info" />,
    user_updated: <FaUserCheck className="text-success" />,
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-2">
            <FaTachometerAlt className="me-2" style={{ color: "#2563eb" }} />
            Admin Dashboard
          </h1>
          <p className="text-muted mb-0">
            <FaCalendarAlt className="me-2" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Button
            variant="outline-primary"
            onClick={refreshData}
            className="d-flex align-items-center"
          >
            <FaSync className="me-2" />
            Refresh
          </Button>

        </div>
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

      {/* Top Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(37, 99, 235, 0.1)" }}
              >
                <FaFileAlt size={24} color="#2563eb" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.totalArticles}</h2>
                <p className="text-muted mb-0">
                  <FaFileAlt size={14} className="me-1" />
                  Total Articles
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
              >
                <FaClock size={24} color="#f59e0b" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.pendingApproval}</h2>
                <p className="text-muted mb-0">
                  <FaClock size={14} className="me-1" />
                  Pending Approval
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
              >
                <FaCheckCircle size={24} color="#10b981" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.approved}</h2>
                <p className="text-muted mb-0">
                  <FaCheckCircle size={14} className="me-1" />
                  Approved
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
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
                  Rejected
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Secondary Stats */}
      <Row className="g-3 mb-4">
        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
              >
                <FaEye size={24} color="#8b5cf6" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.underReview}</h2>
                <p className="text-muted mb-0">
                  <FaEye size={14} className="me-1" />
                  Under Review
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(6, 182, 212, 0.1)" }}
              >
                <FaUsers size={24} color="#06b6d4" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.totalUsers}</h2>
                <p className="text-muted mb-0">
                  <FaUsers size={14} className="me-1" />
                  Total Users
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(236, 72, 153, 0.1)" }}
              >
                <FaUserCheck size={24} color="#ec4899" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.totalReviewers}</h2>
                <p className="text-muted mb-0">
                  <FaUserCheck size={14} className="me-1" />
                  Reviewers
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div
                className="rounded-circle p-3 me-3"
                style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
              >
                <FaRedo size={24} color="#f59e0b" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{stats.revisionRequested}</h2>
                <p className="text-muted mb-0">
                  <FaRedo size={14} className="me-1" />
                  Revision Requested
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts and Data Visualization */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body style={{ display: "flex", flexDirection: "column" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">
                  <FaChartBar className="me-2" />
                  Articles Overview
                </h5>
                <div className="dropdown">
                  <Button
                    variant="link"
                    className="text-muted p-0"
                    id="chartOptions"
                    data-bs-toggle="dropdown"
                  >
                    <FaEllipsisH />
                  </Button>
                  <ul className="dropdown-menu">
                    <li>
                      <button className="dropdown-item">
                        <FaDownload className="me-2" />
                        Export Data
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item">
                        <FaFilter className="me-2" />
                        Filter Chart
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              {chartData && chartData.length > 0 ? (
                <div style={{ flex: 1, minHeight: 300, minWidth: 0, width: "100%", position: "relative" }}>
                  <ResponsiveContainer width="100%" height="100%" debounce={1}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[4, 4, 0, 0]}
                      fill="#2563eb"
                      name="Articles Count"
                    />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div
                  style={{ height: 300, minHeight: 300, minWidth: 0, width: "100%", position: "relative" }}
                  className="d-flex align-items-center justify-content-center text-muted"
                >
                  No chart data available
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <h5 className="fw-bold mb-4">
                <FaChartPie className="me-2" />
                Status Distribution
              </h5>
              {chartData && chartData.length > 0 ? (
                <div style={{ height: 250, minHeight: 250, minWidth: 0, width: "100%", position: "relative" }}>
                  <ResponsiveContainer width="100%" height="100%" debounce={1}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div
                  style={{ height: 250, minHeight: 250, minWidth: 0 }}
                  className="d-flex align-items-center justify-content-center text-muted"
                >
                  No chart data available
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row className="g-4">
        {/* Pending Articles */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">
                  <FaClock className="me-2 text-warning" />
                  Pending Approval ({pendingArticles.length})
                </h5>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="d-flex align-items-center"
                  href="/articles?status=submitted"
                >
                  View All
                  <FaCaretRight className="ms-2" size={14} />
                </Button>
              </div>

              {pendingArticles.length === 0 ? (
                <div className="text-center py-5">
                  <FaCheckCircle size={48} className="text-success mb-3" />
                  <p className="text-muted mb-0">
                    All articles are approved! Great work!{" "}
                    <FaTrophy className="ms-1" />
                  </p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {pendingArticles.slice(0, 5).map((article) => (
                    <div
                      key={article.id}
                      className="list-group-item list-group-item-action border-0 px-0 py-3"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-1">
                            <h6 className="fw-bold mb-0 me-2">
                              {article.title}
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
                            {article.author?.name || "Unknown Author"}
                          </p>
                          <div className="d-flex gap-3">
                            <small className="text-muted">
                              <FaCalendarAlt size={12} className="me-1" />
                              {new Date(
                                article.created_at,
                              ).toLocaleDateString()}
                            </small>
                            {article.category && (
                              <small className="text-muted">
                                <FaTag size={12} className="me-1" />
                                {article.category}
                              </small>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          href={`/articles/${article.id}`}
                          className="d-flex align-items-center"
                        >
                          <FaEye className="me-1" />
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

        {/* Recent Activity */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">
                  <FaBell className="me-2 text-primary" />
                  Recent Activity
                </h5>
                <Button
                  variant="link"
                  size="sm"
                  className="text-muted p-0"
                  href="/activity"
                >
                  <FaEllipsisH />
                </Button>
              </div>

              <div className="list-group list-group-flush">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="list-group-item border-0 px-0 py-3"
                    >
                      <div className="d-flex">
                        <div className="me-3 mt-1">
                          {activityIcons[activity.type] || (
                            <FaBell className="text-secondary" />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1 small">{activity.description}</p>
                          <small className="text-muted">
                            <FaClock size={12} className="me-1" />
                            {new Date(activity.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted mb-0">No recent activity</p>
                  </div>
                )}
              </div>

              {/* System Status */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-bold mb-3">
                  <FaShieldAlt className="me-2 text-success" />
                  System Status
                </h6>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Server Uptime</span>
                  <span className="fw-bold small text-success">99.9%</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Active Users</span>
                  <span className="fw-bold small text-primary">24</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Storage Used</span>
                  <span className="fw-bold small text-warning">65%</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="shadow-sm border-0 mt-4">
        <Card.Body>
          <h5 className="fw-bold mb-4">
            <FaLightbulb className="me-2 text-primary" />
            Quick Actions
          </h5>
          <Row className="g-3">
            <Col xs={6} md={3} lg={2}>
              <Button
                href="/articles"
                variant="outline-primary"
                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
              >
                <FaFileAlt size={20} className="mb-2" />
                <span className="small">All Articles</span>
              </Button>
            </Col>
            <Col xs={6} md={3} lg={2}>
              <Button
                href="/articles/create"
                variant="outline-success"
                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
              >
                <FaPen size={20} className="mb-2" />
                <span className="small">New Article</span>
              </Button>
            </Col>
            <Col xs={6} md={3} lg={2}>
              <Button
                href="/manage-users"
                variant="outline-info"
                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
              >
                <FaUsers size={20} className="mb-2" />
                <span className="small">Users</span>
              </Button>
            </Col>
            <Col xs={6} md={3} lg={2}>
              <Button
                href="/revisions"
                variant="outline-warning"
                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
              >
                <FaHistory size={20} className="mb-2" />
                <span className="small">Revisions</span>
              </Button>
            </Col>
            <Col xs={6} md={3} lg={2}>
              <Button
                href="/reports"
                variant="outline-secondary"
                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
              >
                <FaClipboardList size={20} className="mb-2" />
                <span className="small">Reports</span>
              </Button>
            </Col>
            <Col xs={6} md={3} lg={2}>
              <Button
                href="/settings"
                variant="outline-dark"
                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
              >
                <FaCog size={20} className="mb-2" />
                <span className="small">Settings</span>
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Recent Articles */}
      <Card className="shadow-sm border-0 mt-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">
              <FaBook className="me-2 text-primary" />
              Recent Articles
            </h5>
            <Button
              variant="link"
              size="sm"
              className="text-primary p-0 d-flex align-items-center"
              href="/articles"
            >
              View All
              <FaArrowRight className="ms-1" size={14} />
            </Button>
          </div>

          <Row className="g-3">
            {recentArticles.map((article) => (
              <Col md={4} key={article.id}>
                <Card className="border h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h6 className="fw-bold mb-0 flex-grow-1">
                        {article.title.substring(0, 40)}
                        {article.title.length > 40 && "..."}
                      </h6>
                      <Badge
                        bg={getStatusColor(article.status)}
                        className="ms-2"
                      >
                        {article.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-muted small mb-3">
                      {article.content?.substring(0, 80)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <FaUser size={12} className="me-1" />
                        {article.author?.name}
                      </small>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 d-flex align-items-center"
                        href={`/articles/${article.id}`}
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
                <h6 className="fw-bold mb-0">Performance</h6>
                <p className="text-muted small mb-0">
                  <FaStar size={12} className="me-1" />
                  Average rating: 4.5/5
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
                  <FaTrophy size={12} className="me-1" />
                  12 awards this month
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
                <FaBook size={20} color="#8b5cf6" />
              </div>
              <div>
                <h6 className="fw-bold mb-0">Knowledge Base</h6>
                <p className="text-muted small mb-0">
                  <FaLink size={12} className="me-1" />
                  <a href="/docs" className="text-decoration-none">
                    View documentation
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

const getStatusColor = (status) => {
  const statusMap = {
    draft: "secondary",
    submitted: "info",
    under_review: "warning",
    approved: "success",
    rejected: "danger",
    revision_requested: "warning",
  };
  return statusMap[status] || "secondary";
};

export default AdminDashboard;
