import { useEffect, useState } from "react";
import { StyledEngineProvider } from "@mui/styled-engine";
import Button from "@mui/material/Button";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import BackIcon from "../../../../assets/icons/back.svg?react";
import SettingsIcon from "../../../../assets/icons/fi_settings.svg?react";
import DatabaseIcon from "../../../../assets/icons/ph_database-light.svg?react";
import NextIcon from "../../../../assets/icons/next.svg?react";
import styles from "./TaskType.module.css";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Stack, Typography } from "@mui/material";
import { UpdateConfig } from "src/services/Portals/LLMPortals";
import "../../../../styles/liquidGlass.css";

export const Taskype = ({ title, subTitle }) => {
  const navigate = useNavigate();
  const projectId = useParams().projectId;
  const experimentId = useParams().experimentId;
  const navigatetoPrepare = async (e) => {
    debugger;
    await UpdateConfig(experimentId,"train",{type:e==="pretrain"?"pretrain":"sft"});
    navigate(`/llm/${projectId}/Experiment/${experimentId}/${e}/prepare`);
  };
  
  return (
    <Box sx={{
      padding: "24px",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)"
    }}>
      {/* Header Section */}
      <Box
        className={`${styles["type-title-ctn"]} liquid-glass-card-neutral`}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Box
            sx={{
              cursor: "pointer",
              p: 1,
              borderRadius: "12px",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "rgba(84, 32, 232, 0.1)",
                transform: "scale(1.05)"
              }
            }}
            onClick={() => navigate(-1)}
          >
            <BackIcon />
          </Box>
          <Box sx={{ ml: 2 }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#6E6E88",
                fontFamily: "Plus Jakarta Sans"
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#1F1F29",
                fontFamily: "Plus Jakarta Sans"
              }}
            >
              {subTitle}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Content Section */}
      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        <Typography
          variant="h6"
          className={styles["type-page-caption"]}
          sx={{
            mb: 4,
            textAlign: "center",
            fontSize: "18px",
            fontWeight: 600,
            color: "#3F3F50",
            fontFamily: "Plus Jakarta Sans"
          }}
        >
          Choose the task type you want to perform:
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{
            justifyContent: "center",
            alignItems: "stretch"
          }}
        >
          <Box
            className={`${styles["cus-box"]} liquid-glass-card-neutral`}
            onClick={() => navigatetoPrepare("pretrain")}
            sx={{
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-8px) scale(1.02)",
                boxShadow: "0 20px 40px rgba(84, 32, 232, 0.15)",
              }
            }}
          >
            <Box className={styles["cus-ctn"]}>
              <Box className={styles["img-box"]}>
                <DatabaseIcon />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#1F1F29",
                  fontFamily: "Plus Jakarta Sans"
                }}
              >
                Pre-Train LLM
              </Typography>
            </Box>
            <NavigateNextIcon sx={{ color: "#5420E8" }} />
          </Box>

          <Box
            className={`${styles["cus-box"]} liquid-glass-card-neutral`}
            onClick={() => navigatetoPrepare("sft")}
            sx={{
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-8px) scale(1.02)",
                boxShadow: "0 20px 40px rgba(84, 32, 232, 0.15)",
              }
            }}
          >
            <Box className={styles["cus-ctn"]}>
              <Box className={styles["img-box"]}>
                <SettingsIcon className={styles["stroke-only"]}/>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#1F1F29",
                  fontFamily: "Plus Jakarta Sans"
                }}
              >
                Fine-Tune LLM
              </Typography>
            </Box>
            <NavigateNextIcon sx={{ color: "#5420E8" }} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
