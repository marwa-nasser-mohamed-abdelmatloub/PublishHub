import { useState, useMemo } from "react";

const CommentHighlight = ({ article, comments = [] }) => {
  const [selectedText, setSelectedText] = useState("");
  const [hoveredComment, setHoveredComment] = useState(null);

  const highlights = useMemo(() => {
    if (!comments.length) return {};

    const newHighlights = {};
    comments.forEach((comment) => {
      if (comment.start_position && comment.end_position) {
        newHighlights[`${comment.start_position}-${comment.end_position}`] =
          comment;
      }
    });
    return newHighlights;
  }, [comments]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(
        document.querySelector(".article-content"),
      );
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      const startPosition =
        preCaretRange.toString().length - selection.toString().length;
      const endPosition = startPosition + selection.toString().length;

      setSelectedText({
        text: selection.toString(),
        startPos: startPosition,
        endPos: endPosition,
      });
    }
  };

  const renderContentWithHighlights = () => {
    let content = article.content;
    let offset = 0;

    const sortedHighlights = Object.entries(highlights).sort(
      (a, b) => parseInt(a[0].split("-")[0]) - parseInt(b[0].split("-")[0]),
    );

    return sortedHighlights.reduce((rendered, [key, comment], index) => {
      const [start, end] = key.split("-").map(Number);
      const before = content.substring(offset, start);
      const highlighted = content.substring(start, end);
      offset = end;

      return (
        <span key={index}>
          {rendered}
          {before}
          <span
            className="highlight"
            style={{
              position: "relative",
              display: "inline-block",
            }}
            onMouseEnter={() => setHoveredComment(comment)}
            onMouseLeave={() => setHoveredComment(null)}
          >
            {highlighted}
            {hoveredComment?.id === comment.id && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "100%",
                  marginTop: "8px",
                  backgroundColor: "#1e293b",
                  color: "white",
                  padding: "12px",
                  borderRadius: "8px",
                  boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
                  fontSize: "0.875rem",
                  maxWidth: "300px",
                  zIndex: 1000,
                  wordWrap: "break-word",
                }}
              >
                <p
                  style={{
                    fontWeight: "600",
                    marginBottom: "6px",
                    margin: 0,
                  }}
                >
                  {comment.reviewer?.name || "Reviewer"}
                </p>
                <p style={{ margin: 0, lineHeight: "1.5" }}>
                  {comment.comment_text}
                </p>
              </div>
            )}
          </span>
        </span>
      );
    }, null);
  };

  return (
    <div>
      <div
        className="article-content"
        style={{
          backgroundColor: "#f8fafc",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          marginBottom: "16px",
          minHeight: "384px",
          lineHeight: "1.8",
          fontSize: "1rem",
          color: "#0f172a",
        }}
        onMouseUp={handleTextSelection}
      >
        {renderContentWithHighlights()}
      </div>

      {selectedText && (
        <div
          style={{
            backgroundColor: "#dbeafe",
            padding: "16px",
            borderRadius: "10px",
            border: "1px solid #bfdbfe",
            marginTop: "16px",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "#475569",
              marginBottom: "12px",
            }}
          >
            Selected: "<strong>{selectedText.text}</strong>"
          </p>
          <button
            onClick={() => {
              console.log("Add comment for:", selectedText);
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1e40af";
              e.target.style.boxShadow = "0 6px 16px rgba(37, 99, 235, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#2563eb";
              e.target.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
            }}
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentHighlight;
