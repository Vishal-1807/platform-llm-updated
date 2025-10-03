import { useState } from "react";
import { 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Typography, 
  TextField, 
  InputAdornment,
  Chip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "../.././../styles/liquidGlass.css";

export default function ExperimentListSidebar({ 
  items, 
  selectedIndex, 
  setSelectedIndex, 
  onFilter 
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onFilter(value);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    
    const statusLower = status.toLowerCase();
    let badgeClass = "experiment-status-badge ";
    
    if (statusLower.includes("running") || statusLower.includes("training")) {
      badgeClass += "running";
    } else if (statusLower.includes("completed") || statusLower.includes("finished") || statusLower.includes("success")) {
      badgeClass += "completed";
    } else if (statusLower.includes("failed") || statusLower.includes("error")) {
      badgeClass += "failed";
    } else {
      badgeClass += "pending";
    }

    return (
      <span className={badgeClass}>
        {status}
      </span>
    );
  };

  const getExperimentName = (experiment) => {
    return experiment.name || experiment.exp_name || experiment.experiment_name || `Experiment ${experiment.exp_id}`;
  };

  const getExperimentDescription = (experiment) => {
    return experiment.description || experiment.desc || `Created ${formatDate(experiment.ts)}`;
  };

  return (
    <Box
      sx={{
        width: 400,
        minWidth: 400,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "transparent",
      }}
    >
      {/* Search Header */}
      <Box sx={{ p: 2, bgcolor: "transparent" }}>
        <Typography 
          variant="h6" 
          fontWeight={700} 
          sx={{ mb: 2, color: '#1F1F29' }}
        >
          Experiments ({items.length})
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search experiments..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="liquid-glass-input"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'transparent',
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
              },
            },
            '& .MuiInputBase-input': {
              color: '#1F1F29',
              fontSize: '14px',
              '&::placeholder': {
                color: '#8D8DAC',
                opacity: 1,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#8D8DAC', fontSize: '20px' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      
      {/* Experiments List */}
      <Box sx={{
        flex: 1,
        overflowY: "auto",
        p: 1,
        bgcolor: "transparent",
        minHeight: 0
      }}>
        <List disablePadding sx={{ bgcolor: "transparent" }}>
          {items.map((experiment, idx) => (
            <ListItem
              button
              key={experiment.exp_id || idx}
              selected={selectedIndex === idx}
              onClick={() => setSelectedIndex(idx)}
              className={`liquid-glass-list-item-premium ${selectedIndex === idx ? 'selected' : ''}`}
              sx={{
                alignItems: 'flex-start',
                cursor: "pointer",
                mb: 0.75,
                py: 1.25,
                px: 1.5,
                borderLeft: selectedIndex === idx ? "4px solid #5420E8" : "none",
                bgcolor: 'transparent !important',
                '&.liquid-glass-list-item-premium': {
                  bgcolor: 'transparent !important',
                },
                '&:hover': {
                  bgcolor: 'transparent !important',
                },
                '&.Mui-selected': {
                  bgcolor: 'transparent !important',
                },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography
                      fontWeight={selectedIndex === idx ? 700 : 600}
                      sx={{
                        color: '#1F1F29',
                        fontSize: '15px',
                        position: 'relative',
                        zIndex: 1,
                        lineHeight: 1.2
                      }}
                    >
                      {getExperimentName(experiment)}
                    </Typography>

                    {/* Status and ID */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                      {experiment.status && getStatusBadge(experiment.status)}
                      <Typography
                        sx={{
                          color: '#8D8DAC',
                          fontSize: '11px',
                          fontWeight: 500,
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        ID: {experiment.exp_id}
                      </Typography>
                    </Box>
                  </Box>
                }
                secondary={
                  <Typography
                    sx={{
                      color: '#6E6E88',
                      fontSize: '12px',
                      mt: 0.5,
                      position: 'relative',
                      zIndex: 1,
                      lineHeight: 1.3
                    }}
                  >
                    {getExperimentDescription(experiment)}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
        
        {items.length === 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '200px',
            color: '#8D8DAC'
          }}>
            <Typography variant="body1" fontWeight={600}>
              No experiments found
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first experiment to get started'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
