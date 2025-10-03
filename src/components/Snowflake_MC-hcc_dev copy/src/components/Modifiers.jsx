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
import { Plus } from "lucide-react";
import { useState } from "react";
import apiService from "../services/apiService";

const ModifiersList = ({
  documentId,
  code,
  onCodesUpdate,
  loading,
  setLoading,
}) => {
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
  const [selectedCodeForModifier, setSelectedCodeForModifier] = useState(null);
  const [newModifiers, setNewModifiers] = useState([]);
  const [modifierInput, setModifierInput] = useState("");

  if (!code.modifiers) return null;

  // Function to get modifiers as array
  const getModifiersArray = (modifiers) => {
    if (!modifiers) return [];
    if (Array.isArray(modifiers)) return modifiers;
    return [];
  };

  const handleOpenModifierDialog = (code) => {
    setSelectedCodeForModifier(code);
    setNewModifiers([]);
    setModifierInput("");
    setModifierDialogOpen(true);
  };

  const handleAddModifierToList = () => {
    if (modifierInput.trim() && !newModifiers.includes(modifierInput.trim())) {
      setNewModifiers([...newModifiers, modifierInput.trim()]);
      setModifierInput("");
    }
  };

  const handleRemoveModifierFromList = (modifierToRemove) => {
    setNewModifiers(
      newModifiers.filter((modifier) => modifier !== modifierToRemove)
    );
  };

  const handleSaveModifiers = async () => {
    if (newModifiers.length === 0 || !selectedCodeForModifier) return;

    setLoading(true);
    try {
      await apiService.addModifiers(
        documentId,
        selectedCodeForModifier.code,
        newModifiers
      );
      onCodesUpdate();
      setModifierDialogOpen(false);
      setSelectedCodeForModifier(null);
      setNewModifiers([]);
    } catch (error) {
      console.error("Error adding modifiers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveModifier = async (code, modifierToRemove) => {
    setLoading(true);
    try {
      await apiService.removeModifiers(documentId, code.code, [
        modifierToRemove,
      ]);
      onCodesUpdate();
    } catch (error) {
      console.error("Error removing modifier:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddModifierToList();
    }
  };

  return (
    <>
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Modifiers:
          </Typography>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModifierDialog(code);
            }}
            size="small"
            variant="text"
            disabled={loading}
            sx={{
              minWidth: "auto",
              px: 1,
              fontWeight: "bold",
              height: 28,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Plus size={16} />
            Add Modifiers
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {getModifiersArray(code.modifiers).map((modifier, index) => (
            <Chip
              key={index}
              label={modifier}
              size="small"
              variant="filled"
              onDelete={() => handleRemoveModifier(code, modifier)}
              sx={{
                background: "#6366f1",
                color: "#f9f9f9",
                height: 28,
                pl: 0.75,
                pr: 0.5,
                fontSize: "0.75rem",
                "& .MuiChip-deleteIcon": {
                  fontSize: "0.75rem",
                  color: "#f9f9f9",
                  ml: 0.15,
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Modifier Dialog */}
      <Dialog
        open={modifierDialogOpen}
        onClose={() => setModifierDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add Modifiers to {selectedCodeForModifier?.code}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Enter modifier"
              value={modifierInput}
              onChange={(e) => setModifierInput(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              size="small"
              helperText="Press Enter to add the modifier to the list"
            />

            {newModifiers.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Modifiers to add:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {newModifiers.map((modifier, index) => (
                    <Chip
                      key={index}
                      label={modifier}
                      onDelete={() => handleRemoveModifierFromList(modifier)}
                      size="small"
                      variant="filled"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setModifierDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveModifiers}
            variant="contained"
            disabled={loading || newModifiers.length === 0}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            Save Modifiers
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModifiersList;
