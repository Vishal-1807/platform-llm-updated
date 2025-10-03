import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import styles from "./ListExperiments.module.css";
import NoDataImageUrl from "../../../assets/images/nodata.svg?url";
import PlusCircleIcon from "../../../assets/icons/pluscircle.svg?react";
import ListExperimentsWithSidebar from "./ListExperimentsWithSidebar";
import ExperimentHeader from "../ExperimentHeader/ExperimentHeader";
import "../../../styles/liquidGlass.css";
export default function ListExperiments({
  experiments,
  onClickAdd,
  experimentsColumnDef,
  onClickRow,
  projectData = {}
}) {
  // Handle experiment view navigation
  const handleViewExperiment = (experiment) => {
    if (onClickRow) {
      // Create a mock event object similar to DataGrid's onRowClick
      const mockEvent = {
        row: experiment
      };
      onClickRow(mockEvent, experiment.exp_id);
    }
  };

  return (
    <div style={{ padding: "24px", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Horizontal Cards Header */}
      <ExperimentHeader
        projectData={projectData}
        onAddExperiment={onClickAdd}
      />

      {experiments.length === 0 ? (
        <Box sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3
        }}>
          <img src={NoDataImageUrl} width="336" alt="No data" />
          <Box sx={{
            textAlign: "center",
            maxWidth: 400
          }}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ color: '#3F3F50', mb: 1 }}
            >
              No Experiments Available
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#6E6E88', mb: 3 }}
            >
              Currently, there are no experiments to display. Create your first experiment to get started with machine learning.
            </Typography>
          </Box>
          <Button
            className="liquid-glass-btn"
            onClick={onClickAdd}
            sx={{
              display: "flex",
              gap: "8px",
              px: 4,
              py: 1.5
            }}
          >
            <PlusCircleIcon />
            <span>Create First Experiment</span>
          </Button>
        </Box>
      ) : (
        <Box sx={{
          flex: 1,
          border: "1px solid #eeeef8",
          borderRadius: "16px",
          overflow: "hidden",
          minHeight: 0,
          display: "flex",
          flexDirection: "column"
        }}>
          <ListExperimentsWithSidebar
            experiments={experiments}
            onViewExperiment={handleViewExperiment}
            onClickAdd={onClickAdd}
          />
        </Box>
      )}
    </div>
  );
}
