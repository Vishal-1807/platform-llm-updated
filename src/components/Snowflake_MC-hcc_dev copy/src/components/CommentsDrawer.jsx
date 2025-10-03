import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  List,
  TextField,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import apiService from "../services/apiService";

export const CommentDrawer = ({
  open,
  onClose,
  commentsType,
  documentId,
  dosId,
  dos,
  codeId = null,
  code = null,
}) => {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localComments, setLocalComments] = useState([]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const payload = { dos_id: dosId };
      if (commentsType === "icd") {
        payload["code_id"] = codeId;
      }

      const res = await apiService.fetchComments(
        documentId,
        commentsType,
        payload
      );
      if (res?.data) {
        setLocalComments(res.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open]);

  const handleSubmit = async () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const payload = {
        dos_id: dosId,
        comment_text: trimmed,
      };

      if (commentsType === "icd") {
        payload["code_id"] = codeId;
      }

      const res = await apiService.addComments(
        documentId,
        commentsType,
        payload
      );

      if (res?.success) {
        setSubmitting(false);
        // Refetch entire comment list
        await fetchComments();
        setNewComment("");
      }
    } catch (err) {
      setSubmitting(false);
      console.error("Failed to submit comment:", err);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 500,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          zIndex: 1001,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            px: 2,
            py: 1,
            borderRadius: 0,
            borderBottom: "1px solid #c5c5c5",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: "19px" }}
            >
              {commentsType.toUpperCase()} Comments
            </Typography>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              size="small"
              sx={{ mr: 1 }}
            >
              <X size={18} color="#4400ff" strokeWidth={2.5} />
            </IconButton>
          </Box>
          <Box sx={{ fontSize: "11px", color: "#666" }}>
            <Box>DOS: {new Date(dos).toLocaleDateString("en-US")}</Box>
            {code && <Box>ICD Code: {code}</Box>}
          </Box>
        </Box>

        {/* Comment List */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            px: 2,
            py: 1,
            backgroundColor: "#fafafa",
          }}
        >
          <List>
            {localComments.length > 0 ? (
              localComments.map((comment, idx) => (
                <Box
                  key={comment.comment_id || idx}
                  sx={{
                    background: "#f1f1f1",
                    borderRadius: 1.5,
                    py: 1,
                    px: 2,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11px",
                      color: "#666",
                    }}
                  >
                    <Box sx={{ fontWeight: 400, textTransform: "capitalize" }}>
                      {comment.added_by}
                    </Box>
                    <Box sx={{ fontWeight: 400 }}>
                      {new Date(comment.timestamp).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </Box>
                  </Box>
                  <Box>{comment.text}</Box>
                </Box>
              ))
            ) : (
              <>
                {!loading && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontStyle: "italic", textAlign: "center", py: 2 }}
                  >
                    No comments yet.
                  </Typography>
                )}
              </>
            )}

            {loading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 1,
                }}
              >
                <CircularProgress size={20} />
                <Typography variant="caption" sx={{ ml: 1 }}>
                  Fetching comments...
                </Typography>
              </Box>
            )}

            {submitting && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 1,
                }}
              >
                <CircularProgress size={20} />
                <Typography variant="caption" sx={{ ml: 1 }}>
                  Adding comment...
                </Typography>
              </Box>
            )}
          </List>
        </Box>

        {/* Input */}
        <Box
          sx={{
            borderTop: "1px solid #e0e0e0",
            px: 2,
            py: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: "#fff",
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment..."
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={submitting}
          />
          <IconButton
            onClick={handleSubmit}
            disabled={submitting || !newComment.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};
