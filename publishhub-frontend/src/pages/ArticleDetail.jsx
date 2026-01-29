import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { articleService, commentService, reviewService } from "../services";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import CommentHighlight from "../components/CommentHighlight";
import {
  FaArrowLeft,
  FaEdit,
  FaCheck,
  FaTimes,
  FaHistory,
  FaComment,
  FaUser,
  FaCalendarAlt,
  FaPlus,
  FaCommentAlt,
  FaExclamationTriangle,
  FaTrash,
} from "react-icons/fa";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isReviewer } = useAuth();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedText, setSelectedText] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [pendingDecision, setPendingDecision] = useState(null);

  const loadArticle = useCallback(async () => {
    try {
      const response = await articleService.getById(id);
      const articleData = response.data;
      setArticle(articleData);
      console.log("Article loaded:", articleData);
      console.log("User:", user);
      console.log(
        "Is author:",
        user?.id === articleData?.author_id ||
          user?.id === articleData?.user_id,
      );
    } catch (error) {
      setError(
        error?.data?.message || error?.message || "Failed to load article",
      );
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  const loadComments = useCallback(async () => {
    try {
      const response = await commentService.getComments(id);
      setComments(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load comments:",
        error?.data?.message || error?.message,
      );
    }
  }, [id]);

  useEffect(() => {
    loadArticle();
    loadComments();
  }, [loadArticle, loadComments]);

  const handleDeleteArticle = async () => {
    try {
      await articleService.delete(id);
      setError("Article deleted successfully!");
      setShowDeleteModal(false);
      setTimeout(() => navigate("/articles"), 1500);
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to delete article";
      setError("Failed to delete article: " + errorMessage);
      setShowDeleteModal(false);
    }
  };

  const handleSubmitArticle = async () => {
    try {
      setError("");
      await api.post(`/articles/${id}/submit`, {});
      setError("Article submitted successfully!");
      await loadArticle();
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to submit article";
      setError("Failed to submit article: " + errorMessage);
    }
  };

  const handleAddComment = async () => {
    setCommentError("");
    setCommentSuccess("");

    if (!commentText.trim()) {
      setCommentError("Please enter a comment");
      return;
    }

    try {
      await commentService.createComment(id, {
        comment_text: commentText,
        selected_text: selectedText?.text || "",
        start_position: selectedText?.startPos || 0,
        end_position: selectedText?.endPos || 0,
      });
      setCommentSuccess("Comment added successfully!");
      await loadComments();
      setCommentText("");
      setSelectedText(null);
      setTimeout(() => setShowCommentModal(false), 1500);
    } catch (error) {
      const errorData = error?.data || error?.response?.data || error;

      if (errorData?.data && typeof errorData.data === "object") {
        const errors = Object.entries(errorData.data)
          .map(
            ([field, messages]) =>
              `${field}: ${Array.isArray(messages) ? messages[0] : messages}`,
          )
          .join("\n");
        setCommentError(errors);
      } else if (errorData?.message) {
        setCommentError(`${errorData.message}`);
      } else {
        setCommentError(`${error?.message || "Failed to add comment"}`);
      }
    }
  };

  const handleSubmitReview = async (decision) => {
    if (["reject", "request_revision"].includes(decision)) {
      setPendingDecision(decision);
      setFeedbackText("");
      setShowFeedbackModal(true);
      return;
    }

    await submitReviewWithFeedback(decision, "");
  };

  const submitReviewWithFeedback = async (decision, feedback) => {
    setSubmitError("");
    setSubmittingReview(true);
    try {
      await reviewService.submitReview(id, {
        decision,
        feedback,
      });
      setError("Review submitted successfully!");
      setTimeout(() => setError(""), 3000);
      await loadArticle();
    } catch (error) {
      const errorData = error?.data || error?.response?.data || error;

      if (errorData?.data && typeof errorData.data === "object") {
        const errors = Object.entries(errorData.data)
          .map(
            ([field, messages]) =>
              `${field}: ${Array.isArray(messages) ? messages[0] : messages}`,
          )
          .join("\n");
        setSubmitError(errors);
      } else if (errorData?.message) {
        setSubmitError(`${errorData.message}`);
      } else {
        setSubmitError(`${error?.message || "Failed to submit review"}`);
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleConfirmFeedback = async () => {
    if (!feedbackText.trim() || feedbackText.length < 10) {
      setSubmitError("Feedback must be at least 10 characters");
      return;
    }
    setShowFeedbackModal(false);
    await submitReviewWithFeedback(pendingDecision, feedbackText);
  };

  const getStatusBadge = (status) => {
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

  if (loading) {
    return (
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <FaExclamationTriangle className="me-2" /> Article not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {error && (
        <Alert
          variant={error.includes("successfully") ? "success" : "danger"}
          onClose={() => setError("")}
          dismissible
          className="mb-4"
        >
          {error.includes("successfully") ? (
            <>
              <FaCheck className="me-2" /> {error}
            </>
          ) : (
            <>
              <FaExclamationTriangle className="me-2" /> {error}
            </>
          )}
        </Alert>
      )}

      {submitError && (
        <Alert
          variant="danger"
          onClose={() => setSubmitError("")}
          dismissible
          className="mb-4"
        >
          <FaExclamationTriangle className="me-2" />{" "}
          <strong>Error submitting review:</strong>
          <pre style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>
            {submitError}
          </pre>
        </Alert>
      )}

      {/* Article Header */}
      <Card
        className="shadow-lg border-0 mb-4"
        style={{ borderRadius: "14px" }}
      >
        <Card.Body className="p-5">
          <Row className="mb-4">
            <Col md={10}>
              <h1
                className="fw-bold"
                style={{ color: "#2563eb", fontSize: "2.5rem" }}
              >
                {article.title}
              </h1>
              <div className="d-flex align-items-center gap-4 mt-3">
                <p className="text-muted mb-0 d-flex align-items-center">
                  <FaUser className="me-2" />
                  <span className="fw-bold text-dark">
                    {article.author?.name}
                  </span>
                </p>
                <p className="text-muted mb-0 d-flex align-items-center">
                  <FaCalendarAlt className="me-2" />
                  Created: {new Date(article.created_at).toLocaleDateString()}
                </p>
                <p className="text-muted mb-0">Version {article.version}</p>
              </div>
            </Col>
            <Col md={2} className="text-end">
              <span
                className={`badge bg-${getStatusBadge(article.status)} px-3 py-2`}
              >
                {article.status?.replace("_", " ")}
              </span>
            </Col>
          </Row>

          {/* Action Buttons */}
          <div className="d-flex gap-2 pt-4 border-top flex-wrap">
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/articles")}
              style={{
                borderRadius: "10px",
                border: "2px solid #e2e8f0",
                fontWeight: "600",
              }}
              className="d-flex align-items-center"
            >
              <FaArrowLeft className="me-2" /> Back to Articles
            </Button>

            {(user?.id === article?.author_id ||
              user?.id === article?.user_id ||
              user?.email === article?.author?.email ||
              (user?.role === "author" &&
                article?.author?.id === user?.id)) && (
              <>
                <Button
                  variant="warning"
                  onClick={() =>
                    navigate(`/articles/${id}/edit`, { replace: true })
                  }
                  style={{
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                  }}
                  className="d-flex align-items-center"
                >
                  <FaEdit className="me-2" /> Edit Article
                </Button>

                {article?.status === "draft" && (
                  <Button
                    variant="success"
                    onClick={handleSubmitArticle}
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "600",
                    }}
                    className="d-flex align-items-center"
                  >
                    <FaCheck className="me-2" /> Submit for Review
                  </Button>
                )}

                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                  style={{
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                  }}
                  className="d-flex align-items-center"
                >
                  <FaTrash className="me-2" /> Delete Article
                </Button>
              </>
            )}

            {isReviewer && article.status === "under_review" && (
              <>
                <Button
                  variant="success"
                  onClick={() => handleSubmitReview("approve")}
                  disabled={submittingReview}
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                  }}
                  className="d-flex align-items-center"
                >
                  {submittingReview ? (
                    <>
                      <Spinner size="sm" className="me-2" /> Approving...
                    </>
                  ) : (
                    <>
                      <FaCheck className="me-2" /> Approve
                    </>
                  )}
                </Button>
                <Button
                  variant="warning"
                  onClick={() => handleSubmitReview("revision_requested")}
                  disabled={submittingReview}
                  style={{
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                  }}
                  className="d-flex align-items-center"
                >
                  <FaHistory className="me-2" /> Request Revision
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleSubmitReview("reject")}
                  disabled={submittingReview}
                  style={{
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                  }}
                  className="d-flex align-items-center"
                >
                  <FaTimes className="me-2" /> Reject
                </Button>
              </>
            )}

            {/* Admin can also add a comment */}
            {isAdmin && (
              <Button
                variant="info"
                onClick={() => setShowCommentModal(true)}
                style={{
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "600",
                }}
                className="d-flex align-items-center"
              >
                <FaComment className="me-2" /> Add Comment
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Article Content */}
      <Card
        className="shadow-lg border-0 mb-4"
        style={{ borderRadius: "14px" }}
      >
        <Card.Body className="p-5">
          <CommentHighlight article={article} comments={comments} />
        </Card.Body>
      </Card>

      {/* Comments Section */}
      {comments.length > 0 && (
        <Card className="shadow-lg border-0" style={{ borderRadius: "14px" }}>
          <Card.Body className="p-5">
            <h3 className="fw-bold mb-4" style={{ color: "#2563eb" }}>
              <FaCommentAlt className="me-2" /> Comments ({comments.length})
            </h3>
            <div className="d-flex flex-column gap-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4"
                  style={{
                    backgroundColor: "#f8fafc",
                    borderLeft: "4px solid #2563eb",
                    borderRadius: "8px",
                  }}
                >
                  <Row className="mb-2">
                    <Col md={8}>
                      <p className="fw-bold mb-1 text-dark d-flex align-items-center">
                        <FaUser className="me-2" size={14} />
                        {comment.reviewer?.name}
                      </p>
                      <p className="small text-muted mb-0 d-flex align-items-center">
                        <FaCalendarAlt className="me-2" size={12} />
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </Col>
                    <Col md={4} className="text-end">
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          backgroundColor:
                            comment.status === "pending"
                              ? "#fef3c7"
                              : "#d1fae5",
                          color:
                            comment.status === "pending"
                              ? "#7c2d12"
                              : "#065f46",
                        }}
                      >
                        {comment.status}
                      </span>
                    </Col>
                  </Row>
                  <p className="text-dark mb-2">{comment.comment_text}</p>
                  <p className="small text-muted fst-italic mb-0">
                    On: "<strong>{comment.selected_text}</strong>"
                  </p>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Comment Modal */}
      <Modal
        show={showCommentModal}
        onHide={() => {
          setShowCommentModal(false);
          setCommentError("");
          setCommentSuccess("");
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <FaComment className="me-2" /> Add Comment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {commentError && (
            <Alert
              variant="danger"
              onClose={() => setCommentError("")}
              dismissible
              className="mb-3"
            >
              <FaExclamationTriangle className="me-2" />
              <pre
                style={{
                  marginTop: "10px",
                  whiteSpace: "pre-wrap",
                  marginBottom: "0",
                }}
              >
                {commentError}
              </pre>
            </Alert>
          )}

          {commentSuccess && (
            <Alert
              variant="success"
              onClose={() => setCommentSuccess("")}
              dismissible
              className="mb-3"
            >
              <FaCheck className="me-2" /> {commentSuccess}
            </Alert>
          )}

          <Form.Group>
            <Form.Label className="fw-bold">
              Comment <span style={{ color: "#ef4444" }}>*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment here (minimum 3 characters)"
              style={{
                borderRadius: "10px",
                borderColor: commentError ? "#ef4444" : "#e2e8f0",
                padding: "12px",
                fontSize: "1rem",
              }}
            />
            <Form.Text className="text-muted d-block mt-2">
              Min 3 characters, Max 1000 characters
            </Form.Text>
          </Form.Group>

          {selectedText && (
            <div
              className="mt-3 small p-3"
              style={{
                backgroundColor: "#f0f9ff",
                borderLeft: "4px solid #2563eb",
                borderRadius: "6px",
              }}
            >
              <strong className="d-flex align-items-center">
                <FaCommentAlt className="me-2" /> Highlighting on text:
              </strong>
              <br />
              <em className="mt-2">"{selectedText.text}"</em>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCommentModal(false);
              setCommentError("");
              setCommentSuccess("");
            }}
            style={{
              borderRadius: "10px",
              fontWeight: "600",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddComment}
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              padding: "8px 20px",
            }}
            className="d-flex align-items-center"
          >
            <FaPlus className="me-2" /> Submit Comment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete <strong>{article?.title}</strong>?
          </p>
          <p className="text-muted small mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            style={{
              borderRadius: "10px",
              fontWeight: "600",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteArticle}
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
            }}
            className="d-flex align-items-center"
          >
            <FaTrash className="me-2" /> Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Feedback Modal for Reject/Request Revision */}
      <Modal
        show={showFeedbackModal}
        onHide={() => setShowFeedbackModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {pendingDecision === "reject"
              ? "Reject Article"
              : "Request Revision"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {pendingDecision === "reject"
              ? "Please provide feedback for why you are rejecting this article."
              : "Please provide feedback for the revision request."}
          </p>
          {submitError && (
            <Alert variant="danger" className="mb-3">
              {submitError}
            </Alert>
          )}
          <Form.Group>
            <Form.Label>Feedback (minimum 10 characters)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={feedbackText}
              onChange={(e) => {
                setFeedbackText(e.target.value);
                setSubmitError("");
              }}
              placeholder="Enter your feedback here..."
              className="border-2"
            />
            <Form.Text className="text-muted">
              {feedbackText.length}/1000 characters
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowFeedbackModal(false)}
            style={{
              borderRadius: "10px",
              fontWeight: "600",
            }}
          >
            Cancel
          </Button>
          <Button
            variant={pendingDecision === "reject" ? "danger" : "warning"}
            onClick={handleConfirmFeedback}
            disabled={
              !feedbackText.trim() ||
              feedbackText.length < 10 ||
              submittingReview
            }
            style={{
              borderRadius: "10px",
              fontWeight: "600",
            }}
            className="d-flex align-items-center"
          >
            {submittingReview ? "Submitting..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ArticleDetail;
