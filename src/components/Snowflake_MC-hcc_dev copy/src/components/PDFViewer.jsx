// components/PDFViewer.js
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfData, fileName, onBack }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF document");
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(3.0, prev + 0.2));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.2));
  };

  const downloadPDF = () => {
    try {
      let blob;

      // Check if pdfData is already a Blob
      if (pdfData instanceof Blob) {
        blob = pdfData;
      } else if (pdfData instanceof ArrayBuffer) {
        blob = new Blob([pdfData], { type: "application/pdf" });
      } else if (typeof pdfData === "string") {
        // If it's a base64 string or URL, fetch it
        if (pdfData.startsWith("data:")) {
          // Base64 data URL
          const base64Data = pdfData.split(",")[1];
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          blob = new Blob([bytes], { type: "application/pdf" });
        } else {
          // URL - would need to fetch, but for now just return
          console.error("URL-based PDF download not implemented");
          return;
        }
      } else {
        console.error("Unsupported PDF data format");
        return;
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <Toolbar
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "grey.50",
        }}
      >
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>

        <FileText size={20} style={{ marginRight: 8 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
          {fileName || "PDF Document"}
        </Typography>

        {/* Page Navigation */}
        {numPages && !error && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
            <IconButton
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              size="small"
            >
              <ChevronLeft size={18} />
            </IconButton>

            <Typography
              variant="body2"
              sx={{ minWidth: 80, textAlign: "center" }}
            >
              {pageNumber} / {numPages}
            </Typography>

            <IconButton
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              size="small"
            >
              <ChevronRight size={18} />
            </IconButton>
          </Box>
        )}

        {/* PDF Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={zoomOut} disabled={scale <= 0.5} size="small">
            <ZoomOut size={18} />
          </IconButton>

          <Typography
            variant="body2"
            sx={{ minWidth: 50, textAlign: "center" }}
          >
            {Math.round(scale * 100)}%
          </Typography>

          <IconButton onClick={zoomIn} disabled={scale >= 3.0} size="small">
            <ZoomIn size={18} />
          </IconButton>

          <Button
            onClick={downloadPDF}
            size="small"
            variant="outlined"
            startIcon={<Download size={16} />}
          >
            Download
          </Button>
        </Box>
      </Toolbar>

      {/* PDF Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          backgroundColor: "grey.100",
          p: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 400,
            }}
          >
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading PDF...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {pdfData && !error && (
          <Document
            file={pdfData}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        )}
      </Box>
    </Paper>
  );
};

export default PDFViewer;
