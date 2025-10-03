// components/CodeSection.js
import { Box, Button, Typography } from "@mui/material";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddorUpdateDosDialog } from "./AddorUpdateDosDialog";
import { DosSection } from "./DosSection";

export const CodesSection = ({
  dos_groups = [],
  title,
  codeType,
  documentId,
  onAddCode,
  onDeleteCode,
  onCodesUpdate,
  selectedSentence,
  onSelectSentence,
}) => {
  const [addDosDialogOpen, setAddDosDialogOpen] = useState(false);

  return (
    <Box sx={{ mb: 2, backgroundColor: "white" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, fontSize: "19px" }}
        >
          {title}
        </Typography>

        <Button
          startIcon={<Plus size={16} strokeWidth={2.5} />}
          variant="contained"
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            setAddDosDialogOpen(true);
          }}
          sx={{
            color: "#fff",
            fontWeight: 500,
            mr: 1,
          }}
          disabled={!documentId}
        >
          Add DOS
        </Button>
      </Box>

      {dos_groups && dos_groups.length > 0 ? (
        dos_groups.map((dos_item, dIdx) => (
          <DosSection
            dos_item={dos_item}
            dIdx={dIdx}
            codeType="icd"
            documentId={documentId}
            onCodesUpdate={onCodesUpdate}
            onAddCode={onAddCode}
            onDeleteCode={onDeleteCode}
            selectedSentence={selectedSentence || {}}
            onSelectSentence={(s) => onSelectSentence(s)}
          />
        ))
      ) : (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ fontStyle: "italic", textAlign: "center", py: 2 }}
        >
          No {codeType.toUpperCase()} DOS found. Click "Add DOS" to add new Date
          of Service.
        </Typography>
      )}
      <AddorUpdateDosDialog
        open={addDosDialogOpen}
        onClose={() => setAddDosDialogOpen(false)}
        documentId={documentId}
        onCodesUpdate={onCodesUpdate}
      />
    </Box>
  );
};
