// components/CodeSearchDialog.js
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import apiService from "../services/apiService";

export const CodeSearchDialog = ({
  open,
  dosId,
  onClose,
  onSelectCode,
  codeType,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchKey, setSearchKey] = useState("Code");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (searchTerm.length >= 3) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, searchKey]);

  const handleSearch = async () => {
    if (searchTerm.length < 3) return;

    setLoading(true);
    try {
      const results = await apiService.searchCodes(
        searchTerm,
        codeType,
        searchKey
      );
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCode = () => {
    if (selectedCode && reason.trim()) {
      const codeData = {
        dos_id: dosId,
        code: selectedCode.Code,
        description: selectedCode.Description,
        reason: reason.trim(),
        cmshccv24: selectedCode.cmshccv24,
        cmshccv28: selectedCode.cmshccv28,
        rxhcc: selectedCode.rxhcc,
        code_type: codeType,
      };

      onSelectCode(codeData);
      onClose();
      setSelectedCode(null);
      setReason("");
      setSearchTerm("");
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedCode(null);
    setReason("");
    setSearchTerm("");
    setSearchResults([]);
  };

  const hccKeyMap = {
    cmshccv24: "v24",
    cmshccv28: "v28",
    rxhcc: "rhcc",
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Search {codeType.toUpperCase()} Codes</DialogTitle>
      <DialogContent sx={{ overflowY: "visible" }}>
        <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
          <TextField
            label="Search Key"
            select
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ minWidth: 150 }}
          >
            <option value="Code">Code</option>
            <option value="Description">Description</option>
          </TextField>
          <TextField
            fullWidth
            label={`Search ${codeType.toUpperCase()} ${searchKey}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Enter at least 3 characters to search ${searchKey.toLowerCase()}...`}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Box>

        {searchResults.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              <b>Search Results ({searchResults.length})</b>
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 1, mb: 2, fontStyle: "italic" }}
            >
              Click on a code below to select it for adding
            </Typography>
            <Box
              sx={{
                maxHeight: 230,
                overflow: "auto",
                border: 2,
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "grey.10",
                position: "relative",
              }}
            >
              {searchResults.map((result, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                    cursor: "pointer",
                    backgroundColor:
                      selectedCode?.Code === result.Code
                        ? "action.selected"
                        : "transparent",
                    "&:hover": { backgroundColor: "action.hover" },
                    transition: "background-color 0.2s ease",
                  }}
                  onClick={() => setSelectedCode(result)}
                >
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {result.Code}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {result.Description}
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                  >
                    <strong>Tags:</strong>
                    {["cmshccv24", "cmshccv28", "rxhcc"].every(
                      (key) => !result[key]?.length
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
                          result[key]?.map((_hcc_code, index) => (
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
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {searchTerm.length >= 3 && searchResults.length === 0 && !loading && (
          <Box sx={{ mb: 2, textAlign: "center", py: 3 }}>
            <Typography variant="body2" color="textSecondary">
              No {codeType.toUpperCase()} codes found matching "{searchTerm}"
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Try a different search term or search by{" "}
              {searchKey === "Code" ? "Description" : "Code"}
            </Typography>
          </Box>
        )}

        {selectedCode && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              border: 2,
              borderColor: "success.main",
              borderRadius: 1,
              backgroundColor: "success.50",
            }}
          >
            <Typography
              variant="subtitle2"
              color="success.main"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              ✓ Selected Code: {selectedCode.Code}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {selectedCode.Description}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              <strong>Tags:</strong>
              {["cmshccv24", "cmshccv28", "rxhcc"].every(
                (key) => !selectedCode[key]?.length
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
                    selectedCode[key]?.map((_hcc_code, index) => (
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
            <TextField
              fullWidth
              required
              label="Reason for adding this code"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for adding this code..."
              multiline
              rows={2}
              sx={{ mt: 2 }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleAddCode}
          variant="contained"
          disabled={!selectedCode || !reason.trim()}
        >
          Add Code
        </Button>
      </DialogActions>
    </Dialog>
  );
};
