import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services";
import { useAuth } from "../hooks/useAuth";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  InputGroup,
} from "react-bootstrap";
import { FaCheck, FaEye, FaEyeSlash, FaAsterisk } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "author",
  });
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordHasText, setPasswordHasText] = useState(false);
  const [passwordConfirmHasText, setPasswordConfirmHasText] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const newValidated = { ...validated };

    if (name === "name") {
      if (!value) {
        newErrors.name = "Full name is required";
        newValidated.name = false;
      } else if (value.length < 3) {
        newErrors.name = "Full name must be at least 3 characters";
        newValidated.name = false;
      } else {
        delete newErrors.name;
        newValidated.name = true;
      }
    }

    if (name === "email") {
      if (!value) {
        newErrors.email = "Email address is required";
        newValidated.email = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = "Invalid email address";
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

    if (name === "password_confirmation") {
      if (!value) {
        newErrors.password_confirmation = "Password confirmation is required";
        newValidated.password_confirmation = false;
      } else if (value !== formData.password) {
        newErrors.password_confirmation = "Passwords do not match";
        newValidated.password_confirmation = false;
      } else {
        delete newErrors.password_confirmation;
        newValidated.password_confirmation = true;
      }
    }

    setErrors(newErrors);
    setValidated(newValidated);
  };

  const handleChange = (e) => {
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

  const handleBlur = (e) => {
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
      newErrors.name = "Full name is required";
      newValidated.name = false;
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = "Full name must be at least 3 characters";
      newValidated.name = false;
      isValid = false;
    } else {
      newValidated.name = true;
    }

    if (!formData.email) {
      newErrors.email = "Email address is required";
      newValidated.email = false;
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      newValidated.email = false;
      isValid = false;
    } else {
      newValidated.email = true;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      newValidated.password = false;
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long";
      newValidated.password = false;
      isValid = false;
    } else {
      newValidated.password = true;
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Password confirmation is required";
      newValidated.password_confirmation = false;
      isValid = false;
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
      newValidated.password_confirmation = false;
      isValid = false;
    } else {
      newValidated.password_confirmation = true;
    }

    setErrors(newErrors);
    setValidated(newValidated);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await authService.register(formData);
      const { user, token } = response.data;
      login(user, token);
      navigate("/");
    } catch (err) {
      setErrors({ general: err.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "90vh" }}
    >
      <Row className="w-100">
        <Col md={8} lg={6} xl={5} className="mx-auto">
          <Card className="shadow-lg border-0" style={{ borderRadius: "14px" }}>
            <Card.Body className="p-5">
              <Card.Title className="mb-5 text-center">
                <h2 className="fw-bold" style={{ color: "#2563eb" }}>
                  Create Account
                </h2>
                <p className="text-muted mt-2">Join us today to get started</p>
              </Card.Title>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    Full Name <FaAsterisk size={10} color="#ef4444" />
                  </Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your full name"
                      style={{
                        borderRadius: "10px",
                        padding: "12px 16px",
                        borderColor: errors.name
                          ? "#ef4444"
                          : validated.name
                            ? "#10b981"
                            : "#e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                    {validated.name && !errors.name && (
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
                  {errors.name && (
                    <div
                      className="text-danger mt-2"
                      style={{ fontSize: "0.875rem", fontWeight: "500" }}
                    >
                      {errors.name}
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your email"
                      style={{
                        borderRadius: "10px",
                        padding: "12px 16px",
                        borderColor: errors.email
                          ? "#ef4444"
                          : validated.email
                            ? "#10b981"
                            : "#e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                    {validated.email && !errors.email && (
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
                  {errors.email && (
                    <div
                      className="text-danger mt-2"
                      style={{ fontSize: "0.875rem", fontWeight: "500" }}
                    >
                      {errors.email}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Select Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={{
                      borderRadius: "10px",
                      padding: "12px 16px",
                      borderColor: "#e2e8f0",
                      fontSize: "1rem",
                    }}
                  >
                    <option value="author">Author</option>
                    <option value="reviewer">Reviewer</option>
                  </Form.Select>
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your password"
                      style={{
                        borderRadius: "10px",
                        padding: "12px 16px",
                        borderColor: errors.password
                          ? "#ef4444"
                          : validated.password
                            ? "#10b981"
                            : "#e2e8f0",
                        fontSize: "1rem",
                      }}
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
                    {validated.password &&
                      !errors.password &&
                      passwordHasText && (
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
                  {errors.password && (
                    <div
                      className="text-danger mt-2"
                      style={{ fontSize: "0.875rem", fontWeight: "500" }}
                    >
                      {errors.password}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    Confirm Password <FaAsterisk size={10} color="#ef4444" />
                  </Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={showPasswordConfirm ? "text" : "password"}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Confirm your password"
                      style={{
                        borderRadius: "10px",
                        padding: "12px 16px",
                        borderColor: errors.password_confirmation
                          ? "#ef4444"
                          : validated.password_confirmation
                            ? "#10b981"
                            : "#e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                    {passwordConfirmHasText && (
                      <span
                        onClick={() =>
                          setShowPasswordConfirm(!showPasswordConfirm)
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
                        {showPasswordConfirm ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    )}
                    {validated.password_confirmation &&
                      !errors.password_confirmation &&
                      passwordConfirmHasText && (
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
                  {errors.password_confirmation && (
                    <div
                      className="text-danger mt-2"
                      style={{ fontSize: "0.875rem", fontWeight: "500" }}
                    >
                      {errors.password_confirmation}
                    </div>
                  )}
                </Form.Group>

                <div className="mb-4">
                  <small className="text-muted">
                    <FaAsterisk size={8} color="#ef4444" /> Required field
                  </small>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-bold"
                  disabled={loading}
                  style={{
                    padding: "12px 16px",
                    fontSize: "1rem",
                    borderRadius: "10px",
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
                  }}
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center">
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Form>

              <hr className="my-4" />

              <div className="text-center text-muted">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="fw-bold"
                  style={{ color: "#2563eb", textDecoration: "none" }}
                >
                  Sign In
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
