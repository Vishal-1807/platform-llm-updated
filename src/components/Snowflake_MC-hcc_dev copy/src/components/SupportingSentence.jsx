import { Box, Typography } from "@mui/material";

const SupportingSentencesList = ({
  sentences,
  selectedSentence,
  onSelectSentence,
  sentence_key = "supporting_sentence",
  title = "Supporting Sentences",
}) => {
  if (!sentences || sentences.length === 0) return null;

  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
        {title}:
      </Typography>
      {sentences.map((sentence, sentenceIndex) => (
        <Box
          key={sentenceIndex}
          sx={{
            display: "flex",
            alignItems: "baseline",
            cursor: "pointer",
            mb: 0.75,
          }}
        >
          <Box
            sx={{
              fontWeight: "bold",
              mr: 1,
              fontSize: "0.755rem",
              color:
                selectedSentence?.[sentence_key] === sentence?.[sentence_key]
                  ? "#6366f1"
                  : "#000",
            }}
          >
            {sentenceIndex + 1}.
          </Box>
          <Box
            sx={{
              width: "100%",
              px: 1,
              py: 0.75,
              fontSize: "0.725rem",
              borderRadius: "4px",
              border: "1px solid #4f46e5",
              backgroundColor:
                selectedSentence?.[sentence_key] === sentence?.[sentence_key]
                  ? "#e0e7ff"
                  : "#f9f9f9",
              fontWeight:
                selectedSentence?.[sentence_key] === sentence?.[sentence_key]
                  ? 700
                  : 400,
              color:
                selectedSentence?.[sentence_key] === sentence?.[sentence_key]
                  ? "#6366f1"
                  : "#000",
            }}
            onClick={() => onSelectSentence(sentence)}
          >
            {sentence?.[sentence_key]}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SupportingSentencesList;
