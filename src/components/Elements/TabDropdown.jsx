import { useState } from "react";
import { Menu, MenuItem, Button, Box } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const tabOptions = [
  { label: "All Projects", value: 0 },
  { label: "Playground", value: 1 },
  { label: "Model Catalogue", value: 2 },
];

export default function TabDropdown({ value, onChange, variant = "default" }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (val) => {
    onChange(val);
    handleClose();
  };

  // Minimal sidebar style similar to the image
  if (variant === "sidebar") {
    return (
      <Box sx={{ width: '100%' }}>
        {tabOptions.map((tab) => (
          <Box
            key={tab.value}
            onClick={() => onChange(tab.value)}
            sx={{
              padding: '8px 12px',
              margin: '2px 0',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: value === tab.value ? '#e6f3ff' : 'transparent',
              color: value === tab.value ? '#1976d2' : '#666',
              border: value === tab.value ? '1px solid #e3f2fd' : '1px solid transparent',
              '&:hover': {
                backgroundColor: value === tab.value ? '#e6f3ff' : '#f5f5f5',
                color: value === tab.value ? '#1976d2' : '#333',
              }
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box>
    );
  }

  // Default dropdown style for main content
  const defaultStyles = {
    fontWeight: 700,
    fontSize: 18,
    textTransform: 'none',
    minWidth: 180,
    bgcolor: '#fff',
    borderRadius: 2,
    borderColor: '#D3D3EA',
  };

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<ArrowDropDownIcon />}
        onClick={handleClick}
        sx={defaultStyles}
      >
        {tabOptions.find((t) => t.value === value)?.label}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {tabOptions.map((tab) => (
          <MenuItem
            key={tab.value}
            selected={value === tab.value}
            onClick={() => handleSelect(tab.value)}
            sx={{ fontWeight: value === tab.value ? 700 : 500 }}
          >
            {tab.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
