import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { articleService, commentService, reviewService } from "../services";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
  Form,
  InputGroup,
  ProgressBar,
  Modal,
  Nav,
} from "react-bootstrap";
import {
  FaPenAlt,
  FaEye,
  FaUser,
  FaCalendarAlt,
  FaCommentDots,
  FaTrash,
  FaArrowUp,
  FaPalette,
  FaTimes,
  FaHighlighter,
  FaQuoteLeft,
  FaSave,
  FaShare,
  FaDownload,
  FaPrint,
  FaStickyNote,
  FaFilter,
  FaSort,
  FaStar,
  FaEdit,
  FaPaperPlane,
  FaFileAlt,
  FaChartBar,
  FaClock,
  FaExclamationTriangle,
  FaLink,
  FaSearch,
  FaExpand,
  FaCompress,
  FaFont,
  FaBold,
  FaItalic,
  FaUnderline,
  FaEraser,
  FaHeart,
  FaLeaf,
  FaArrowLeft,
  FaCheckCircle,
  FaHourglassHalf,
  FaFlag,
  FaBookOpen,
  FaRegComment,
  FaTag,
  FaThumbsUp,
  FaThumbsDown,
  FaRegStar,
} from "react-icons/fa";

const ArticleReviewView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [startPos, setStartPos] = useState(null);
  const [endPos, setEndPos] = useState(null);
  const [highlightColor, setHighlightColor] = useState("#FFD700");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeCommentTab, setActiveCommentTab] = useState("all");
  const [searchComment, setSearchComment] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fullscreen, setFullscreen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [reviewDecision, setReviewDecision] = useState("");
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewStats, setReviewStats] = useState(null);
  const contentRef = useRef(null);

  const highlightColors = [
    { color: "#FFD700", name: "Gold", icon: <FaStar /> },
    { color: "#FF6B6B", name: "Coral", icon: <FaHeart /> },
    { color: "#4ECDC4", name: "Turquoise", icon: <FaPalette /> },
    { color: "#45B7D1", name: "Sky Blue", icon: <FaEye /> },
    { color: "#96CEB4", name: "Mint", icon: <FaLeaf /> },
    { color: "#FFEAA7", name: "Light Yellow", icon: <FaHighlighter /> },
  ];

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        setLoading(true);
        const [articleRes, commentsRes] = await Promise.all([
          articleService.getById(id),
          commentService.getComments(id),
        ]);

        setArticle(articleRes.data);
        setComments(commentsRes.data || []);

        if (user?.role === "reviewer" || user?.role === "admin") {
          try {
            const statsRes = await reviewService.getReviewStats(id);
            setReviewStats(statsRes.data);
          } catch (error) {
            console.log("No review stats available:", error);
          }
        }

        setError("");
      } catch (fetchError) {
        setError("Failed to load article data");
        console.error("Error fetching article:", fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [id, user]);

  const handleTextSelection = () => {
    if (!contentRef.current) return;

    const selection = window.getSelection();
    const selected = selection.toString().trim();

    if (selected.length > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();

      preCaretRange.selectNodeContents(contentRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);

      const start = preCaretRange.toString().length - selected.length;
      const end = start + selected.length;

      setSelectedText(selected);
      setStartPos(start);
      setEndPos(end);
    }
  };

  const handleAddComment = async () => {
    if (!selectedText.trim() || !commentText.trim()) {
      setError("Please select text and enter a comment");
      return;
    }

    if (!user || (user.role !== "reviewer" && user.role !== "admin")) {
      setError("Only reviewers and admins can add comments");
      return;
    }

    try {
      const response = await commentService.createComment(id, {
        selected_text: selectedText,
        comment_text: commentText,
        start_position: startPos,
        end_position: endPos,
        highlight_color: highlightColor,
        reviewer_id: user.id,
        article_id: parseInt(id),
      });

      setComments([...comments, response.data]);
      setSelectedText("");
      setCommentText("");
      setStartPos(null);
      setEndPos(null);
      setError("");
      setSuccess("Comment added successfully!");

      setTimeout(() => setSuccess(""), 3000);
      window.getSelection().removeAllRanges();
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to add comment";
      setError(errorMessage);
      console.error("Error adding comment:", error);
    }
  };

  const renderHighlightedContent = () => {
    if (!article?.content) return article?.content || "";

    let content = article.content;
    const sortedComments = [...comments].sort(
      (a, b) => b.start_position - a.start_position,
    );

    sortedComments.forEach((comment) => {
      const { start_position, end_position, highlight_color, id } = comment;

      if (
        start_position >= 0 &&
        end_position <= content.length &&
        start_position < end_position
      ) {
        const before = content.substring(0, start_position);
        const highlighted = content.substring(start_position, end_position);
        const after = content.substring(end_position);

        content = `${before}<span 
          class="highlighted-text" 
          data-comment-id="${id}"
          style="
            background: ${highlight_color || "#FFD700"};
            color: #000;
            padding: 2px 4px;
            border-radius: 4px;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
            border: 1px solid rgba(0,0,0,0.1);
            font-weight: 500;
          "
          onmouseenter="this.style.boxShadow='0 0 0 2px ${highlight_color || "#FFD700"}40'"
          onmouseleave="this.style.boxShadow='none'"
        >${highlighted}</span>${after}`;
      }
    });

    return content;
  };

  const handleCommentClick = (commentId) => {
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      const element = document.querySelector(
        `[data-comment-id="${commentId}"]`,
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.style.animation = "highlightPulse 0.8s ease-in-out";
        setTimeout(() => (element.style.animation = ""), 800);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await commentService.deleteComment(id, commentId);
      setComments(comments.filter((c) => c.id !== commentId));
      setSuccess("Comment deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to delete comment";
      setError(errorMessage);
      console.error("Error deleting comment:", error);
    }
  };

  const handleResolveComment = async (commentId) => {
    try {
      await commentService.updateComment(id, commentId, { status: "resolved" });
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, status: "resolved" } : c,
        ),
      );
      setSuccess("Comment marked as resolved!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to update comment";
      setError(errorMessage);
      console.error("Error updating comment:", error);
    }
  };

  const clearSelection = () => {
    window.getSelection().removeAllRanges();
    setSelectedText("");
    setCommentText("");
    setStartPos(null);
    setEndPos(null);
  };

  const handleSubmitReview = async () => {
    try {
      const response = await reviewService.submitReview(id, {
        decision: reviewDecision,
        feedback: reviewFeedback,
      });

      if (response.success) {
        setSuccess("Review submitted successfully!");
        setTimeout(() => {
          navigate("/review-assignments");
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to submit review";
      setError(errorMessage);
    }
  };

  const filteredComments = comments.filter((comment) => {
    if (searchComment) {
      return (
        comment.comment_text
          .toLowerCase()
          .includes(searchComment.toLowerCase()) ||
        comment.selected_text
          .toLowerCase()
          .includes(searchComment.toLowerCase())
      );
    }

    if (activeCommentTab === "my" && user) {
      return comment.reviewer_id === user.id;
    }

    if (activeCommentTab === "pending") {
      return comment.status === "pending";
    }

    if (activeCommentTab === "resolved") {
      return comment.status === "resolved";
    }

    return true;
  });

  const stats = {
    total: comments.length,
    myComments: comments.filter((c) => user && c.reviewer_id === user.id)
      .length,
    pending: comments.filter((c) => c.status === "pending").length,
    resolved: comments.filter((c) => c.status === "resolved").length,
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return {
          variant: "success",
          text: "Published",
          icon: <FaCheckCircle />,
        };
      case "under_review":
        return {
          variant: "info",
          text: "Under Review",
          icon: <FaHourglassHalf />,
        };
      case "draft":
        return { variant: "secondary", text: "Draft", icon: <FaFileAlt /> };
      case "revisions_requested":
        return {
          variant: "warning",
          text: "Revisions Requested",
          icon: <FaEdit />,
        };
      default:
        return { variant: "secondary", text: status };
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fs-5">
            <FaClock className="me-2" />
            Loading article for review...
          </p>
        </div>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container className="py-5">
        <Card
          className="shadow-lg border-0 text-center"
          style={{ borderRadius: "14px" }}
        >
          <Card.Body className="py-5">
            <FaExclamationTriangle className="text-danger mb-4" size={64} />
            <h2 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
              Article Not Found
            </h2>
            <p className="text-muted fs-5 mb-4">
              The article you're looking for doesn't exist or you don't have
              access to review it.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate("/review-assignments")}
              className="px-4 py-2"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
              }}
            >
              <FaArrowLeft className="me-2" />
              Back to Assignments
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const statusBadge = getStatusBadge(article.status);

  return (
    <Container fluid className="py-4 px-lg-5">
      {/* Header Section */}
      <Card
        className="shadow-lg border-0 mb-4"
        style={{ borderRadius: "14px" }}
      >
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <div className="d-flex align-items-center mb-3">
                <Button
                  variant="outline-primary"
                  onClick={() => navigate("/review-assignments")}
                  className="me-3 d-flex align-items-center"
                  style={{ borderRadius: "10px" }}
                >
                  <FaArrowLeft className="me-2" />
                  Back
                </Button>
                <h1 className="fw-bold mb-0" style={{ color: "#2563eb" }}>
                  <FaBookOpen className="me-3" />
                  Article Review
                </h1>
              </div>

              <h2 className="fw-bold mb-3" style={{ color: "#1e293b" }}>
                {article.title}
              </h2>

              <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center">
                  <FaUser className="text-muted me-2" />
                  <span className="text-muted">
                    <strong>Author:</strong> {article.author?.name || "Unknown"}
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <FaCalendarAlt className="text-muted me-2" />
                  <span className="text-muted">
                    <strong>Submitted:</strong>{" "}
                    {new Date(article.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <Badge
                  bg={statusBadge.variant}
                  className="d-flex align-items-center px-3 py-2"
                  style={{ borderRadius: "20px" }}
                >
                  {statusBadge.icon}
                  <span className="ms-2">{statusBadge.text}</span>
                </Badge>
              </div>

              {article.keywords && (
                <div className="d-flex flex-wrap gap-2">
                  {article.keywords.split(",").map((keyword, index) => (
                    <Badge
                      key={index}
                      bg="light"
                      text="dark"
                      className="px-3 py-1"
                      style={{ borderRadius: "20px" }}
                    >
                      <FaTag className="me-1" size={12} />
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="d-flex flex-column align-items-end">
              <div className="d-flex gap-2 mb-3">
                <Button
                  variant="outline-primary"
                  className="d-flex align-items-center"
                  style={{ borderRadius: "10px" }}
                >
                  <FaDownload className="me-2" />
                  Download
                </Button>
                <Button
                  variant="outline-secondary"
                  className="d-flex align-items-center"
                  style={{ borderRadius: "10px" }}
                >
                  <FaPrint className="me-2" />
                  Print
                </Button>
                <Button
                  variant={fullscreen ? "secondary" : "outline-secondary"}
                  onClick={() => setFullscreen(!fullscreen)}
                  className="d-flex align-items-center"
                  style={{ borderRadius: "10px" }}
                >
                  {fullscreen ? (
                    <FaCompress className="me-2" />
                  ) : (
                    <FaExpand className="me-2" />
                  )}
                  {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </Button>
              </div>

              <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2">
                <FaFont className="text-muted me-2" />
                <Button
                  variant="link"
                  className="text-decoration-none p-0"
                  onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                >
                  A
                </Button>
                <span className="mx-2 fw-bold">{fontSize}px</span>
                <Button
                  variant="link"
                  className="text-decoration-none p-0"
                  onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                >
                  A
                </Button>
              </div>
            </div>
          </div>

          {/* Review Progress */}
          {reviewStats && (
            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Review Progress</span>
                <span className="text-muted fw-bold">75%</span>
              </div>
              <ProgressBar
                now={75}
                variant="info"
                style={{ height: "8px", borderRadius: "4px" }}
                className="mb-3"
              />
              <div className="d-flex justify-content-between text-muted small">
                <span>Time spent: 2h 30m</span>
                <span>Comments: {stats.total}</span>
                <span>Words reviewed: {article.content?.length || 0}</span>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {error && (
        <Alert
          variant="danger"
          onClose={() => setError("")}
          dismissible
          className="mb-4"
          style={{ borderRadius: "10px" }}
        >
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          onClose={() => setSuccess("")}
          dismissible
          className="mb-4"
          style={{ borderRadius: "10px" }}
        >
          <FaCheckCircle className="me-2" />
          {success}
        </Alert>
      )}

      <Row className="g-4">
        {/* Article Content - Left Column */}
        <Col lg={8}>
          <Card
            className="shadow-lg border-0 h-100"
            style={{ borderRadius: "14px" }}
          >
            <Card.Body className="p-4">
              {/* Content Toolbar */}
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div className="d-flex gap-2">
                  <Button
                    variant="light"
                    className="d-flex align-items-center"
                    style={{ borderRadius: "8px" }}
                  >
                    <FaBold className="me-1" />
                  </Button>
                  <Button
                    variant="light"
                    className="d-flex align-items-center"
                    style={{ borderRadius: "8px" }}
                  >
                    <FaItalic className="me-1" />
                  </Button>
                  <Button
                    variant="light"
                    className="d-flex align-items-center"
                    style={{ borderRadius: "8px" }}
                  >
                    <FaUnderline className="me-1" />
                  </Button>
                  <div className="vr mx-2"></div>
                  <Button
                    variant="light"
                    className="d-flex align-items-center"
                    style={{ borderRadius: "8px" }}
                  >
                    <FaHighlighter className="me-1" />
                    Highlight
                  </Button>
                </div>

                <div className="d-flex align-items-center">
                  <FaRegComment className="text-primary me-2" />
                  <span className="text-muted">
                    {selectedText
                      ? `${selectedText.length} chars selected`
                      : "Select text to add comment"}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div
                ref={contentRef}
                onMouseUp={handleTextSelection}
                className="article-content"
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: "1.8",
                  minHeight: "600px",
                }}
                dangerouslySetInnerHTML={{
                  __html: renderHighlightedContent(),
                }}
              />
            </Card.Body>
          </Card>

          {/* Comment Input Section */}
          {(user?.role === "reviewer" || user?.role === "admin") && (
            <Card
              className="shadow-lg border-0 mt-4"
              style={{ borderRadius: "14px" }}
            >
              <Card.Body className="p-4">
                <h4
                  className="fw-bold mb-4 d-flex align-items-center"
                  style={{ color: "#2563eb" }}
                >
                  <FaRegComment className="me-3" />
                  Add Comment
                </h4>

                {selectedText && (
                  <Alert
                    variant="warning"
                    className="mb-4"
                    style={{ borderRadius: "10px" }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-start">
                        <FaQuoteLeft className="me-3 mt-1" />
                        <div>
                          <h6 className="fw-bold mb-2">Selected Text</h6>
                          <p className="mb-0 fst-italic">"{selectedText}"</p>
                        </div>
                      </div>
                      <Button
                        variant="link"
                        onClick={clearSelection}
                        className="p-0"
                      >
                        <FaTimes />
                      </Button>
                    </div>
                  </Alert>
                )}

                <Form>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold d-flex align-items-center">
                      <FaPenAlt className="me-2" />
                      Your Comment
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Type your comment here... Provide constructive feedback."
                      style={{ borderRadius: "10px" }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold d-flex align-items-center">
                      <FaPalette className="me-2" />
                      Highlight Color
                    </Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {highlightColors.map((color) => (
                        <Button
                          key={color.color}
                          variant="light"
                          onClick={() => setHighlightColor(color.color)}
                          className={`d-flex align-items-center px-3 py-2 ${highlightColor === color.color ? "border border-primary" : ""}`}
                          style={{
                            borderRadius: "8px",
                            backgroundColor: `${color.color}20`,
                          }}
                        >
                          <div
                            className="rounded-circle me-2"
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: color.color,
                              border: "1px solid #dee2e6",
                            }}
                          />
                          <span className="fw-medium">{color.name}</span>
                          <span className="ms-2">{color.icon}</span>
                        </Button>
                      ))}
                    </div>
                  </Form.Group>

                  <div className="d-flex gap-3 pt-3 border-top">
                    <Button
                      variant="primary"
                      onClick={handleAddComment}
                      disabled={!selectedText || !commentText}
                      className="px-4 py-2 d-flex align-items-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "600",
                      }}
                    >
                      <FaSave className="me-2" />
                      Add Comment
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={clearSelection}
                      className="px-4 py-2 d-flex align-items-center"
                      style={{ borderRadius: "10px" }}
                    >
                      <FaEraser className="me-2" />
                      Clear
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Comments Sidebar - Right Column */}
        <Col lg={4}>
          <div className="sticky-top" style={{ top: "20px" }}>
            {/* Stats Cards */}
            <Row className="g-3 mb-4">
              <Col xs={6}>
                <Card
                  className="border-0 text-center h-100"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    borderRadius: "12px",
                  }}
                >
                  <Card.Body className="p-3 text-white">
                    <FaCommentDots size={24} className="mb-2" />
                    <h4 className="fw-bold mb-1">{stats.total}</h4>
                    <p className="mb-0 small opacity-90">Total Comments</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6}>
                <Card
                  className="border-0 text-center h-100"
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #047857 100%)",
                    borderRadius: "12px",
                  }}
                >
                  <Card.Body className="p-3 text-white">
                    <FaUser size={24} className="mb-2" />
                    <h4 className="fw-bold mb-1">{stats.myComments}</h4>
                    <p className="mb-0 small opacity-90">My Comments</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6}>
                <Card
                  className="border-0 text-center h-100"
                  style={{
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    borderRadius: "12px",
                  }}
                >
                  <Card.Body className="p-3 text-white">
                    <FaClock size={24} className="mb-2" />
                    <h4 className="fw-bold mb-1">{stats.pending}</h4>
                    <p className="mb-0 small opacity-90">Pending</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6}>
                <Card
                  className="border-0 text-center h-100"
                  style={{
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                    borderRadius: "12px",
                  }}
                >
                  <Card.Body className="p-3 text-white">
                    <FaCheckCircle size={24} className="mb-2" />
                    <h4 className="fw-bold mb-1">{stats.resolved}</h4>
                    <p className="mb-0 small opacity-90">Resolved</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Comments Section */}
            <Card
              className="shadow-lg border-0 mb-4"
              style={{ borderRadius: "14px" }}
            >
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5
                    className="fw-bold mb-0 d-flex align-items-center"
                    style={{ color: "#2563eb" }}
                  >
                    <FaStickyNote className="me-3" />
                    Comments
                  </h5>
                  <div className="d-flex gap-2">
                    <Button
                      variant="light"
                      size="sm"
                      style={{ borderRadius: "8px" }}
                    >
                      <FaFilter />
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      style={{ borderRadius: "8px" }}
                    >
                      <FaSort />
                    </Button>
                  </div>
                </div>

                {/* Search */}
                <InputGroup className="mb-4">
                  <InputGroup.Text style={{ borderRadius: "10px 0 0 10px" }}>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search comments..."
                    value={searchComment}
                    onChange={(e) => setSearchComment(e.target.value)}
                    style={{ borderRadius: "0 10px 10px 0" }}
                  />
                </InputGroup>

                {/* Tabs */}
                <Nav
                  variant="pills"
                  className="mb-4"
                  activeKey={activeCommentTab}
                >
                  {[
                    { key: "all", label: "All", count: stats.total },
                    { key: "my", label: "My", count: stats.myComments },
                    { key: "pending", label: "Pending", count: stats.pending },
                    {
                      key: "resolved",
                      label: "Resolved",
                      count: stats.resolved,
                    },
                  ].map((tab) => (
                    <Nav.Item key={tab.key}>
                      <Nav.Link
                        eventKey={tab.key}
                        onClick={() => setActiveCommentTab(tab.key)}
                        className="rounded-pill px-3 py-2 me-2"
                      >
                        {tab.label}
                        {tab.count > 0 && (
                          <Badge bg="light" text="dark" className="ms-2">
                            {tab.count}
                          </Badge>
                        )}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>

                {/* Comments List */}
                <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                  {filteredComments.length === 0 ? (
                    <div className="text-center py-5">
                      <FaCommentDots size={48} className="text-muted mb-3" />
                      <p className="text-muted">No comments found</p>
                      <p className="text-muted small">
                        Select text in the article to add your first comment
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredComments.map((comment) => (
                        <Card
                          key={comment.id}
                          className="border-0 shadow-sm hover-shadow"
                          style={{ borderRadius: "10px" }}
                        >
                          <Card.Body className="p-3">
                            {/* Comment Header */}
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div className="d-flex align-items-center">
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center me-2 text-white fw-bold"
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    backgroundColor:
                                      comment.highlight_color || "#FFD700",
                                  }}
                                >
                                  {comment.reviewer?.name?.charAt(0) || "R"}
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-0">
                                    {comment.reviewer?.name || "Anonymous"}
                                  </h6>
                                  <small className="text-muted">
                                    <FaClock className="me-1" />
                                    {new Date(
                                      comment.created_at,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </small>
                                </div>
                              </div>
                              <div className="d-flex gap-1">
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 text-primary"
                                  onClick={() => handleCommentClick(comment.id)}
                                  title="Show in article"
                                >
                                  <FaLink />
                                </Button>
                                {(user?.id === comment.reviewer_id ||
                                  user?.role === "admin") && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 text-danger"
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    title="Delete comment"
                                  >
                                    <FaTrash />
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Comment Content */}
                            <div className="mb-3">
                              <p className="mb-2">{comment.comment_text}</p>
                              {comment.selected_text && (
                                <div
                                  className="p-2 rounded"
                                  style={{
                                    backgroundColor: `${comment.highlight_color || "#FFD700"}20`,
                                    borderLeft: `3px solid ${comment.highlight_color || "#FFD700"}`,
                                  }}
                                >
                                  <small className="text-muted d-block mb-1">
                                    <FaQuoteLeft className="me-1" />
                                    Referenced text
                                  </small>
                                  <small className="fst-italic">
                                    "{comment.selected_text}"
                                  </small>
                                </div>
                              )}
                            </div>

                            {/* Comment Footer */}
                            <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                              <div className="d-flex align-items-center">
                                <div
                                  className="rounded-circle me-2"
                                  style={{
                                    width: "12px",
                                    height: "12px",
                                    backgroundColor:
                                      comment.highlight_color || "#FFD700",
                                    border: "1px solid #dee2e6",
                                  }}
                                />
                                <Badge
                                  bg={
                                    comment.status === "resolved"
                                      ? "success"
                                      : "warning"
                                  }
                                  className="rounded-pill"
                                >
                                  {comment.status === "resolved"
                                    ? "Resolved"
                                    : "Pending"}
                                </Badge>
                              </div>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 text-decoration-none"
                                onClick={() =>
                                  comment.status !== "resolved" &&
                                  handleResolveComment(comment.id)
                                }
                              >
                                {comment.status === "resolved" ? (
                                  <FaCheckCircle className="text-success" />
                                ) : (
                                  <FaFlag className="text-warning" />
                                )}
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Quick Actions */}
            <Card
              className="shadow-lg border-0"
              style={{ borderRadius: "14px" }}
            >
              <Card.Body className="p-4">
                <h5
                  className="fw-bold mb-4 d-flex align-items-center"
                  style={{ color: "#2563eb" }}
                >
                  <FaChartBar className="me-3" />
                  Review Actions
                </h5>
                <div className="d-grid gap-3">
                  <Button
                    variant="success"
                    className="d-flex justify-content-between align-items-center py-3"
                    style={{ borderRadius: "10px" }}
                    onClick={() => {
                      setReviewDecision("approve");
                      setShowSubmitModal(true);
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle p-2 bg-success bg-opacity-25 me-3">
                        <FaThumbsUp className="text-success" />
                      </div>
                      <div className="text-start">
                        <div className="fw-bold">Approve Article</div>
                        <div className="small text-white text-opacity-75">
                          Recommend for publication
                        </div>
                      </div>
                    </div>
                    <FaArrowUp className="text-white text-opacity-75" />
                  </Button>

                  <Button
                    variant="warning"
                    className="d-flex justify-content-between align-items-center py-3"
                    style={{ borderRadius: "10px" }}
                    onClick={() => {
                      setReviewDecision("revisions");
                      setShowSubmitModal(true);
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle p-2 bg-warning bg-opacity-25 me-3">
                        <FaEdit className="text-warning" />
                      </div>
                      <div className="text-start">
                        <div className="fw-bold">Request Revisions</div>
                        <div className="small text-white text-opacity-75">
                          Minor/major changes needed
                        </div>
                      </div>
                    </div>
                    <FaArrowUp className="text-white text-opacity-75" />
                  </Button>

                  <Button
                    variant="danger"
                    className="d-flex justify-content-between align-items-center py-3"
                    style={{ borderRadius: "10px" }}
                    onClick={() => {
                      setReviewDecision("reject");
                      setShowSubmitModal(true);
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle p-2 bg-danger bg-opacity-25 me-3">
                        <FaThumbsDown className="text-danger" />
                      </div>
                      <div className="text-start">
                        <div className="fw-bold">Reject Article</div>
                        <div className="small text-white text-opacity-75">
                          Does not meet criteria
                        </div>
                      </div>
                    </div>
                    <FaArrowUp className="text-white text-opacity-75" />
                  </Button>
                </div>

                {/* Rating Section */}
                <div className="mt-4 pt-4 border-top">
                  <h6 className="fw-bold mb-3">Overall Rating</h6>
                  <div className="d-flex justify-content-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="link"
                        className="p-0 me-1"
                        onClick={() => setRating(star)}
                      >
                        {star <= rating ? (
                          <FaStar className="text-warning" size={24} />
                        ) : (
                          <FaRegStar className="text-muted" size={24} />
                        )}
                      </Button>
                    ))}
                  </div>
                  <div className="text-center text-muted small">
                    {rating === 0
                      ? "Click stars to rate"
                      : rating === 5
                        ? "Excellent"
                        : rating === 4
                          ? "Good"
                          : rating === 3
                            ? "Average"
                            : rating === 2
                              ? "Poor"
                              : "Very Poor"}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Floating Actions */}
      <div className="position-fixed bottom-4 end-4 d-flex flex-column gap-2 z-3">
        <Button
          variant="primary"
          className="rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: "56px", height: "56px" }}
          onClick={() => setShowSubmitModal(true)}
        >
          <FaPaperPlane size={20} />
        </Button>
        <Button
          variant="info"
          className="rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: "56px", height: "56px" }}
        >
          <FaSave size={20} />
        </Button>
        <Button
          variant="secondary"
          className="rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: "56px", height: "56px" }}
        >
          <FaShare size={20} />
        </Button>
      </div>

      {/* Submit Review Modal */}
      <Modal
        show={showSubmitModal}
        onHide={() => setShowSubmitModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold" style={{ color: "#2563eb" }}>
            <FaPaperPlane className="me-3" />
            Submit Review
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Review Decision</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  name="decision"
                  label="Approve"
                  checked={reviewDecision === "approve"}
                  onChange={() => setReviewDecision("approve")}
                  className="p-3 border rounded"
                  style={{ borderRadius: "10px" }}
                />
                <Form.Check
                  type="radio"
                  name="decision"
                  label="Request Revisions"
                  checked={reviewDecision === "revisions"}
                  onChange={() => setReviewDecision("revisions")}
                  className="p-3 border rounded"
                  style={{ borderRadius: "10px" }}
                />
                <Form.Check
                  type="radio"
                  name="decision"
                  label="Reject"
                  checked={reviewDecision === "reject"}
                  onChange={() => setReviewDecision("reject")}
                  className="p-3 border rounded"
                  style={{ borderRadius: "10px" }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Overall Feedback</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                placeholder="Provide overall feedback to the author..."
                style={{ borderRadius: "10px" }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold d-flex align-items-center justify-content-between">
                <span>Rating: {rating}/5</span>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="link"
                      className="p-0 me-1"
                      onClick={() => setRating(star)}
                    >
                      {star <= rating ? (
                        <FaStar className="text-warning" />
                      ) : (
                        <FaRegStar className="text-muted" />
                      )}
                    </Button>
                  ))}
                </div>
              </Form.Label>
              <ProgressBar
                now={(rating / 5) * 100}
                variant={
                  rating >= 4 ? "success" : rating >= 3 ? "warning" : "danger"
                }
                style={{ height: "8px", borderRadius: "4px" }}
              />
            </Form.Group>

            <div className="alert alert-info" style={{ borderRadius: "10px" }}>
              <FaExclamationTriangle className="me-2" />
              <strong>Note:</strong> Once submitted, your review cannot be
              edited. You have added {stats.total} comments to this article.
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="outline-secondary"
            onClick={() => setShowSubmitModal(false)}
            style={{ borderRadius: "10px" }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitReview}
            disabled={!reviewDecision || !reviewFeedback}
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              padding: "10px 30px",
            }}
          >
            <FaPaperPlane className="me-2" />
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx global>{`
        .article-content {
          font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif;
        }

        .highlighted-text {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .highlighted-text:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }

        @keyframes highlightPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
          }
        }

        .hover-shadow {
          transition: all 0.3s ease;
        }

        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1) !important;
        }

        .space-y-3 > * + * {
          margin-top: 1rem;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </Container>
  );
};

export default ArticleReviewView;
