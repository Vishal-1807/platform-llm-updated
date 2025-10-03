import { Box, Typography, Divider } from "@mui/material";

export default function ProjectDetails({ project }) {
  if (!project) return null;
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {project.proj_name}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {project.description}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <b>Experiments:</b> {project.experiments}
        </Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <b>Created:</b> {new Date(project.ts).toLocaleString()}
        </Typography>
      </Box>
      {/* Add more details as needed */}
    </Box>
  );
}
