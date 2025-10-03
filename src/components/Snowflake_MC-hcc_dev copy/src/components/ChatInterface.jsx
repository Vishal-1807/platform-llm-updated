// components/ChatInterface.js
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  Toolbar,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import apiService from "../services/apiService";
import { CodesSection } from "./CodeSection";
import HCCSummary from "./HccSummary";

const ChatInterface = ({
  documentId,
  initialResults,
  selectedSentence,
  onSelectSentence,
  onBack,
}) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [icdCodes, setIcdCodes] = useState([]);
  const [activeTab, setActiveTab] = useState("coding_view");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    setIcdCodes(initialResults.icd_supported_codes || []);
  }, [initialResults]);

  const handleCodesUpdate = async () => {
    try {
      // Refresh the results from the server
      const newresult = await apiService.fetchResults(documentId);
      setIcdCodes(newresult.icd_supported_codes || []);

      showNotification("Codes updated successfully!", "success");
    } catch (error) {
      console.error("Error updating codes:", error);
      showNotification("Failed to update codes. Please try again.", "error");
    }
  };

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Handler for adding codes to supported sections
  const handleAddToSupported = async (codeData) => {
    try {
      await apiService.addCodes(documentId, codeData);
      handleCodesUpdate();
    } catch (error) {
      console.error("Error adding code:", error);
      throw error;
    }
  };

  // Handler for deleting codes from supported sections
  const handleDeleteFromSupported = async (dosId, codeId) => {
    try {
      const deletePayload = {
        dos_id: dosId,
        code_id: codeId,
      };
      await apiService.deleteCodes(documentId, deletePayload);
      handleCodesUpdate();
    } catch (error) {
      console.error("Error deleting code:", error);
      throw error;
    }
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderBottom: "1px solid #e5e5e5",
            pb: 0,
          }}
        >
          {/* Header */}
          <Toolbar
            sx={{
              backgroundColor: "white",
              minHeight: 36,
              mb: 0,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{ minHeight: 36, mb: -2 }}
            >
              <Tab
                value="coding_view"
                label="Coding View"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
              <Tab
                value="hcc_summary"
                label="HCC Summary"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
              {/* <Tab
                value="search"
                label="Search ICDs"
                sx={{ textTransform: "none", fontWeight: 600 }}
              /> */}
            </Tabs>

            <Box sx={{ ml: "auto", mb: 0 }}>
              <Button
                startIcon={<ArrowLeft size={18} strokeWidth={2} />}
                onClick={onBack}
                sx={{ mr: 0.5, mb: 0 }}
                variant="outlined"
              >
                Back
              </Button>
            </Box>
          </Toolbar>
        </Box>

        <Box sx={{ flexGrow: 1, overflow: "auto", p: 0 }}>
          <Box
            sx={{
              display: "flex",
              mb: 10,
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "flex-start",
                gap: 1,
                p: 2,
              }}
            >
              {activeTab === "coding_view" && (
                <CodesSection
                  key="supported-icd"
                  dos_groups={icdCodes || []}
                  title="DOS Navigator"
                  codeType="icd"
                  documentId={documentId}
                  onCodesUpdate={handleCodesUpdate}
                  onAddCode={handleAddToSupported}
                  onDeleteCode={handleDeleteFromSupported}
                  selectedSentence={selectedSentence || {}}
                  onSelectSentence={(s) => onSelectSentence(s)}
                  color="success"
                />
              )}

              {activeTab === "hcc_summary" && (
                <HCCSummary dos_groups={icdCodes || []} />
              )}
              {activeTab === "search" && <>Search</>}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChatInterface;
