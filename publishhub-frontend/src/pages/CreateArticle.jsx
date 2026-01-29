import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { articleService } from "../services";

const CreateArticle = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const newValidated = { ...validated };

    if (name === "title") {
      if (!value.trim()) {
        newErrors.title = "Article title is required";
        newValidated.title = false;
      } else if (value.trim().length < 5) {
        newErrors.title = "Article title must be at least 5 characters";
        newValidated.title = false;
      } else if (value.trim().length > 255) {
        newErrors.title = "Article title cannot exceed 255 characters";
        newValidated.title = false;
      } else {
        delete newErrors.title;
        newValidated.title = true;
      }
    }

    if (name === "content") {
      if (!value.trim()) {
        newErrors.content = "Article content is required";
        newValidated.content = false;
      } else if (value.trim().length < 50) {
        newErrors.content = "Article content must be at least 50 characters";
        newValidated.content = false;
      } else {
        delete newErrors.content;
        newValidated.content = true;
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

    if (!formData.title.trim()) {
      newErrors.title = "Article title is required";
      newValidated.title = false;
      isValid = false;
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Article title must be at least 5 characters";
      newValidated.title = false;
      isValid = false;
    } else if (formData.title.trim().length > 255) {
      newErrors.title = "Article title cannot exceed 255 characters";
      newValidated.title = false;
      isValid = false;
    } else {
      newValidated.title = true;
    }

    if (!formData.content.trim()) {
      newErrors.content = "Article content is required";
      newValidated.content = false;
      isValid = false;
    } else if (formData.content.trim().length < 50) {
      newErrors.content = "Article content must be at least 50 characters";
      newValidated.content = false;
      isValid = false;
    } else {
      newValidated.content = true;
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
      await articleService.create(formData);
      navigate("/articles");
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to create article";
      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow-lg border-0" style={{ borderRadius: "14px" }}>
            <Card.Body className="p-5">
              <h2 className="fw-bold mb-5" style={{ color: "#2563eb" }}>
                Create New Article
              </h2>

              {errors.general && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() =>
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.general;
                      return newErrors;
                    })
                  }
                  style={{ borderRadius: "10px" }}
                  className="mb-4"
                >
                  {errors.general}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Article Title</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.title}
                      isValid={validated.title}
                      placeholder="Enter article title (minimum 5 characters)"
                      disabled={loading}
                      style={{
                        borderRadius: "10px",
                        padding: "12px 16px",
                        borderColor: errors.title
                          ? "#ef4444"
                          : validated.title
                            ? "#10b981"
                            : "#e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                  </InputGroup>
                  {errors.title && (
                    <div
                      className="text-danger mt-2"
                      style={{ fontSize: "0.875rem", fontWeight: "500" }}
                    >
                      {errors.title}
                    </div>
                  )}
                  {validated.title && (
                    <div
                      className="text-success mt-2"
                      style={{ fontSize: "0.875rem", fontWeight: "500" }}
                    >
                      ✓ Title looks good
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Article Content</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      as="textarea"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.content}
                      isValid={validated.content}
                      placeholder="Enter article content (minimum 50 characters)"
                      rows={10}
                      disabled={loading}
                      style={{
                        borderRadius: "10px",
                        padding: "12px 16px",
                        borderColor: errors.content
                          ? "#ef4444"
                          : validated.content
                            ? "#10b981"
                            : "#e2e8f0",
                        fontSize: "1rem",
                        fontFamily: "inherit",
                        resize: "vertical",
                      }}
                    />
                  </InputGroup>
                  {errors.content && (
                    <div
                      className="text-danger mt-2"
                      style={{ fontSize: "0.875rem", fontWeight: "500" }}
                    >
                      {errors.content}
                    </div>
                  )}
                  {validated.content && (
                    <div
                      className="text-success mt-2"
                      style={{ fontSize: "0.875rem", fontWeight: "500" }}
                    >
                      ✓ Content looks good
                    </div>
                  )}
                  <Form.Text
                    className="text-muted"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Your article will be saved as draft and can be edited later.
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2 pt-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    style={{
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
                      padding: "10px 24px",
                      fontWeight: "600",
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>Create
                        Article
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/articles")}
                    disabled={loading}
                    style={{
                      borderRadius: "10px",
                      border: "2px solid #e2e8f0",
                      color: "#475569",
                      fontWeight: "600",
                      padding: "10px 24px",
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateArticle;
