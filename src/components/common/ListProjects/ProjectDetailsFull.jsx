import { Box, Typography, Chip, Divider, Button, IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "../../../styles/liquidGlass.css";

export default function ProjectDetailsFull({ project, onBack, isMobile = false }) {
  if (!project) return null;

  const viewProjectButtonStyles = {
    borderRadius: '18px',
    fontWeight: 700,
    textTransform: 'none',
    fontSize: isMobile ? '14px' : '15px',
    padding: isMobile ? '10px 16px' : '10px 20px',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(30,144,255,0.15) 50%, rgba(255,165,0,0.20) 100%)',
    color: '#1E90FF',
    boxShadow: '0 6px 24px rgba(30,144,255,0.20), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(30,144,255,0.1)',
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.4)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    width: isMobile ? '100%' : 'auto',
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
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: '1px',
      borderRadius: '17px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(84,32,232,0.05) 100%)',
      zIndex: -1,
    },
    '&:hover': {
      background: 'linear-gradient(135deg, rgba(30,144,255,0.20) 0%, rgba(255,165,0,0.25) 50%, rgba(255,255,255,0.15) 100%)',
      color: '#1E90FF',
      transform: isMobile ? 'none' : 'translateY(-2px) scale(1.02)',
      boxShadow: '0 10px 32px rgba(30,144,255,0.35), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(30,144,255,0.2)',
      border: '1px solid rgba(255,255,255,0.6)',
      '&::before': {
        left: '100%',
      },
    },
    '&:active': {
      transform: 'translateY(0) scale(0.98)',
      transition: 'all 0.1s ease',
    },
  };

  const handleViewProject = () => {
    if (project.proj_type === 'llm') {
      window.location.href = `/llm/${project.proj_id}`;
    } else {
      window.location.href = `/tabular/${project.proj_id}`;
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4, width: '100%', maxWidth: 900, mx: 'auto', boxSizing: 'border-box' }}>
      {/* Mobile Back Button */}
      {isMobile && onBack && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={onBack} sx={{ mr: 1, color: '#5420E8' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ fontWeight: 600, color: '#1F1F29' }}>Back to Projects</Typography>
        </Box>
      )}

      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 1 : 2,
        mb: 1
      }}>
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700} sx={{ mr: isMobile ? 0 : 2 }}>
          {project.proj_name}
        </Typography>

        {/* Meta info row */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
          width: isMobile ? '100%' : 'auto'
        }}>
          <Typography sx={{ color: '#8D8DAC', fontSize: isMobile ? 13 : 15 }}>
            {project.experiments} Experiments
          </Typography>
          <Typography sx={{ color: '#8D8DAC', fontSize: isMobile ? 13 : 15 }}>
            Created {new Date(project.ts).toLocaleDateString()} {new Date(project.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
          <Chip
            label={project.status}
            size="small"
            color={project.status === 'active' ? 'success' : project.status === 'completed' ? 'info' : 'default'}
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>

        {/* View Project Button - Desktop only here */}
        {!isMobile && (
          <Button
            variant="contained"
            sx={{ ml: 'auto', ...viewProjectButtonStyles }}
            startIcon={<VisibilityIcon sx={{ fontSize: '18px' }} />}
            onClick={handleViewProject}
          >
            View Project
          </Button>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Cards Section */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 2 : 3, mb: 3 }}>
        <Box className="liquid-glass-card-neutral" sx={{ flex: 1, p: isMobile ? 2 : 3 }}>
          <Typography fontWeight={700} mb={1} sx={{ color: '#1F1F29', position: 'relative', zIndex: 1 }}>
            Description
          </Typography>
          <Typography color="text.secondary" sx={{ position: 'relative', zIndex: 1, fontSize: isMobile ? 14 : 16 }}>
            {project.description}
          </Typography>
        </Box>
        <Box className="liquid-glass-card-neutral" sx={{ flex: 1, p: isMobile ? 2 : 3 }}>
          <Typography fontWeight={700} mb={1} sx={{ color: '#1F1F29', position: 'relative', zIndex: 1 }}>
            Project Statistics
          </Typography>
          <Typography fontSize={isMobile ? 14 : 15} mb={0.5} sx={{ position: 'relative', zIndex: 1 }}>
            <b>Total Experiments</b> <span style={{ float: 'right' }}>{project.experiments}</span>
          </Typography>
          <Typography fontSize={isMobile ? 14 : 15} mb={0.5} sx={{ position: 'relative', zIndex: 1 }}>
            <b>Status</b> <span style={{ float: 'right', textTransform: 'capitalize' }}>{project.status}</span>
          </Typography>
          <Typography fontSize={isMobile ? 14 : 15} sx={{ position: 'relative', zIndex: 1 }}>
            <b>Last Modified</b> <span style={{ float: 'right' }}>{new Date(project.ts).toLocaleString()}</span>
          </Typography>
        </Box>
      </Box>

      {/* Activity Section */}
      <Box className="liquid-glass-card-neutral" sx={{ p: isMobile ? 2 : 3 }}>
        <Typography fontWeight={700} mb={2} sx={{ color: '#1F1F29', position: 'relative', zIndex: 1 }}>
          Recent Activity
        </Typography>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography fontSize={isMobile ? 14 : 15} color="success.main" mb={0.5}>
            • Project created <span style={{ color: '#8D8DAC', marginLeft: 8 }}>{new Date(project.ts).toLocaleString()}</span>
          </Typography>
          <Typography fontSize={isMobile ? 14 : 15} color="info.main">
            • First experiment added <span style={{ color: '#8D8DAC', marginLeft: 8 }}>{new Date(project.ts).toLocaleString()}</span>
          </Typography>
        </Box>
      </Box>

      {/* Mobile View Project Button - at bottom */}
      {isMobile && (
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            sx={viewProjectButtonStyles}
            startIcon={<VisibilityIcon sx={{ fontSize: '18px' }} />}
            onClick={handleViewProject}
          >
            View Project
          </Button>
        </Box>
      )}
    </Box>
  );
}
