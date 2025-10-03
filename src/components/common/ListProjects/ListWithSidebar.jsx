import { useState } from "react";
import { Box, List, ListItem, ListItemText, Divider, Drawer, Typography } from "@mui/material";

export default function ListWithSidebar({ items, renderDetails, sidebarWidth = 350 }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <Box
        sx={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          borderRight: "1px solid #eee",
          bgcolor: "#fafbfc",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <List disablePadding>
          {items.map((item, idx) => (
            <ListItem
              button
              key={item.proj_id || idx}
              selected={selectedIndex === idx}
              onClick={() => setSelectedIndex(idx)}
              sx={{
                py: 1.5,
                px: 2,
                bgcolor: selectedIndex === idx ? "#f1edfd" : "inherit",
                borderLeft: selectedIndex === idx ? "4px solid #1E90FF" : "4px solid transparent",
                transition: "background 0.2s, border 0.2s",
                cursor: "pointer",
              }}
            >
              <ListItemText
                primary={<Typography fontWeight={selectedIndex === idx ? 700 : 500}>{item.proj_name}</Typography>}
                secondary={item.description}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ flex: 1, p: 0, height: "100%", overflowY: "auto" }}>
        {items.length > 0 ? renderDetails(items[selectedIndex]) : <Typography sx={{ p: 3 }}>No items</Typography>}
      </Box>
    </Box>
  );
}
