import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { authService } from "../services";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaAsterisk,
  FaKey,
  FaShieldAlt,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaTrash,
  FaLock,
  FaUserEdit,
} from "react-icons/fa";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordValidated, setPasswordValidated] = useState({});

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        role: currentUser.role || "",
      });
      setLoading(false);
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await authService.updateProfile({
        name: formData.name,
      });
      setSuccess("✅ Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        "❌ " +
          (err.response?.data?.message ||
            err.message ||
            "Failed to update profile"),
      );
    } finally {
      setSaving(false);
    }
  };

  const validatePasswordField = (field, value) => {
    const newErrors = { ...passwordErrors };
    const newValidated = { ...passwordValidated };
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (field === "password") {
      if (!value) {
        newErrors.password = "Password is required";
        newValidated.password = false;
      } else if (!passwordRegex.test(value)) {
        newErrors.password =
          "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long";
        newValidated.password = false;
      } else {
        delete newErrors.password;
        newValidated.password = true;
      }
    }

    if (field === "password_confirmation") {
      if (!value) {
        newErrors.password_confirmation = "Password confirmation is required";
        newValidated.password_confirmation = false;
      } else if (value !== passwordData.password) {
        newErrors.password_confirmation = "Passwords do not match";
        newValidated.password_confirmation = false;
      } else {
        delete newErrors.password_confirmation;
        newValidated.password_confirmation = true;
      }
    }

    if (field === "current_password") {
      if (!value) {
        newErrors.current_password = "Current password is required";
        newValidated.current_password = false;
      } else {
        delete newErrors.current_password;
        newValidated.current_password = true;
      }
    }

    setPasswordErrors(newErrors);
    setPasswordValidated(newValidated);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validatePasswordField(name, value);
  };

  const validatePasswordForm = () => {
    let isValid = true;
    const newErrors = {};
    const newValidated = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordData.current_password) {
      newErrors.current_password = "Current password is required";
      newValidated.current_password = false;
      isValid = false;
    } else {
      newValidated.current_password = true;
    }

    if (!passwordData.password) {
      newErrors.password = "New password is required";
      newValidated.password = false;
      isValid = false;
    } else if (!passwordRegex.test(passwordData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long";
      newValidated.password = false;
      isValid = false;
    } else {
      newValidated.password = true;
    }

    if (!passwordData.password_confirmation) {
      newErrors.password_confirmation = "Password confirmation is required";
      newValidated.password_confirmation = false;
      isValid = false;
    } else if (passwordData.password !== passwordData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
      newValidated.password_confirmation = false;
      isValid = false;
    } else {
      newValidated.password_confirmation = true;
    }

    setPasswordErrors(newErrors);
    setPasswordValidated(newValidated);
    return isValid;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    try {
      setChangingPassword(true);
      setPasswordError("");
      setPasswordSuccess("");

      await authService.changePassword(passwordData);
      setPasswordSuccess("✅ Password changed successfully!");
      setPasswordData({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      setPasswordValidated({});
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err) {
      // Extract error message from different response formats
      const errorMsg =
        err?.message || err?.error || "Failed to change password";
      setPasswordError("❌ " + errorMsg);
    } finally {
      setChangingPassword(false);
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
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="fw-bold mb-5" style={{ color: "#2563eb" }}>
            <FaUserEdit className="me-2" /> User Profile
          </h1>

          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              <FaExclamationTriangle className="me-2" /> {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" onClose={() => setSuccess("")} dismissible>
              <FaCheck className="me-2" /> {success}
            </Alert>
          )}

          {/* Profile Card */}
          <Card
            className="shadow-lg border-0 mb-4"
            style={{ borderRadius: "14px" }}
          >
            <Card.Body className="p-5">
              <h4 className="fw-bold mb-4" style={{ color: "#2563eb" }}>
                <FaUserEdit className="me-2" /> Personal Information
              </h4>

              <Form onSubmit={handleSaveProfile}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    <FaUser className="me-2" /> Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      borderRadius: "10px",
                      borderColor: "#2563eb",
                      padding: "12px",
                    }}
                    placeholder="Your full name"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    <FaEnvelope className="me-2" /> Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    style={{
                      borderRadius: "10px",
                      borderColor: "#e5e7eb",
                      padding: "12px",
                      backgroundColor: "#f9fafb",
                    }}
                    placeholder="your@email.com"
                  />
                  <Form.Text className="text-muted">
                    Email address cannot be changed
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    <FaUserTag className="me-2" /> Role
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="role"
                    value={formData.role}
                    disabled
                    style={{
                      borderRadius: "10px",
                      borderColor: "#e5e7eb",
                      padding: "12px",
                      backgroundColor: "#f9fafb",
                      textTransform: "capitalize",
                    }}
                    placeholder="Your role"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-100"
                  style={{
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                    padding: "12px",
                  }}
                >
                  {saving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" /> Save Changes
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Security Section */}
          <Card
            className="shadow-lg border-0 mb-4"
            style={{ borderRadius: "14px" }}
          >
            <Card.Body className="p-5">
              <h4 className="fw-bold mb-4" style={{ color: "#2563eb" }}>
                <FaShieldAlt className="me-2" /> Security - Change Password
              </h4>

              {passwordError && (
                <Alert
                  variant="danger"
                  onClose={() => setPasswordError("")}
                  dismissible
                >
                  <FaExclamationTriangle className="me-2" /> {passwordError}
                </Alert>
              )}

              {passwordSuccess && (
                <Alert
                  variant="success"
                  onClose={() => setPasswordSuccess("")}
                  dismissible
                >
                  <FaCheck className="me-2" /> {passwordSuccess}
                </Alert>
              )}

              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    <FaLock className="me-2" /> Current Password <FaAsterisk size={10} color="#ef4444" />
                  </Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={showCurrentPassword ? "text" : "password"}
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      onBlur={() =>
                        validatePasswordField(
                          "current_password",
                          passwordData.current_password,
                        )
                      }
                      style={{
                        borderRadius: "10px",
                        padding: "12px 16px",
                        borderColor: passwordErrors.current_password
                          ? "#ef4444"
                          : passwordValidated.current_password
                            ? "#10b981"
                            : "#e2e8f0",
                        fontSize: "1rem",
                      }}
                      placeholder="Enter current password"
                    />
                    {passwordData.current_password && (
                      <span
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
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
                        {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    )}
                    {passwordValidated.current_password && !passwordErrors.current_password && (
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
                  {passwordErrors.current_password && (
                    <div
                      className="text-danger mt-2"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {passwordErrors.current_password}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    <FaKey className="me-2" /> New Password <FaAsterisk size={10} color="#ef4444" />
                  </Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={showNewPassword ? "text" : "password"}
                      name="password"
                      value={passwordData.password}
                      onChange={handlePasswordChange}
                      onBlur={() =>
                        validatePasswordField("password", passwordData.password)
                      }
                      style={{
                        borderRadius: "10px",
                        padding: "12px 16px",
                        borderColor: passwordErrors.password
                          ? "#ef4444"
                          : passwordValidated.password
                            ? "#10b981"
                            : "#e2e8f0",
                        fontSize: "1rem",
                      }}
                      placeholder="Enter new password"
                    />
                    {passwordData.password && (
                      <span
                        onClick={() => setShowNewPassword(!showNewPassword)}
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
                        {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    )}
                    {passwordValidated.password && !passwordErrors.password && (
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
                  {passwordErrors.password && (
                    <div
                      className="text-danger mt-2"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {passwordErrors.password}
                    </div>
                  )}
                  <Form.Text className="text-muted d-block mt-2">
                    📋 Requirements: Minimum 8 characters, at least one
                    uppercase letter, one lowercase letter, one number, and one
                    special character (!@#$%^&* etc)
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    <FaLock className="me-2" /> Confirm New Password <FaAsterisk size={10} color="#ef4444" />
                  </Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="password_confirmation"
                      value={passwordData.password_confirmation}
                      onChange={handlePasswordChange}
                      onBlur={() =>
                        validatePasswordField(
                          "password_confirmation",
                          passwordData.password_confirmation,
                        )
                      }
                      style={{
                        borderRadius: "10px",
                        padding: "12px 16px",
                        borderColor: passwordErrors.password_confirmation
                          ? "#ef4444"
                          : passwordValidated.password_confirmation
                            ? "#10b981"
                            : "#e2e8f0",
                        fontSize: "1rem",
                      }}
                      placeholder="Confirm new password"
                    />
                    {passwordData.password_confirmation && (
                      <span
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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
                    {passwordValidated.password_confirmation && !passwordErrors.password_confirmation && (
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
                  {passwordErrors.password_confirmation && (
                    <div
                      className="text-danger mt-2"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {passwordErrors.password_confirmation}
                    </div>
                  )}
                </Form.Group>

                <div className="mb-4">
                  <small className="text-muted">
                    <FaAsterisk size={8} color="#ef4444" /> Required field
                  </small>
                </div>

                <Button
                  type="submit"
                  disabled={changingPassword}
                  className="w-100"
                  style={{
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                    padding: "12px 16px",
                    fontSize: "1rem",
                  }}
                >
                  {changingPassword ? (
                    <span className="d-flex align-items-center justify-content-center">
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Changing Password...
                    </span>
                  ) : (
                    <span className="d-flex align-items-center justify-content-center">
                      <FaKey className="me-2" /> Change Password
                    </span>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Danger Zone */}
          <Card
            className="shadow-lg border-0"
            style={{ borderRadius: "14px", borderLeft: "4px solid #ef4444" }}
          >
            <Card.Body className="p-5">
              <h4 className="fw-bold mb-3" style={{ color: "#ef4444" }}>
                <FaExclamationTriangle className="me-2" /> Danger Zone
              </h4>

              <p className="text-muted mb-4">
                These actions cannot be undone. Please be careful.
              </p>

              <Button
                variant="outline-danger"
                className="w-100 mb-3"
                onClick={handleLogout}
                style={{
                  borderRadius: "10px",
                  fontWeight: "600",
                  padding: "12px 16px",
                  fontSize: "1rem",
                }}
              >
                <FaSignOutAlt className="me-2" /> Logout
              </Button>

              <Button
                variant="outline-danger"
                className="w-100"
                disabled
                style={{
                  borderRadius: "10px",
                  fontWeight: "600",
                  padding: "12px 16px",
                  fontSize: "1rem",
                }}
              >
                <FaTrash className="me-2" /> Delete Account
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;