import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import apiService from "../services/apiService";

export const AddorUpdateDosDialog = ({
  open,
  onClose,
  documentId,
  onCodesUpdate,
  dosId = null,
  dateOfService = null,
  pgStart = null,
  pgEnd = null,
}) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSelectedDate(dateOfService ? dayjs(dateOfService) : dayjs());
    setPageStart(pgStart !== null ? pgStart : 1);
    setPageEnd(pgEnd !== null ? pgEnd : 1);
  }, [dateOfService, pgStart, pgEnd]);

  const handleSubmit = async () => {
    if (!selectedDate) return;

    setSubmitting(true);

    const payload = {
      date_of_service: selectedDate.format("MM-DD-YYYY"),
      page_start: pageStart,
      page_end: pageEnd,
    };
    let addorUpdate = "add";
    if (dosId) {
      payload["dos_id"] = dosId;
      addorUpdate = "update";
    }
    await apiService.addorUpdateDos(documentId, addorUpdate, payload);
    onCodesUpdate();
    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dosId ? "Edit DOS" : "Add New DOS"}</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3} mt={1}>
            <DatePicker
              label="Date of Service"
              value={selectedDate}
              maxDate={dayjs()} // Only allow past dates
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />

            <TextField
              label="Page Start"
              type="number"
              value={pageStart}
              onChange={(e) => setPageStart(Number(e.target.value))}
              fullWidth
              inputProps={{ min: 1 }}
            />

            <TextField
              label="Page End"
              type="number"
              value={pageEnd}
              onChange={(e) => setPageEnd(Number(e.target.value))}
              fullWidth
              inputProps={{ min: pageStart }}
            />
          </Stack>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !selectedDate}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
