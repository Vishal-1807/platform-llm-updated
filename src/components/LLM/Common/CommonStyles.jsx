import { Box, Grid, Slider, Stack, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CommonSlider = styled(Slider)({
    "& .MuiSlider-thumb": {
        color: "white",
        border: "2px solid #1E90FF",
        height: "12px",
        width: "12px",
      },
      "& .MuiSlider-track": {
        backgroundImage:
          "linear-gradient(80deg, #1E90FF 0%, #FFA500 96.35%)",
        height: "8px",
      },
      "& .MuiSlider-rail": {
        color: "#acc4e4",
      },
      "& .MuiSlider-active": {
        color: "green",
      },
      "& .MuiSlider-mark": {
        width: 0,
      },
      "& .css-jx1sa5-MuiSlider-thumb": {
        height: "15px !important",
        width: "15px !important",
      },
      "& .MuiSlider-valueLabel": {
        backgroundImage:
          "linear-gradient(80deg, #1E90FF 0%, #FFA500 96.35%) !important",
      },
      "& .css-16fgs5d-MuiSlider-root .MuiSlider-rail": {
        color: "#D3D3EA !important",
      },
      "& .css-1j69iww-MuiSlider-root": {
        height: "8px !important",
      },
});
