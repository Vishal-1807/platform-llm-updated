// components/DocumentViewer.js
import { Box, CircularProgress, Typography } from "@mui/material";
import { CalendarDays, User, VenusAndMars } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PDFViewer from "../lib/pdf-viewer";
import apiService from "../services/apiService";
import ChatInterface from "./ChatInterface";
import FloatingChat from "./FloatingChat";

const DocumentViewer = ({ showNotification }) => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfData, setPdfData] = useState({});
  const [chatResults, setChatResults] = useState(null);
  const [selectedSentence, setSelectedSentence] = useState({});
  const [searchResults, setSearchResults] = useState(null);
  const [boundingBoxes, setBoundingBoxes] = useState({});

  useEffect(() => {
    if (documentId) {
      loadDocument();
    }
  }, [documentId]);

  useEffect(() => {
    if (
      selectedSentence?.evidence?.bbox &&
      selectedSentence?.evidence?.bbox.length > 0
    ) {
      const highlightData = {
        document_name: selectedSentence.document_name,
        page_number: parseInt(selectedSentence.page_number),
        bbox: selectedSentence?.evidence?.bbox,
        supporting_sentence_in_document: selectedSentence.supporting_sentence,
        section_name: "",
      };

      setBoundingBoxes(highlightData); // Replace existing highlights with new one
    }
  }, [selectedSentence]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch document metadata first
      const documents = await apiService.fetchHistory();
      const document = documents.find((doc) => doc.id === documentId);

      if (!document) {
        setError("Document not found");
        return;
      }

      if (document.status !== "completed") {
        setError("Document is still processing. Please wait and try again.");
        return;
      }

      // Load PDF data and results in parallel
      const [resultsResponse] = await Promise.all([
        apiService.fetchResults(documentId),
      ]);

      // setPdfData(pdfDataResponse);
      setChatResults(resultsResponse);
      setPdfData({
        files: [resultsResponse.file_name],
        presigned_urls: {
          [resultsResponse.file_name]: resultsResponse.presigned_urls,
        },
      });

      if (showNotification) {
        showNotification("Document loaded successfully!", "success");
      }
    } catch (error) {
      console.error("Error loading document:", error);
      setError("Failed to load document. Please try again.");
      if (showNotification) {
        showNotification("Failed to load document. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToStatus = () => {
    navigate("/status");
  };

  const handleNewChatMessage = () => {
    if (showNotification) {
      showNotification("Chat message sent!", "info");
    }
  };

  const handleDocumentChange = (documentName) => {
    console.log("Document changed:", documentName);
  };

  const handlePageChange = (pageNumber) => {
    console.log("Page changed:", pageNumber);
  };

  const handleAnnotationAdd = (annotation) => {
    console.log("Annotation added:", annotation);
    // Add your annotation handling logic here
    // For example, you might want to save the annotation to a backend service
    // or update local state to track annotations
  };

  const handleSearchPerformed = async (searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" color="textSecondary">
          Loading document...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
          p: 4,
        }}
      >
        <Typography variant="h6" color="error" textAlign="center">
          {error}
        </Typography>
        <Typography
          variant="body1"
          color="primary"
          sx={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={handleBackToStatus}
        >
          Back to Status
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%", // Take full available height
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent the container from scrolling
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          px: 2,
          py: 0.5,
          color: "#666",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <User size={18} color="#3b83f6" strokeWidth={3} />
          <Box sx={{ ml: 1, display: "flex" }}>
            <Box sx={{ mr: 1, fontWeight: 600 }}>Name:</Box>
            {chatResults.patient_demographics.patient_name}
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
          <CalendarDays size={18} color="#3b83f6" strokeWidth={2} />
          <Box sx={{ ml: 1, display: "flex" }}>
            <Box sx={{ mr: 1, fontWeight: 600 }}>Age:</Box>
            {chatResults.patient_demographics.age}
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
          <VenusAndMars size={18} color="#3b83f6" strokeWidth={2.5} />
          <Box sx={{ ml: 1, display: "flex" }}>
            <Box sx={{ mr: 1, fontWeight: 600 }}>Gender:</Box>
            {chatResults.patient_demographics.gender}
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* PDF Viewer - Left Side */}
        <Box sx={{ width: "50%", borderRight: "1px solid #e0e0e0" }}>
          <PDFViewer
            documentData={pdfData}
            boundingBoxes={boundingBoxes}
            searchResults={searchResults}
            userInterfaces={{}}
            onDocumentChange={handleDocumentChange}
            onPageChange={handlePageChange}
            onAnnotationAdd={handleAnnotationAdd}
            onSearchPerformed={handleSearchPerformed}
            setSearchResults={setSearchResults}
          />
        </Box>

        {/* Chat Interface - Right Side */}
        <Box sx={{ width: "50%" }}>
          <ChatInterface
            documentId={documentId}
            initialResults={chatResults}
            selectedSentence={selectedSentence}
            onSelectSentence={(s) => setSelectedSentence(s)}
            onBack={handleBackToStatus}
          />
        </Box>
      </Box>

      {/* Floating Chat - Only visible on viewer screen */}
      <FloatingChat
        documentId={documentId}
        onNewChatMessage={handleNewChatMessage}
      />
    </Box>
  );
};

export default DocumentViewer;
