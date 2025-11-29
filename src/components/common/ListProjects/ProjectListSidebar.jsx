import { useState } from "react";
import { Box, List, ListItem, Typography, InputBase, Chip, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "../../../styles/liquidGlass.css";

const statusColors = {
  active: "success",
  completed: "info",
  draft: "default",
};

export default function ProjectListSidebar({ items, selectedIndex, setSelectedIndex, onFilter, isMobile = false }) {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onFilter(e.target.value);
  };

  return (
    <Box
      sx={{
        width: isMobile ? '100%' : 320,
        minWidth: isMobile ? '100%' : 320,
        bgcolor: "transparent",
        borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.2)",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
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
            py: isMobile ? 1 : 0.5,
            fontSize: isMobile ? 16 : 15,
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
                py: isMobile ? 2 : 1.5,
                px: 2,
                borderLeft: !isMobile && selectedIndex === idx ? "4px solid #5420E8" : "none",
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
                <Typography sx={{ fontWeight: 700, fontSize: isMobile ? 17 : 16, color: '#1F1F29' }}>
                  {item.proj_name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: isMobile ? 14 : 13, color: '#8D8DAC' }}>
                    ⦿ {item.experiments} Experiments
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? 14 : 13, color: '#8D8DAC' }}>
                    • {new Date(item.ts).toLocaleDateString()} {new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: isMobile ? 14 : 13,
                    color: '#8D8DAC',
                    mt: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <Chip
                  label={item.status}
                  size="small"
                  color={statusColors[item.status] || 'default'}
                  sx={{ textTransform: 'capitalize', position: 'relative', zIndex: 1 }}
                />
                {isMobile && (
                  <ChevronRightIcon sx={{ color: '#8D8DAC', fontSize: 24 }} />
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
