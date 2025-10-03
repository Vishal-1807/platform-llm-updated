// components/StatusTable.js
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Upload,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";

const StatusIcon = ({ status }) => {
  switch (status) {
    case "completed":
      return <CheckCircle size={16} color="#4caf50" />;
    case "processing":
    case "extracting data from pdf":
    case "cleansing text in progress":
    case "cpt code extraction in progress":
      return <Clock size={16} color="#ff9800" />;
    case "error":
      return <XCircle size={16} color="#f44336" />;
    case "uploading":
      return <Upload size={16} color="#2196f3" />;
    default:
      return <Clock size={16} color="#9e9e9e" />;
  }
};

const StatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
      case "extracting data from pdf":
      case "cleansing text in progress":
      case "cpt code extraction in progress":
        return "warning";
      case "error":
        return "error";
      case "uploading":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "extracting data from pdf":
        return "Extracting PDF Data";
      case "cleansing text in progress":
        return "Processing Text";
      case "cpt code extraction in progress":
        return "Extracting CPT Codes";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Chip
      icon={<StatusIcon status={status} />}
      label={getStatusText(status)}
      color={getStatusColor(status)}
      variant="outlined"
      size="small"
    />
  );
};

const StatusTable = ({ showNotification }) => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("date");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchFiles = async () => {
    try {
      setError(null);
      const documents = await apiService.fetchHistory();
      setFiles(documents.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError("Failed to load documents. Please try again.");
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredFiles = React.useMemo(() => {
    return [...files].filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  const sortedFiles = React.useMemo(() => {
    return [...filteredFiles].sort((a, b) => {
      if (orderBy === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (orderBy === "name") {
        return order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (orderBy === "status") {
        return order === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });
  }, [filteredFiles, order, orderBy]);

  const paginatedFiles = sortedFiles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewResults = (file) => {
    if (file.status === "completed") {
      navigate(`/document/${file.id}`);
    } else {
      if (showNotification) {
        showNotification(
          "Document is still processing. Please wait.",
          "warning"
        );
      }
    }
  };

  const handleBackToUpload = () => {
    navigate("/upload");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: "center" }}>
          Loading documents...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                color="primary"
                fontWeight="bold"
              >
                Report Processing Status
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Track your uploaded documents and view results
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                variant="outlined"
                startIcon={<ArrowLeft size={20} />}
                onClick={handleBackToUpload}
              >
                Back to Upload
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={2}>
        <Box sx={{ ml: "auto", p: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Search by filename
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    #
                  </Typography>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      File Name
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "date"}
                    direction={orderBy === "date" ? order : "asc"}
                    onClick={() => handleSort("date")}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      Upload Date
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleSort("status")}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      Status
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <FileText size={48} color="#ccc" />
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      sx={{ mt: 2 }}
                    >
                      No documents found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Upload your first PDF to get started
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedFiles.map((file, index) => (
                  <TableRow key={file.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {page * rowsPerPage + index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <FileText size={16} />
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ textTransform: "uppercase" }}
                        >
                          {file.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(file.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={file.status} />
                    </TableCell>
                    <TableCell align="center">
                      {file.status === "completed" ? (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Eye size={16} />}
                          onClick={() => handleViewResults(file)}
                        >
                          View Results
                        </Button>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Processing...
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredFiles.length > 0 && (
          <TablePagination
            component="div"
            count={filteredFiles.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        )}
      </Paper>
    </Container>
  );
};

export default StatusTable;
