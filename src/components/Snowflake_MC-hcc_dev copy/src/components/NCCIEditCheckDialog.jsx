// components/NCCIEditCheckDialog.js
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getCPTCodeCategory } from "./utils/code_utils";

// NCCI Edit Check Dialog Component
export const NCCIEditCheckDialog = ({ open, onClose, ncciEditCheck }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>NCCI Edit Check</DialogTitle>
      <DialogContent sx={{ mt: -1 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" paragraph>
            National Correct Coding Initiative (NCCI) edit checks identify code
            pairs that should not be billed together under normal circumstances.
          </Typography>

          {/* Legend */}
          <Box
            sx={{ mb: 3, p: 2, backgroundColor: "grey.100", borderRadius: 1 }}
          >
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Edit Types:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#f44336",
                  borderRadius: 1,
                  mr: 2,
                }}
              />
              <Typography variant="body2">
                <strong>Type 0:</strong> Codes never go together
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#ff9800",
                  borderRadius: 1,
                  mr: 2,
                }}
              />
              <Typography variant="body2">
                <strong>Type 1:</strong> May use modifier to override NCCI edit
              </Typography>
            </Box>
          </Box>

          {/* Type 0 Edit Check */}
          {ncciEditCheck?.["0"] && ncciEditCheck["0"].length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: "#f44336", mb: 2 }}>
                Type 0 - Codes Never Go Together
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ border: "2px solid #f44336" }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#ffebee" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Column 1 (Primary Code)
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Column 2 (Component Code)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ncciEditCheck["0"].map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2">
                            <strong>{getCPTCodeCategory(item.column1)}:</strong>{" "}
                            {item.column1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            <strong>{getCPTCodeCategory(item.column2)}:</strong>{" "}
                            {item.column2}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Type 1 Edit Check */}
          {ncciEditCheck?.["1"] && ncciEditCheck["1"].length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ color: "#ff9800", mb: 2 }}>
                Type 1 - May Use Modifier to Override
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ border: "2px solid #ff9800" }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#fff3e0" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Column 1 (Primary Code)
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Column 2 (Component Code)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ncciEditCheck["1"].map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2">
                            <strong>{getCPTCodeCategory(item.column1)}:</strong>{" "}
                            {item.column1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            <strong>{getCPTCodeCategory(item.column2)}:</strong>{" "}
                            {item.column2}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* No Edit Check Message */}
          {(!ncciEditCheck ||
            ((!ncciEditCheck["0"] || ncciEditCheck["0"].length === 0) &&
              (!ncciEditCheck["1"] || ncciEditCheck["1"].length === 0))) && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="textSecondary">
                No NCCI edit checks available for the current codes.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
