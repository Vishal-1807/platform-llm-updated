import { Box, Chip, Stack, Typography } from "@mui/material";
import { CircleCheck } from "lucide-react";

const HCCSummary = ({ dos_groups = [] }) => {
  const hccKeyMap = {
    cmshccv24: "v24",
    cmshccv28: "v28",
    rxhcc: "rhcc",
  };
  return (
    <Box sx={{ mb: 2, backgroundColor: "white", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, fontSize: "19px" }}
        >
          HCC Summary
        </Typography>
      </Box>

      <Box>
        {dos_groups.length === 0 ||
        dos_groups.every(
          (dos) => !(dos.codes || []).some((code) => code.status === "approved")
        ) ? (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ fontStyle: "italic", textAlign: "center", py: 2 }}
          >
            No approved codes yet. Approve codes from "To Be Reviewed" section.
          </Typography>
        ) : (
          dos_groups.map((dos_item, dIdx) => (
            <Box
              key={`hcc_summary_dos-${dIdx}`}
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              {(dos_item?.codes || [])
                .filter((code) => code.status === "approved")
                .map((icd) => (
                  <Box
                    key={icd?.id || `${icd.code}-${dIdx}`}
                    variant="outlined"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #c5c5c5",
                      mb: 2,
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <CircleCheck size={16} color="#16a34a" />
                        <Typography fontWeight={600} color="text.primary">
                          {icd.code}
                        </Typography>
                        <Typography color="text.secondary">
                          {icd.description}
                        </Typography>
                        <Chip
                          label={icd.added_by}
                          size="small"
                          variant="filled"
                          sx={{
                            background:
                              icd.added_by !== "AI" ? "#fef9c3" : "#dcfce7",
                            color:
                              icd.added_by !== "AI" ? "#92400e" : "#166534",
                            height: 28,
                            textTransform: "capitalize",
                            mx: 1,
                            px: 0.5,
                            py: 0,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {dos_item.date_of_service
                          ? new Date(
                              dos_item.date_of_service
                            ).toLocaleDateString("en-US")
                          : ""}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      {["cmshccv24", "cmshccv28", "rxhcc"].every(
                        (key) => !icd[key]?.length
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
                            icd[key]?.map((_hcc_code, index) => (
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
          ))
        )}
      </Box>
    </Box>
  );
};

export default HCCSummary;
