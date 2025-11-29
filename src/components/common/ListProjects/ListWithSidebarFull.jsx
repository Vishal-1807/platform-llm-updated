import { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import ProjectListSidebar from "./ProjectListSidebar";
import ProjectDetailsFull from "./ProjectDetailsFull";

export default function ListWithSidebarFull({ items }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filtered, setFiltered] = useState(items);
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'details'

  const isMobile = useMediaQuery('(max-width: 767px)');

  // Update filtered when items change
  useEffect(() => {
    setFiltered(items);
  }, [items]);

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

  const handleSelectProject = (index) => {
    setSelectedIndex(index);
    if (isMobile) {
      setMobileView('details');
    }
  };

  const handleBackToList = () => {
    setMobileView('list');
  };

  // Mobile layout
  if (isMobile) {
    return (
      <Box sx={{ width: "100%", height: "100%" }}>
        {mobileView === 'list' ? (
          <ProjectListSidebar
            items={filtered}
            selectedIndex={selectedIndex}
            setSelectedIndex={handleSelectProject}
            onFilter={handleFilter}
            isMobile={true}
          />
        ) : (
          <Box sx={{ width: "100%", height: "100%", overflowY: "auto" }}>
            {filtered.length > 0 ? (
              <ProjectDetailsFull
                project={filtered[selectedIndex]}
                onBack={handleBackToList}
                isMobile={true}
              />
            ) : (
              <Box sx={{ p: 3, color: '#8D8DAC' }}>No projects found.</Box>
            )}
          </Box>
        )}
      </Box>
    );
  }

  // Desktop layout
  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <ProjectListSidebar
        items={filtered}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        onFilter={handleFilter}
        isMobile={false}
      />
      <Box sx={{ flex: 1, p: 0, height: "100%", overflowY: "auto" }}>
        {filtered.length > 0 ? (
          <ProjectDetailsFull project={filtered[selectedIndex]} isMobile={false} />
        ) : (
          <Box sx={{ p: 5, color: '#8D8DAC' }}>No projects found.</Box>
        )}
      </Box>
    </Box>
  );
}
