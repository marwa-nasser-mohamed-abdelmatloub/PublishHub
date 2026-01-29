import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services";
import { useNavigate, Link } from "react-router-dom";
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
import { FaCheck, FaEye, FaEyeSlash, FaAsterisk, FaExclamationTriangle } from "react-icons/fa"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHasText, setPasswordHasText] = useState(false);
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const newValidated = { ...validated };

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
      if (!value) {
        newErrors.password = "Password is required";
        newValidated.password = false;
      } else if (value.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        newValidated.password = false;
      } else {
        delete newErrors.password;
        newValidated.password = true;
      }
    }

    setErrors(newErrors);
    setValidated(newValidated);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateField("email", value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordHasText(value.length > 0);
    validateField("password", value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    const newValidated = {};

    if (!email) {
      newErrors.email = "Email address is required";
      newValidated.email = false;
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
      newValidated.email = false;
      isValid = false;
    } else {
      newValidated.email = true;
    }

    if (!password) {
      newErrors.password = "Password is required";
      newValidated.password = false;
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      newValidated.password = false;
      isValid = false;
    } else {
      newValidated.password = true;
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
      const response = await authService.login(email, password);
      const { user, token } = response.data;

      if (user && token) {
        login(user, token);
        navigate("/");
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Invalid response from server",
        }));
      }
    } catch (err) {
      const errorMessage =
        err?.message || err?.error || "Invalid email or password";
      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg border-0" style={{ borderRadius: "14px" }}>
            <Card.Body className="p-5">
              <Card.Title className="mb-5 text-center">
                <h2 className="fw-bold" style={{ color: "#2563eb" }}>
                  Welcome Back
                </h2>
                <p className="text-muted mt-2">Sign in to your account</p>
              </Card.Title>

{errors.general && (
    <Alert
        variant="danger"
        className="mb-4 d-flex align-items-start"
        dismissible
        onClose={() =>
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.general;
                return newErrors;
            })
        }
        style={{
            borderRadius: "10px",
            fontSize: "0.95rem",
            fontWeight: "500",
        }}
    >
        <FaExclamationTriangle className="me-2 mt-1" style={{ fontSize: "1.2rem" }} />
        <div>
            <strong>Validation Errors:</strong>
            <ul className="mb-0 mt-2">
                {(typeof errors.general === "string"
                    ? [errors.general]
                    : Object.values(errors).flat()
                ).map((err, idx) => (
                    <li key={idx}>{err}</li>
                ))}
            </ul>
        </div>
    </Alert>
)}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    Email Address <FaAsterisk size={10} color="#ef4444" />
                  </Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
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
                  <Form.Label className="fw-bold">
                    Password <FaAsterisk size={10} color="#ef4444" />
                  </Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
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
                    {validated.password && !errors.password && passwordHasText && (
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
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Form>

              <hr className="my-4" />

              <div className="text-center text-muted">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="fw-bold"
                  style={{
                    color: "#2563eb",
                    textDecoration: "none",
                  }}
                >
                  Create Account
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;