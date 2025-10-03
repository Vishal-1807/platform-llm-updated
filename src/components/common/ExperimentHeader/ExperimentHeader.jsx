import { Box, Typography, Button } from "@mui/material";
import DocumentIcon from "../../../assets/icons/document.svg?react";
import TimeCircleIcon from "../../../assets/icons/timecircle.svg?react";
import PlusCircleIcon from "../../../assets/icons/pluscircle.svg?react";
import BackIcon from "../../../assets/icons/back.svg?react";
import { useNavigate } from "react-router-dom";
import "../../../styles/liquidGlass.css";

export default function ExperimentHeader({ 
  projectData, 
  onAddExperiment,
  showCreateDialog 
}) {
  const navigate = useNavigate();

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    return new Date(timeStamp).toISOString().split('T')[0] + " " + new Date(timeStamp).toLocaleTimeString();
  };

  return (
    <Box sx={{ 
      display: "flex", 
      gap: 3, 
      mb: 3, 
      flexWrap: "wrap",
      alignItems: "stretch"
    }}>
      {/* Back Button and Project Info Card */}
      <Box 
        className="liquid-glass-card-neutral" 
        sx={{ 
          flex: "1 1 300px",
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          minWidth: 300
        }}
      >
        <Box 
          sx={{ 
            cursor: "pointer",
            p: 1,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(84, 32, 232, 0.1)"
            }
          }}
          onClick={() => navigate(-1)}
        >
          <BackIcon style={{ width: "20px", height: "20px", color: "#5420E8" }} />
        </Box>
        
        <Box sx={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h6" 
            fontWeight={700} 
            sx={{ color: '#1F1F29', mb: 0.5, lineHeight: 1.2 }}
          >
            {projectData.proj_name || "Project"}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: '#6E6E88', lineHeight: 1.3 }}
          >
            {projectData.description || "No description available"}
          </Typography>
        </Box>
      </Box>

      {/* Experiments Count Card */}
      <Box 
        className="liquid-glass-card-neutral" 
        sx={{ 
          flex: "0 1 200px",
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          minWidth: 180
        }}
      >
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#eee9fd",
          borderRadius: "50%",
          padding: "12px",
          flexShrink: 0
        }}>
          <DocumentIcon style={{ width: "20px", height: "20px", color: "#5420E8" }} />
        </Box>
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h5" 
            fontWeight={700} 
            sx={{ color: '#1F1F29', lineHeight: 1 }}
          >
            {projectData.experiments?.length || 0}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: '#6E6E88', fontSize: 12, fontWeight: 500 }}
          >
            Experiments
          </Typography>
        </Box>
      </Box>

      {/* Created Date Card */}
      <Box 
        className="liquid-glass-card-neutral" 
        sx={{ 
          flex: "0 1 220px",
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          minWidth: 200
        }}
      >
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#eee9fd",
          borderRadius: "50%",
          padding: "12px",
          flexShrink: 0
        }}>
          <TimeCircleIcon style={{ width: "20px", height: "20px", color: "#5420E8" }} />
        </Box>
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="body1" 
            fontWeight={600} 
            sx={{ color: '#1F1F29', fontSize: 14, lineHeight: 1.2 }}
          >
            Created
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: '#6E6E88', fontSize: 12, fontWeight: 500 }}
          >
            {formatDate(projectData.ts)}
          </Typography>
        </Box>
      </Box>

      {/* Add Experiment Button Card */}
      <Box 
        sx={{ 
          flex: "0 1 200px",
          display: "flex",
          alignItems: "center",
          minWidth: 180
        }}
      >
        <Button
          className="liquid-glass-btn"
          onClick={onAddExperiment}
          sx={{
            width: "100%",
            height: "100%",
            minHeight: "80px",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              transition: 'left 0.6s ease',
            },
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(84,32,232,0.20) 0%, rgba(224,78,248,0.25) 50%, rgba(255,255,255,0.15) 100%)',
              color: '#5420E8',
              transform: 'translateY(-2px) scale(1.02)',
              boxShadow: '0 10px 32px rgba(84,32,232,0.35), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(84,32,232,0.2)',
              border: '1px solid rgba(255,255,255,0.6)',
              '&::before': {
                left: '100%',
              },
            },
            '&:active': {
              transform: 'translateY(0) scale(0.98)',
              transition: 'all 0.1s ease',
            },
          }}
        >
          <PlusCircleIcon style={{ width: "24px", height: "24px" }} />
          <Typography 
            variant="body2" 
            fontWeight={600}
            sx={{ textTransform: "none", fontSize: 14 }}
          >
            Add Experiment
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}
