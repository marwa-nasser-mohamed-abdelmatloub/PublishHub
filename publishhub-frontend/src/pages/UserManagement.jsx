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
  Form,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { userService } from "../services";
import { 
  FaTrash, 
  FaCheck, 
  FaEye, 
  FaEyeSlash, 
  FaAsterisk,
  FaUserPlus,
  FaEdit,
  FaSearch,
  FaUsers,
  FaUserShield,
  FaUserEdit,
  FaUserCheck
} from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "author",
  });

  const [formErrors, setFormErrors] = useState({});
  const [formValidated, setFormValidated] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordHasText, setPasswordHasText] = useState(false);
  const [passwordConfirmHasText, setPasswordConfirmHasText] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowModal(true);
  };

  const handleSaveRole = async () => {
    try {
      setError("");
      setSuccess("");

      await userService.update(selectedUser.id, {
        role: newRole,
      });

      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, role: newRole } : u,
        ),
      );

      setSuccess(`User role updated to ${newRole}`);
      setShowModal(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update user role");
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...formErrors };
    const newValidated = { ...formValidated };

    if (name === "name") {
      if (!value) {
        newErrors.name = ["Full name is required"];
        newValidated.name = false;
      } else if (value.length < 3) {
        newErrors.name = ["Full name must be at least 3 characters"];
        newValidated.name = false;
      } else {
        delete newErrors.name;
        newValidated.name = true;
      }
    }

    if (name === "email") {
      if (!value) {
        newErrors.email = ["Email address is required"];
        newValidated.email = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = ["Invalid email address"];
        newValidated.email = false;
      } else {
        delete newErrors.email;
        newValidated.email = true;
      }
    }

    if (name === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!value) {
        newErrors.password = ["Password is required"];
        newValidated.password = false;
      } else if (!passwordRegex.test(value)) {
        newErrors.password = [
          "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long",
        ];
        newValidated.password = false;
      } else {
        delete newErrors.password;
        newValidated.password = true;
      }
    }

    if (name === "password_confirmation") {
      if (!value) {
        newErrors.password_confirmation = ["Password confirmation is required"];
        newValidated.password_confirmation = false;
      } else if (value !== formData.password) {
        newErrors.password_confirmation = ["Passwords do not match"];
        newValidated.password_confirmation = false;
      } else {
        delete newErrors.password_confirmation;
        newValidated.password_confirmation = true;
      }
    }

    if (name === "role") {
      if (!value) {
        newErrors.role = ["Role is required"];
        newValidated.role = false;
      } else {
        delete newErrors.role;
        newValidated.role = true;
      }
    }

    setFormErrors(newErrors);
    setFormValidated(newValidated);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordHasText(value.length > 0);
    } else if (name === "password_confirmation") {
      setPasswordConfirmHasText(value.length > 0);
    }

    validateField(name, value);
  };

  const handleFormBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    const newValidated = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!formData.name) {
      newErrors.name = ["Full name is required"];
      newValidated.name = false;
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = ["Full name must be at least 3 characters"];
      newValidated.name = false;
      isValid = false;
    } else {
      newValidated.name = true;
    }

    if (!formData.email) {
      newErrors.email = ["Email address is required"];
      newValidated.email = false;
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = ["Invalid email address"];
      newValidated.email = false;
      isValid = false;
    } else {
      newValidated.email = true;
    }

    if (!formData.password) {
      newErrors.password = ["Password is required"];
      newValidated.password = false;
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = [
        "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long",
      ];
      newValidated.password = false;
      isValid = false;
    } else {
      newValidated.password = true;
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = ["Password confirmation is required"];
      newValidated.password_confirmation = false;
      isValid = false;
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = ["Passwords do not match"];
      newValidated.password_confirmation = false;
      isValid = false;
    } else {
      newValidated.password_confirmation = true;
    }

    if (!formData.role) {
      newErrors.role = ["Role is required"];
      newValidated.role = false;
      isValid = false;
    } else {
      newValidated.role = true;
    }

    setFormErrors(newErrors);
    setFormValidated(newValidated);
    return isValid;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setModalError("");
    setModalSuccess("");

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      await userService.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: formData.role,
      });
      setModalSuccess("✅ User created successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "author",
      });
      setPasswordHasText(false);
      setPasswordConfirmHasText(false);
      setFormErrors({});
      setFormValidated({});

      setTimeout(() => {
        setShowCreateModal(false);
        setModalSuccess("");
      }, 1500);
      await loadUsers();
    } catch (err) {
      const errorData = err.response?.data;

      if (errorData?.data && typeof errorData.data === "object") {
        // تحويل الأخطاء إلى الصيغة المناسبة
        const formattedErrors = {};
        Object.entries(errorData.data).forEach(([field, messages]) => {
          formattedErrors[field] = Array.isArray(messages)
            ? messages
            : [messages];
        });
        setFormErrors(formattedErrors);

        // جمع كل الأخطاء في قائمة واحدة لعرضها
        const allErrors = [];
        Object.values(formattedErrors).forEach((messages) => {
          if (Array.isArray(messages)) {
            allErrors.push(...messages);
          } else {
            allErrors.push(messages);
          }
        });
        setModalError(allErrors.join("\n"));
      } else if (errorData?.message) {
        setModalError(errorData.message);
      } else {
        setModalError(err.message || "Failed to create user");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setError("");
      await userService.delete(userId);
      setUsers(users.filter((u) => u.id !== userId));
      setSuccess("User deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  const getFilteredUsers = () => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  };

  const getStats = () => {
    return {
      total: users.length,
      admin: users.filter((u) => u.role === "admin").length,
      author: users.filter((u) => u.role === "author").length,
      reviewer: users.filter((u) => u.role === "reviewer").length,
    };
  };

  const stats = getStats();
  const filteredUsers = getFilteredUsers();

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
    <Container fluid className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="fw-bold" style={{ color: "#2563eb" }}>
          <FaUsers className="me-2" /> User Management
        </h1>
        <Button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            padding: "10px 20px",
          }}
        >
          <FaUserPlus className="me-2" /> Add New User
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          <strong>⚠️ Error:</strong> {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible>
          <strong>✅ Success:</strong> {success}
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
              <p className="mb-0"><FaUsers className="me-1" /> Total Users</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="shadow-lg border-0 text-center"
            style={{
              borderRadius: "14px",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "white",
            }}
          >
            <Card.Body>
              <h3 className="fw-bold mb-2">{stats.admin}</h3>
              <p className="mb-0"><FaUserShield className="me-1" /> Admins</p>
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
              <h3 className="fw-bold mb-2">{stats.author}</h3>
              <p className="mb-0"><FaUserEdit className="me-1" /> Authors</p>
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
              <h3 className="fw-bold mb-2">{stats.reviewer}</h3>
              <p className="mb-0"><FaUserCheck className="me-1" /> Reviewers</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Card
        className="shadow-lg border-0 mb-4"
        style={{ borderRadius: "14px" }}
      >
        <Card.Body className="p-4">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold mb-2">
                  <FaSearch className="me-2" /> Search
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      borderRadius: "10px",
                      borderColor: "#2563eb",
                      padding: "12px",
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold mb-2">
                  <FaUserShield className="me-2" /> Filter by Role
                </Form.Label>
                <Form.Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{
                    borderRadius: "10px",
                    borderColor: "#2563eb",
                    padding: "12px",
                  }}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="author">Author</option>
                  <option value="reviewer">Reviewer</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <Card className="shadow-lg border-0" style={{ borderRadius: "14px" }}>
          <Card.Body className="text-center py-5">
            <p className="text-muted fs-5">No users found</p>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-lg border-0" style={{ borderRadius: "14px" }}>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead
                  style={{
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                    color: "white",
                  }}
                >
                  <tr>
                    <th className="px-4 py-3 fw-bold">Name</th>
                    <th className="px-4 py-3 fw-bold">Email</th>
                    <th className="px-4 py-3 fw-bold">Role</th>
                    <th className="px-4 py-3 fw-bold">Joined</th>
                    <th className="px-4 py-3 fw-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3">
                        <strong>{user.name}</strong>
                      </td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge bg={getRoleColor(user.role)}>
                          {user.role?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          onClick={() => handleEditRole(user)}
                          style={{
                            background:
                              "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                            border: "none",
                            borderRadius: "6px",
                            marginRight: "5px",
                          }}
                        >
                          <FaEdit className="me-1" /> Edit Role
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteUser(user.id)}
                          style={{
                            borderRadius: "6px",
                          }}
                        >
                          <FaTrash /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Edit Role Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
            color: "white",
          }}
        >
          <Modal.Title><FaEdit className="me-2" /> Edit User Role</Modal.Title>
          <Button
            variant="close"
            onClick={() => setShowModal(false)}
            style={{ filter: "invert(1)" }}
          />
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form.Group>
            <Form.Label className="fw-bold mb-3">
              User: {selectedUser?.name}
            </Form.Label>
            <Form.Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              style={{
                borderRadius: "10px",
                borderColor: "#2563eb",
                padding: "12px",
              }}
            >
              <option value="admin">Admin</option>
              <option value="author">Author</option>
              <option value="reviewer">Reviewer</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
              border: "none",
            }}
            onClick={handleSaveRole}
          >
            <FaCheck className="me-1" /> Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create User Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
          setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: "author",
          });
          setFormErrors({});
          setFormValidated({});
          setModalError("");
          setModalSuccess("");
          setPasswordHasText(false);
          setPasswordConfirmHasText(false);
        }}
        centered
        size="lg"
      >
        <Modal.Header
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
          }}
        >
          <Modal.Title><FaUserPlus className="me-2" /> Create New User</Modal.Title>
          <Button
            variant="close"
            onClick={() => setShowCreateModal(false)}
            style={{ filter: "invert(1)" }}
          />
        </Modal.Header>
        <Modal.Body className="p-4">
          {modalError && (
            <Alert
              variant="danger"
              onClose={() => setModalError("")}
              dismissible
              className="mb-4"
            >
              <strong>⚠️ Validation Errors:</strong>
              <ul className="mb-0 mt-2">
                {modalError.split("\n").map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
          {modalSuccess && (
            <Alert
              variant="success"
              onClose={() => setModalSuccess("")}
              dismissible
              className="mb-4"
            >
              <FaCheck className="me-2" /> {modalSuccess}
            </Alert>
          )}
          <Form onSubmit={handleCreateUser}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Full Name <FaAsterisk size={10} color="#ef4444" />
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  onBlur={handleFormBlur}
                  style={{
                    borderRadius: "10px",
                    padding: "12px 16px",
                    borderColor: formErrors.name
                      ? "#ef4444"
                      : formValidated.name
                        ? "#10b981"
                        : "#e2e8f0",
                    fontSize: "1rem",
                  }}
                  placeholder="Enter user full name"
                />
                {formValidated.name && !formErrors.name && (
                  <FaCheck
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#10b981",
                      fontSize: "20px",
                      zIndex: 5,
                    }}
                  />
                )}
              </InputGroup>
              {formErrors.name && (
                <div
                  className="text-danger mt-2"
                  style={{ fontSize: "0.875rem", fontWeight: "500" }}
                >
                  {formErrors.name[0]}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Email Address <FaAsterisk size={10} color="#ef4444" />
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  onBlur={handleFormBlur}
                  style={{
                    borderRadius: "10px",
                    padding: "12px 16px",
                    borderColor: formErrors.email
                      ? "#ef4444"
                      : formValidated.email
                        ? "#10b981"
                        : "#e2e8f0",
                    fontSize: "1rem",
                  }}
                  placeholder="user@example.com"
                />
                {formValidated.email && !formErrors.email && (
                  <FaCheck
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#10b981",
                      fontSize: "20px",
                      zIndex: 5,
                    }}
                  />
                )}
              </InputGroup>
              {formErrors.email && (
                <div
                  className="text-danger mt-2"
                  style={{ fontSize: "0.875rem", fontWeight: "500" }}
                >
                  {formErrors.email[0]}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Password <FaAsterisk size={10} color="#ef4444" />
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  onBlur={handleFormBlur}
                  style={{
                    borderRadius: "10px",
                    padding: "12px 16px",
                    borderColor: formErrors.password
                      ? "#ef4444"
                      : formValidated.password
                        ? "#10b981"
                        : "#e2e8f0",
                    fontSize: "1rem",
                  }}
                  placeholder="Enter secure password"
                />
                {passwordHasText && (
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#2563eb",
                      zIndex: 5,
                      padding: "0 12px",
                      fontSize: "20px",
                    }}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                )}
                {formValidated.password && !formErrors.password && passwordHasText && (
                  <FaCheck
                    style={{
                      position: "absolute",
                      right: "50px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#10b981",
                      fontSize: "20px",
                      zIndex: 4,
                    }}
                  />
                )}
              </InputGroup>
              {formErrors.password && (
                <div
                  className="text-danger mt-2"
                  style={{ fontSize: "0.875rem", fontWeight: "500" }}
                >
                  {formErrors.password[0]}
                </div>
              )}
              <Form.Text className="text-muted d-block mt-1">
                Must include: uppercase, lowercase, number, special character
                (@$!%*?&)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Confirm Password <FaAsterisk size={10} color="#ef4444" />
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleFormChange}
                  onBlur={handleFormBlur}
                  style={{
                    borderRadius: "10px",
                    padding: "12px 16px",
                    borderColor: formErrors.password_confirmation
                      ? "#ef4444"
                      : formValidated.password_confirmation
                        ? "#10b981"
                        : "#e2e8f0",
                    fontSize: "1rem",
                  }}
                  placeholder="Confirm password"
                />
                {passwordConfirmHasText && (
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#2563eb",
                      zIndex: 5,
                      padding: "0 12px",
                      fontSize: "20px",
                    }}
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                )}
              </InputGroup>
              {formErrors.password_confirmation && (
                <div
                  className="text-danger mt-2"
                  style={{ fontSize: "0.875rem", fontWeight: "500" }}
                >
                  {formErrors.password_confirmation[0]}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Role <FaAsterisk size={10} color="#ef4444" />
              </Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                onBlur={handleFormBlur}
                style={{
                  borderRadius: "10px",
                  padding: "12px 16px",
                  borderColor: formErrors.role
                    ? "#ef4444"
                    : formValidated.role
                      ? "#10b981"
                      : "#e2e8f0",
                  fontSize: "1rem",
                }}
              >
                <option value="author">Author</option>
                <option value="reviewer">Reviewer</option>
                <option value="admin">Admin</option>
              </Form.Select>
              {formErrors.role && (
                <div
                  className="text-danger mt-2"
                  style={{ fontSize: "0.875rem", fontWeight: "500" }}
                >
                  {formErrors.role[0]}
                </div>
              )}
            </Form.Group>

            <div className="mb-4">
              <small className="text-muted">
                <FaAsterisk size={8} color="#ef4444" /> Required field
              </small>
            </div>

            <div className="d-grid gap-2">
              <Button
                variant="success"
                type="submit"
                disabled={submitting}
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "600",
                  padding: "12px 16px",
                  fontSize: "1rem",
                }}
              >
                {submitting ? (
                  <span className="d-flex align-items-center justify-content-center">
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Creating User...
                  </span>
                ) : (
                  <span className="d-flex align-items-center justify-content-center">
                    <FaCheck className="me-2" /> Create User
                  </span>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

const getRoleColor = (role) => {
  const roleColorMap = {
    admin: "danger",
    author: "success",
    reviewer: "warning",
  };
  return roleColorMap[role] || "secondary";
};

export default UserManagement;