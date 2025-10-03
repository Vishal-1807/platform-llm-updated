import { useState } from "react";
import { Box } from "@mui/material";
import ProjectListSidebar from "./ProjectListSidebar";
import ProjectDetailsFull from "./ProjectDetailsFull";

export default function ListWithSidebarFull({ items }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filtered, setFiltered] = useState(items);

  const handleFilter = (search) => {
    if (!search) {
      setFiltered(items);
      setSelectedIndex(0);
    } else {
      const s = search.toLowerCase();
      const filteredList = items.filter(
        (item) =>
          item.proj_name.toLowerCase().includes(s) ||
          (item.description && item.description.toLowerCase().includes(s))
      );
      setFiltered(filteredList);
      setSelectedIndex(0);
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <ProjectListSidebar
        items={filtered}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        onFilter={handleFilter}
      />
      <Box sx={{ flex: 1, p: 0, height: "100%", overflowY: "auto" }}>
        {filtered.length > 0 ? (
          <ProjectDetailsFull project={filtered[selectedIndex]} />
        ) : (
          <Box sx={{ p: 5, color: '#8D8DAC' }}>No projects found.</Box>
        )}
      </Box>
    </Box>
  );
}
