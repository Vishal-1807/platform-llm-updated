// components/CodeSection.js
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { Check, MessageCircleMore, RotateCcw, Trash2, X } from "lucide-react";
import { useState } from "react";
import { CommentDrawer } from "./CommentsDrawer";
import MEATCriteria from "./MEATCriteria";

export const IcdCodeView = ({
  dos_item,
  dIdx,
  code,
  activeTab,
  index,
  documentId,
  onDeleteCode,
  approveOrRejectIcd,
  selectedSentence,
  onSelectSentence,
}) => {
  const [loading, setLoading] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  // Function to truncate description with ellipses
  const truncateDescription = (description, maxLength = 60) => {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  const handleDeleteCode = async (code) => {
    setLoading(true);
    try {
      await onDeleteCode(dos_item.dos_id, code.code_id);
    } catch (error) {
      console.error("Error deleting code:", error);
    } finally {
      setLoading(false);
    }
  };

  const hccKeyMap = {
    cmshccv24: "v24",
    cmshccv28: "v28",
    rxhcc: "rhcc",
  };

  return (
    <Box>
      <Accordion
        key={`icd_code-${activeTab}-${index}`}
        sx={{
          mb: 1,
          border: `1px solid #e4e4e4`,
          borderRadius: "6px",
          boxShadow: "none",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-content-${activeTab}-${index}`}
          id={`panel-header-${activeTab}-${index}`}
          sx={{
            background: "#eef2ff",
            "& .MuiAccordionSummary-content": {
              alignItems: "center",
              justifyContent: "space-between",
            },
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            fontSize={14.5}
            sx={{ flex: 1, mr: 1 }}
          >
            {code.code}
            {code.description && (
              <span
                style={{
                  fontWeight: "normal",
                  color: "#666",
                  marginLeft: 2,
                }}
              >
                ({truncateDescription(code.description)})
              </span>
            )}
            <Chip
              label={code.added_by}
              size="small"
              variant="filled"
              sx={{
                background: code.added_by !== "AI" ? "#fef9c3" : "#dcfce7",
                color: code.added_by !== "AI" ? "#92400e" : "#166534",
                height: 28,
                textTransform: "capitalize",
                mx: 1,
                px: 0.5,
                py: 0,
                fontSize: "0.75rem",
              }}
            />
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderLeft: "1px solid #c5c5c5",
              gap: 1,
              pl: 1,
              ml: 1,
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setCommentDialogOpen(true);
              }}
              size="small"
              label="Comments"
              disabled={loading}
            >
              <MessageCircleMore size={16} color="#4400ff" strokeWidth={2.5} />
            </IconButton>
            {activeTab !== "approved" && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  approveOrRejectIcd(code.code_id, "approved");
                }}
                size="small"
                disabled={loading}
              >
                <Check size={18} color="#16a34a" strokeWidth={3} />
              </IconButton>
            )}
            {activeTab !== "rejected" && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  approveOrRejectIcd(code.code_id, "rejected");
                }}
                size="small"
                disabled={loading}
              >
                <X size={17} color="#f44336" strokeWidth={3} />
              </IconButton>
            )}
            {activeTab !== "pending" && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  approveOrRejectIcd(code.code_id, "pending");
                }}
                size="small"
                disabled={loading}
              >
                <RotateCcw size={16} color="#f44336" strokeWidth={3} />
              </IconButton>
            )}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCode(code);
              }}
              size="small"
              disabled={loading}
            >
              <Trash2 size={16} color="#f44336" strokeWidth={2.5} />
            </IconButton>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {/* HCC codes/tags */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <strong>Tags:</strong>
            {["cmshccv24", "cmshccv28", "rxhcc"].every(
              (key) => !code[key]?.length
            ) ? (
              <Typography
                sx={{
                  color: "#666",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                No tags identified
              </Typography>
            ) : (
              ["cmshccv24", "cmshccv28", "rxhcc"].flatMap(
                (key) =>
                  code[key]?.map((_hcc_code, index) => (
                    <Chip
                      key={`${key}-${index}`}
                      label={`${hccKeyMap[key]}. ${_hcc_code}`}
                      size="small"
                      variant="filled"
                      sx={{
                        background: "#dbeafe",
                        color: "#1e40af",
                        height: 28,
                        pl: 0.75,
                        pr: 0.5,
                        fontSize: "0.875rem",
                      }}
                    />
                  )) || []
              )
            )}
          </Box>

          {/* Reason */}
          {code.reason && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Evidence:</strong> {code.reason}
            </Typography>
          )}

          {/* MEAT Criteria */}
          <MEATCriteria
            dosIdx={dIdx}
            icdCode={code.code}
            meatEvidence={code.meat_evidence}
            selectedSentence={selectedSentence}
            onSelectSentence={(s) => onSelectSentence(s)}
          />
        </AccordionDetails>
      </Accordion>

      <CommentDrawer
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        comments={dos_item.comments || []}
        commentsType={"icd"}
        documentId={documentId}
        dosId={dos_item.dos_id}
        dos={dos_item.date_of_service}
        codeId={code.code_id}
        code={code.code}
      />
    </Box>
  );
};
