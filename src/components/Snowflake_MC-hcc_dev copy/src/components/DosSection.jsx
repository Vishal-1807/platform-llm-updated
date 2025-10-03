import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { Check, MessageCircleMore, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import apiService from "../services/apiService";
import { AddorUpdateDosDialog } from "./AddorUpdateDosDialog";
import { CodeSearchDialog } from "./CodeSearchDialog";
import { CommentDrawer } from "./CommentsDrawer";
import { IcdCodeView } from "./IcdCodeView";
export const DosSection = ({
  dos_item,
  dIdx,
  codeType,
  documentId,
  onAddCode,
  onDeleteCode,
  onCodesUpdate,
  selectedSentence,
  onSelectSentence,
}) => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [editDosDialogOpen, setEditDosDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const icdStatusMap = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
  };

  const [activeTab, setActiveTab] = useState("pending");

  const handleAddCode = async (codeData) => {
    setLoading(true);
    try {
      await onAddCode(codeData);
    } catch (error) {
      console.error("Error adding code:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDos = async (dos) => {
    setLoading(true);
    try {
      await apiService.deleteDos(documentId, { dos_id: dos.dos_id });
      onCodesUpdate();
    } catch (error) {
      console.error("Error deleting code:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveOrRejectIcd = async (codeId, status) => {
    setLoading(true);
    try {
      await apiService.approveOrRejectCode(documentId, {
        dos_id: dos_item.dos_id,
        code_id: codeId,
        status: status,
      });
      onCodesUpdate();
    } catch (err) {
      console.error("Error deleting code:", err);
    } finally {
      setLoading(false);
    }
  };

  function ICDTabs() {
    const getColorProps = (tab) => {
      const isActive = activeTab === tab;
      const colorMap = {
        pending: { color: "primary", label: "To Be Reviewed" },
        approved: { color: "success", label: "Approved" },
        rejected: { color: "error", label: "Rejected" },
      };

      return {
        variant: isActive ? "contained" : "outlined",
        color: colorMap[tab].color,
        label: colorMap[tab].label,
        count: dos_item.codes?.filter((icd) => icd.status === tab).length || 0,
      };
    };

    return (
      <Box
        display="flex"
        justifyContent="center"
        borderBottom={1}
        borderColor="divider"
        mb={1}
        sx={{ border: "none" }}
      >
        <ButtonGroup variant="text">
          {["pending", "approved", "rejected"].map((tab) => {
            const { variant, color, label, count } = getColorProps(tab);
            return (
              <Button
                key={tab}
                variant={variant}
                color={color}
                onClick={() => setActiveTab(tab)}
                title={`Show ${label} ICDs`}
                sx={{
                  px: 3,
                  py: 0.5,
                  fontWeight: 600,
                  textTransform: "none",
                  border: "none",
                }}
              >
                {label} ({count})
              </Button>
            );
          })}
        </ButtonGroup>
      </Box>
    );
  }

  const filteredCodes =
    dos_item.codes?.filter((code) => code.status === icdStatusMap[activeTab]) ||
    [];

  return (
    <Box key={dIdx}>
      <Accordion
        key={`dos-acc-${dIdx}`}
        sx={{
          mb: 1,
          boxShadow: "none",
          borderRadius: "6px",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-content-${dIdx}`}
          id={`panel-header-${dIdx}`}
          sx={{
            px: 2,
            background: "#eff6ff",
            "& .MuiAccordionSummary-content": {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ mr: 2, fontWeight: 500, color: "#1e40af" }}>
              DOS {dIdx + 1}
            </Typography>
            <Typography sx={{ mr: 2, fontWeight: 500, color: "#1e40af" }}>
              {dos_item.date_of_service
                ? new Date(dos_item.date_of_service).toLocaleDateString("en-US")
                : ""}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              Pages {dos_item.dos_page_start}-{dos_item.dos_page_end}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              borderLeft: "1px solid #c5c5c5",
              pl: 1,
              ml: 1,
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setEditDosDialogOpen(true);
              }}
              size="small"
              disabled={loading}
              sx={{ mr: 0.5 }}
            >
              <Pencil size={16} color="#4400ff" strokeWidth={2.5} />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setCommentDialogOpen(true);
              }}
              size="small"
              disabled={loading}
              sx={{ mr: 0.5 }}
            >
              <MessageCircleMore size={16} color="#4400ff" strokeWidth={2.5} />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                approveOrRejectIcd("all", "approved");
              }}
              size="small"
              disabled={loading}
              sx={{ mr: 0.5 }}
            >
              <Check size={18} color="#16a34a" strokeWidth={3} />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteDos(dos_item);
              }}
              size="small"
              disabled={loading}
              sx={{ mr: 2 }}
            >
              <Trash2 size={16} color="#f44336" strokeWidth={2.5} />
            </IconButton>
            <Button
              startIcon={
                loading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Plus size={16} strokeWidth={2.5} />
                )
              }
              onClick={(e) => {
                e.stopPropagation();
                setSearchDialogOpen(true);
              }}
              variant="contained"
              size="small"
              color="success"
              sx={{
                color: "#fff",
                fontWeight: 500,
                mr: 1,
              }}
              disabled={loading || !documentId}
            >
              Add {codeType.toUpperCase()} Code
            </Button>
          </Box>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            borderTop: "1px solid #e5e5e5",
            borderBottom: "1px solid #e5e5e5",
            mb: 2,
          }}
        >
          {/* Tabs for filtering */}
          <ICDTabs />

          {/* ICD code list filtered by tab */}
          {filteredCodes.length === 0 && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontStyle: "italic", textAlign: "center", py: 2 }}
            >
              {activeTab === "pending" && (
                <>
                  No {codeType.toUpperCase()} codes found. Click "Add{" "}
                  {codeType.toUpperCase()} Code" to search and add codes.
                </>
              )}
              {activeTab === "approved" && (
                <>
                  No approved codes yet. Approve codes from "To Be Reviewed"
                  section.
                </>
              )}
              {activeTab === "rejected" && (
                <>
                  No rejected codes yet. Reject codes from "To Be Reviewed"
                  section.
                </>
              )}
            </Typography>
          )}

          {filteredCodes.map((code, index) => (
            <IcdCodeView
              key={index}
              dos_item={dos_item}
              dIdx={dIdx}
              code={code}
              activeTab={activeTab}
              index={index}
              codeType="icd"
              documentId={documentId}
              onCodesUpdate={onCodesUpdate}
              approveOrRejectIcd={approveOrRejectIcd}
              onAddCode={onAddCode}
              onDeleteCode={onDeleteCode}
              selectedSentence={selectedSentence || {}}
              onSelectSentence={(s) => onSelectSentence(s)}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      <CodeSearchDialog
        dosId={dos_item.dos_id}
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        onSelectCode={handleAddCode}
        codeType={codeType}
      />

      <CommentDrawer
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        comments={dos_item.comments || []}
        commentsType={"dos"}
        documentId={documentId}
        dosId={dos_item.dos_id}
        dos={dos_item.date_of_service}
      />

      <AddorUpdateDosDialog
        open={editDosDialogOpen}
        onClose={() => setEditDosDialogOpen(false)}
        documentId={documentId}
        onCodesUpdate={onCodesUpdate}
        dosId={dos_item.dos_id}
        dateOfService={dos_item.date_of_service}
        pgStart={dos_item.dos_page_start}
        pgEnd={dos_item.dos_page_end}
      />
    </Box>
  );
};
