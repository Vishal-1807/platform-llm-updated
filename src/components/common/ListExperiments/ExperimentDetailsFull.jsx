import { Box, Typography, Button, Divider, Grid, Chip, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DownloadIcon from "@mui/icons-material/Download";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../../../styles/liquidGlass.css";

export default function ExperimentDetailsFull({ experiment, onViewExperiment, isMobile = false, onBack }) {
  if (!experiment) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getExperimentName = () => {
    return experiment.name || experiment.exp_name || experiment.experiment_name || `Experiment ${experiment.exp_id}`;
  };

  const getExperimentDescription = () => {
    return experiment.description || experiment.desc || "No description available";
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

  const getMetricValue = (key, value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "number") {
      return value.toFixed(4);
    }
    return String(value);
  };

  const renderExperimentMetrics = () => {
    const excludeKeys = ['exp_id', 'name', 'exp_name', 'experiment_name', 'description', 'desc', 'ts', 'status', 'train_config'];
    const metrics = Object.entries(experiment).filter(([key]) => !excludeKeys.includes(key));
    
    if (metrics.length === 0) return null;

    return (
      <Box className="liquid-glass-card-neutral" sx={{ p: 3, mb: 3 }}>
        <Typography fontWeight={700} mb={2} sx={{ color: '#1F1F29', position: 'relative', zIndex: 1 }}>
          Experiment Metrics
        </Typography>
        <Grid container spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
          {metrics.map(([key, value]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Box sx={{ mb: 1 }}>
                <Typography 
                  fontSize={13} 
                  fontWeight={600} 
                  sx={{ color: '#6E6E88', textTransform: 'capitalize', mb: 0.5 }}
                >
                  {key.split('_').join(' ')}
                </Typography>
                <Typography 
                  fontSize={15} 
                  fontWeight={700}
                  sx={{ color: '#1F1F29' }}
                >
                  {getMetricValue(key, value)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderTrainConfig = () => {
    if (!experiment.train_config) return null;

    const config = experiment.train_config;
    return (
      <Box className="liquid-glass-card-neutral" sx={{ p: 3, mb: 3 }}>
        <Typography fontWeight={700} mb={2} sx={{ color: '#1F1F29', position: 'relative', zIndex: 1 }}>
          Training Configuration
        </Typography>
        <Grid container spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
          {Object.entries(config).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <Typography fontSize={14} mb={0.5} sx={{ color: '#6E6E88', textTransform: 'capitalize' }}>
                <b>{key.split('_').join(' ')}</b>
              </Typography>
              <Typography fontSize={15} sx={{ color: '#1F1F29' }}>
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const viewDetailsButtonStyles = {
    minWidth: isMobile ? '100%' : 160,
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
      transform: isMobile ? 'none' : 'translateY(-2px) scale(1.02)',
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
  };

  return (
    <Box sx={{
      p: isMobile ? 2 : 4,
      width: '100%',
      maxWidth: 1000,
      mx: 'auto',
      boxSizing: 'border-box',
      height: '100%',
      overflowY: 'auto'
    }}>
      {/* Mobile Back Button */}
      {isMobile && onBack && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={onBack} sx={{ mr: 1, color: '#5420E8' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ fontWeight: 600, color: '#1F1F29' }}>Back to Experiments</Typography>
        </Box>
      )}

      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'flex-start',
        justifyContent: 'space-between',
        mb: 3
      }}>
        <Box sx={{ flex: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700} sx={{ mr: isMobile ? 0 : 2 }}>
              {getExperimentName()}
            </Typography>
            {experiment.status && getStatusBadge(experiment.status)}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 2 : 3, mb: 2, flexWrap: 'wrap' }}>
            <Typography sx={{ color: '#8D8DAC', fontSize: isMobile ? 13 : 15 }}>
              ID: {experiment.exp_id}
            </Typography>
            <Typography sx={{ color: '#8D8DAC', fontSize: isMobile ? 13 : 15 }}>
              Created {formatDate(experiment.ts)}
            </Typography>
          </Box>

          <Typography sx={{ color: '#6E6E88', fontSize: isMobile ? 14 : 16, lineHeight: 1.5, mb: 2 }}>
            {getExperimentDescription()}
          </Typography>
        </Box>

        {/* Action Button - Desktop only here */}
        {!isMobile && (
          <Button
            variant="contained"
            className="liquid-glass-btn liquid-glass-btn-lg"
            sx={{ ml: 2, ...viewDetailsButtonStyles }}
            startIcon={<VisibilityIcon sx={{ fontSize: '18px' }} />}
            onClick={() => onViewExperiment && onViewExperiment(experiment)}
          >
            View Details
          </Button>
        )}
      </Box>

      <Divider sx={{ my: isMobile ? 2 : 3 }} />

      {/* Quick Stats */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 2 : 3, mb: 3 }}>
        <Box className="liquid-glass-card-neutral" sx={{ flex: 1, minWidth: isMobile ? 'auto' : 250, p: isMobile ? 2 : 3 }}>
          <Typography fontWeight={700} mb={1} sx={{ color: '#1F1F29', position: 'relative', zIndex: 1 }}>
            Experiment Info
          </Typography>
          <Typography fontSize={isMobile ? 14 : 15} mb={0.5} sx={{ position: 'relative', zIndex: 1 }}>
            <b>Status</b>
            <span style={{ float: 'right' }}>
              {experiment.status ? experiment.status : 'Unknown'}
            </span>
          </Typography>
          <Typography fontSize={isMobile ? 14 : 15} mb={0.5} sx={{ position: 'relative', zIndex: 1 }}>
            <b>Type</b>
            <span style={{ float: 'right' }}>
              {experiment.train_config?.type || 'Standard'}
            </span>
          </Typography>
          <Typography fontSize={isMobile ? 14 : 15} sx={{ position: 'relative', zIndex: 1 }}>
            <b>Created</b>
            <span style={{ float: 'right' }}>
              {formatDate(experiment.ts)}
            </span>
          </Typography>
        </Box>
      </Box>

      {/* Training Configuration */}
      {renderTrainConfig()}

      {/* Experiment Metrics */}
      {renderExperimentMetrics()}

      {/* Recent Activity */}
      <Box className="liquid-glass-card-neutral" sx={{ p: isMobile ? 2 : 3 }}>
        <Typography fontWeight={700} mb={2} sx={{ color: '#1F1F29', position: 'relative', zIndex: 1 }}>
          Recent Activity
        </Typography>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography fontSize={isMobile ? 14 : 15} color="success.main" mb={0.5}>
            • Experiment created
            <span style={{ color: '#8D8DAC', marginLeft: 8 }}>
              {formatDate(experiment.ts)}
            </span>
          </Typography>
          {experiment.status && (
            <Typography fontSize={isMobile ? 14 : 15} color="info.main">
              • Status updated to {experiment.status}
              <span style={{ color: '#8D8DAC', marginLeft: 8 }}>
                {formatDate(experiment.ts)}
              </span>
            </Typography>
          )}
        </Box>
      </Box>

      {/* Mobile View Details Button - at bottom */}
      {isMobile && (
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            className="liquid-glass-btn liquid-glass-btn-lg"
            sx={viewDetailsButtonStyles}
            startIcon={<VisibilityIcon sx={{ fontSize: '18px' }} />}
            onClick={() => onViewExperiment && onViewExperiment(experiment)}
          >
            View Details
          </Button>
        </Box>
      )}
    </Box>
  );
}
