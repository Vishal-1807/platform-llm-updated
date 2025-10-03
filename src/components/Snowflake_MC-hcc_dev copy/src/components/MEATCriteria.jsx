import { Box, Button } from "@mui/material";
import { useState } from "react";
import SupportingSentencesList from "./SupportingSentence";

const MEATCriteria = ({
  dosIdx,
  icdCode,
  meatEvidence,
  selectedSentence,
  onSelectSentence,
}) => {
  const [activeMeatTab, setActiveMeatTab] = useState("");
  const meatKeysMap = {
    M: "Monitor",
    E: "Evaluate",
    A: "Assess",
    T: "Treat",
  };

  return (
    <Box sx={{ mb: 1 }}>
      {meatEvidence ? (
        <Box
          sx={{
            display: "flex",
            mx: "auto",
            width: "36%",
            justifyContent: "space-evenly",
          }}
        >
          {Object.keys(meatKeysMap).map((tab) => (
            <Button
              key={`${dosIdx}-${icdCode}-${tab}`}
              sx={{
                background:
                  activeMeatTab === meatKeysMap[tab] ? "#3b82f6" : "#e5e7eb",
                color: activeMeatTab === meatKeysMap[tab] ? "#fff" : "#000",
                minWidth: "36.5px !important",
                mb: 1,
                borderRadius: "6px",
              }}
              onClick={() => setActiveMeatTab(meatKeysMap[tab])}
              title={meatKeysMap[tab]}
            >
              {tab}
            </Button>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            mx: "auto",
            width: "36%",
            justifyContent: "space-evenly",
            fontSize: "16px",
            fontWeight: "semibold",
            color: "#666",
            mt: 1,
          }}
        >
          No MEAT evidences found
        </Box>
      )}
      {activeMeatTab !== "" && (
        <SupportingSentencesList
          sentences={meatEvidence[activeMeatTab?.toLowerCase()] || []}
          title={activeMeatTab}
          selectedSentence={selectedSentence}
          onSelectSentence={(s) => onSelectSentence(s)}
          sentence_key="text"
        />
      )}
    </Box>
  );
};

export default MEATCriteria;
