import Typography from "@mui/material/Typography";
import { alpha, styled } from "@mui/material/styles";
import { Button, Box, TextField } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

export const Title = styled(Typography)({
  color: "#0C1244",
  fontSize: "28px",
  fontFamily: "source-sans-pro",
  fontWeight: 600,
  lineHeight: "35.2px",
  margin: "20px 0 40px 0",
  textAlign: "center",
});

export const ModelNames = styled(Typography)({
  color: "#3F4D57",
  fontSize: "20px",
  fontFamily: "source-sans-pro",
  fontWeight: 600,
  lineHeight: 1,
});

export const ModelDes = styled(Typography)({
  color: "#5B6975",
  fontFamily: "Glegoo",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: 2,
});

export const LightContent = styled(Typography)({
  color: "#989CAD",
  fontFamily: "Roboto Slab",
  fontSize: "12px",
});

export const SubTitle = styled(Typography)({
  color: "#040820",
  fontSize: "24px",
  fontFamily: "source-sans-pro",
  fontWeight: 600,
  lineHeight: "30px",
  margin: "20px 0",
});

export const SideTitles = styled(Box)({
  fontFamily: "Glegoo",
  fontSize: "16px",
  fontWeight: 700,
  padding: "10px 0 10px 10px",
  borderRadius: " 20px 0 0 20px",
});

export const LableNames = styled(Typography)({
  color: "#5420E8",
  fontFamily: "Plus Jakarta Sans",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "normal",
  margin:"5px"
});

export const RedditTextField = styled((props) => (
  <TextField
    InputProps={{
      disableUnderline: true,
      inputProps: {
        type: "number",
        min: 1,
      },
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiFormLabel-root": {
    fontSize: "14px",
  },
  "& .MuiFilledInput-root": {
    width: "300px",
    overflow: "hidden",
    borderRadius: 4,
    background: "#fff",
    // backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),

    "& .MuiFilledInput-input": {
      fontSize: "16px",
      fontFamily: "source-sans-pro",
      fontWeight: 400,
      color: "#333333",
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

export const InputField = styled(TextField)({
  width: "100%",
  "& .MuiInputAdornment-root": {
    "& .MuiTypography-root": {
      fontSize: "10px",
      fontFamily: "Glegoo",
      fontWeight: 400,
      mt: "19px",
    },
  },
});

export const PredictModelBox = styled(Box)({
  width: "320px",
  border: "1px solid #E2EAEF",
  height: "60px",
  borderRadius: "50px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "22px",
  fontFamily: "source-sans-pro",
  fontWeight: 600,
  cursor: "pointer",
});

export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  marginTop: "5px",
  width: "50%",
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

export const Defination = styled(Typography)({
  color: "#000000",
  fontSize: "16px",
  fontFamily: "Glegoo",
  fontWeight: 400,
  lineHeight: "24.96px",
});

export const ButtonDiv = styled(Button)({
  backgroundColor: "#FFCC33",
  color: "#000000",
  fontFamily: "source-sans-pro",
  fontWeight: 700,
  textTransform: "none",
  fontSize: "18px",
  margin: "3px",
  height: "40px",
  "&:hover": {
    backgroundColor: "#FFCC33",
  },
});

export const BackButton = styled(Button)({
  backgroundColor: "#FFFFFF",
  border: "1px solid #B4BAC7",
  color: "#282830",
  fontFamily: "source-sans-pro",
  fontWeight: 700,
  textTransform: "none",
  fontSize: "18px",
  margin: "3px",
  height: "40px",
  "&:hover": {
    backgroundColor: "#FFFFFF",
  },
});

export const Answer = styled(Typography)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  color: "#0C1244",
  fontSize: "16px",
  fontFamily: "Glegoo",
  fontWeight: 400,
  padding: 7,
  cursor: "pointer",
  borderRadius: "8px",
  border: "1px solid rgba(209, 213, 219, 0.2)",
  background:
    "linear-gradient(0deg, rgba(209, 213, 219, 0.2), rgba(209, 213, 219, 0.2)),linear-gradient(0deg, rgba(209, 213, 219, 0.05), rgba(209, 213, 219, 0.05))",
});

export const ButtonTabs = styled(Button)({
  // margin: "10px",
  background: "#fff",
  border: "0.7px solid #9aa2b1 !important",
  color: "#9aa2b1",
  width: "150px",
  "&.Mui-disabled": {
    // opacity: 0.8,
    background: "none",
    cursor: "not-allowed",
    pointerEvents: "visible",
  },
  "&:hover": {
    background: "#e4e7ec",
  },
});
