import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExperimentListSidebar from "./ExperimentListSidebar";
import ExperimentDetailsFull from "./ExperimentDetailsFull";
import "../../../styles/liquidGlass.css";

export default function ListExperimentsWithSidebar({ 
  experiments, 
  onViewExperiment,
  onClickAdd 
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filtered, setFiltered] = useState(experiments);

  const handleFilter = (search) => {
    if (!search) {
      setFiltered(experiments);
      setSelectedIndex(0);
    } else {
      const s = search.toLowerCase();
      const filteredList = experiments.filter((experiment) => {
        const name = experiment.name || experiment.exp_name || experiment.experiment_name || '';
        const description = experiment.description || experiment.desc || '';
        const expId = experiment.exp_id || '';
        const status = experiment.status || '';
        
        return (
          name.toLowerCase().includes(s) ||
          description.toLowerCase().includes(s) ||
          expId.toString().toLowerCase().includes(s) ||
          status.toLowerCase().includes(s)
        );
      });
      setFiltered(filteredList);
      setSelectedIndex(0);
    }
  };

  // Update filtered experiments when experiments prop changes
  React.useEffect(() => {
    setFiltered(experiments);
    setSelectedIndex(0);
  }, [experiments]);

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <ExperimentListSidebar
        items={filtered}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        onFilter={handleFilter}
      />
      <Box sx={{ flex: 1, p: 0, height: "100%", overflowY: "auto" }}>
        {filtered.length > 0 ? (
          <ExperimentDetailsFull 
            experiment={filtered[selectedIndex]} 
            onViewExperiment={onViewExperiment}
          />
        ) : (
          <Box sx={{ 
            p: 5, 
            color: '#8D8DAC',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '95%'
          }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              No experiments found
            </Typography>
            <Typography variant="body1" textAlign="center" mb={3}>
              Try adjusting your search terms or create a new experiment to get started.
            </Typography>
            {onClickAdd && (
              <Button
                variant="contained"
                className="liquid-glass-btn"
                onClick={onClickAdd}
                startIcon={<AddIcon />}
              >
                Create Experiment
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
