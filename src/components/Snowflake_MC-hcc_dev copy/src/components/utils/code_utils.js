export const getCPTCodeCategory = (code) => {
  const codeNum = parseInt(code);

  if (isNaN(codeNum)) return "CPT Code";

  if (codeNum >= 10004 && codeNum <= 69990) {
    return "Surgery Code";
  } else if (codeNum >= 70010 && codeNum <= 79999) {
    return "Radiology Code";
  } else if (codeNum >= 80047 && codeNum <= 89398) {
    return "Pathology and Lab Code";
  } else if (
    (codeNum >= 90281 && codeNum <= 99201) ||
    (codeNum >= 99500 && codeNum <= 99607)
  ) {
    return "Medicine Services Code";
  } else if (codeNum >= 99202 && codeNum <= 99499) {
    return "Evaluation and Management Code";
  } else {
    return "CPT Code";
  }
};
