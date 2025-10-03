// components/FileUpload.js
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CloudUpload, FileText, History } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";

const UploadArea = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.action.hover,
  },
  "&:active": {
    transform: "scale(0.98)",
  },
}));

const HiddenInput = styled("input")({
  display: "none",
});

const FileUpload = ({ showNotification }) => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setUploadError(null);
    setUploadProgress("Getting upload URL...");

    try {
      // Step 1: Get presigned URL
      setUploadProgress("Preparing upload...");
      const presignedResponse = await apiService.getPresignedUrl({
        filename: file.name,
      });

      // Step 2: Upload to S3
      setUploadProgress("Uploading the document...");
      const uploadResult = await apiService.uploadToS3(file, presignedResponse);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Document upload failed");
      }

      // Step 3: Process uploaded file
      setUploadProgress("Processing uploaded file...");
      const processFileResponse = await apiService.processUploadedFile({
        filename: file.name,
        document_id: presignedResponse.document_id,
      });

      if (processFileResponse.error) {
        throw new Error(uploadResult.error || "File processing failed");
      }

      if (showNotification) {
        showNotification(
          "File uploaded successfully! Processing started.",
          "success"
        );
      }

      navigate("/status");
    } catch (error) {
      const errorMessage = error.message || "Upload failed. Please try again.";
      setUploadError(errorMessage);
      if (showNotification) {
        showNotification(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(null);
    }
  };

  const handleFileChange = async (file) => {
    const validation = apiService.validateFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error);
      if (showNotification) {
        showNotification(validation.error, "error");
      }
      return;
    }

    handleFileUpload(file);
  };

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileChange(file);
    }
    event.target.value = null;
  };

  const handleViewHistory = () => {
    navigate("/status");
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ position: "absolute", top: 24, right: 24 }}>
        <Button
          variant="contained"
          startIcon={<History size={20} />}
          onClick={handleViewHistory}
        >
          View History
        </Button>
      </Box>

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            color="primary"
            fontWeight="bold"
          >
            CPT Code Provider
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
            AI-Powered Medical Coding Assistant
          </Typography>
        </CardContent>
      </Card>

      <UploadArea
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          borderColor: dragActive ? "primary.dark" : "primary.main",
          backgroundColor: dragActive ? "action.hover" : "transparent",
        }}
      >
        <label
          htmlFor="file-upload"
          style={{ cursor: "pointer", display: "block" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {isLoading ? (
              <CircularProgress size={48} />
            ) : (
              <CloudUpload size={48} color="#1976d2" />
            )}

            <Typography variant="h5" gutterBottom>
              {isLoading
                ? uploadProgress || "Uploading..."
                : "Upload Operation Report"}
            </Typography>

            <Typography variant="body1" color="textSecondary" gutterBottom>
              {dragActive
                ? "Drop your PDF file here"
                : "Click here or drag and drop your PDF file"}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
              <FileText size={16} />
              <Typography variant="body2" color="textSecondary">
                Only PDF files up to 10MB are allowed
              </Typography>
            </Box>
          </Box>
        </label>

        <HiddenInput
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          disabled={isLoading}
        />
      </UploadArea>

      {uploadError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {uploadError}
        </Alert>
      )}

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="textSecondary">
          Supported features: CPT Code Extraction • ICD Code Analysis • Medical
          Documentation Review
        </Typography>
      </Box>
    </Container>
  );
};

export default FileUpload;
