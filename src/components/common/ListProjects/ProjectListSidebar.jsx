import { useState } from "react";
import { Box, List, ListItem, ListItemText, Typography, InputBase, IconButton, Chip, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "../../../styles/liquidGlass.css";

const statusColors = {
  active: "success",
  completed: "info",
  draft: "default",
};

export default function ProjectListSidebar({ items, selectedIndex, setSelectedIndex, onFilter }) {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onFilter(e.target.value);
  };

  return (
    <Box sx={{ width: 320, minWidth: 320, bgcolor: "transparent", borderRight: "1px solid rgba(255,255,255,0.2)", height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, pb: 1 }}>
        <InputBase
          placeholder="Search projects..."
          value={search}
          onChange={handleSearch}
          startAdornment={<SearchIcon sx={{ mr: 1, color: '#8D8DAC' }} />}
          className="liquid-glass-input"
          sx={{
            width: '100%',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            fontSize: 15,
            mb: 1,
            '& input': {
              color: '#333',
              '&::placeholder': {
                color: '#8D8DAC',
                opacity: 1,
              },
            },
          }}
        />
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: "auto", p: 1, bgcolor: "transparent" }}>
        <List disablePadding sx={{ bgcolor: "transparent" }}>
          {items.map((item, idx) => (
            <ListItem
              button
              key={item.proj_id || idx}
              selected={selectedIndex === idx}
              onClick={() => setSelectedIndex(idx)}
              className={`liquid-glass-list-item-premium ${selectedIndex === idx ? 'selected' : ''}`}
              sx={{
                alignItems: 'flex-start',
                cursor: "pointer",
                mb: 1,
                py: 1.5,
                px: 2,
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
                '&.Mui-selected:hover': {
                  bgcolor: 'transparent !important',
                },
              }}
            >
              <Box sx={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#1F1F29' }}>{item.proj_name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Typography sx={{ fontSize: 13, color: '#8D8DAC' }}>⦿ {item.experiments} Experiments</Typography>
                  <Typography sx={{ fontSize: 13, color: '#8D8DAC' }}>• {new Date(item.ts).toLocaleDateString()} {new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                </Box>
                <Typography sx={{ fontSize: 13, color: '#8D8DAC', mt: 0.5 }}>{item.description}</Typography>
              </Box>
              <Chip
                label={item.status}
                size="small"
                color={statusColors[item.status] || 'default'}
                sx={{ textTransform: 'capitalize', ml: 1, mt: 0.5, position: 'relative', zIndex: 1 }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
