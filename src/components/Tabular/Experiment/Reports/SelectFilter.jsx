import { Box, Slider, MenuItem, FormControl, Select } from "@mui/material";
export const SelectFilter = ({ value, selectedFromRange, selectedToRange }) => {
  const ItemsList = [
    { name: "Last 5 minutes", from: "now-5m", to: "now" },
    { name: "Last 15 minutes", from: "now-15m", to: "now" },
    { name: "Last 30 minutes", from: "now-30m", to: "now" },
    { name: "Last 1 hour", from: "now-1h", to: "now" },
    { name: "Last 3 hours", from: "now-3h", to: "now" },
    { name: "Last 6 hours", from: "now-6h", to: "now" },
    { name: "Last 12 hours", from: "now-12h", to: "now" },
    { name: "Last 24 hours", from: "now-24h", to: "now" },
    { name: "Last 2 days", from: "now-2d", to: "now" },
    { name: "Last 7 days", from: "now-7d", to: "now" },
    { name: "Last 30 days", from: "now-30d", to: "now" },
    { name: "Last 90 days", from: "now-90d", to: "now" },
    { name: "Last 6 months", from: "now-6M", to: "now" },
    { name: "Last 1 year", from: "now-1y", to: "now" },
    { name: "Last 2 years", from: "now-2y", to: "now" },
    { name: "Last 5 years", from: "now-5y", to: "now" },
    { name: "Yesterday", from: "now-1d%2Fd", to: "now-1d%2Fd" },
    { name: "Day before Yesterday", from: "now-2d%2Fd", to: "now-2d%2Fd" },
    { name: "This day last week", from: "now-7d%2Fd", to: "now-7d%2Fd" },
    { name: "Previous week", from: "now-1w%2Fw", to: "now-1w%2Fw" },
    { name: "Previous month", from: "now-1M%2FM", to: "now-1M%2FM" },
    { name: "Previous fiscal quarter", from: "now-1Q%2FfQ", to: "now-1Q%2FfQ" },
    { name: "Previous year", from: "now-1y%2Fy", to: "now-1y%2Fy" },
    { name: "Previous fiscal year", from: "now-1y%2Ffy", to: "now-1y%2Ffy" },
    { name: "Today", from: "now%2Fd", to: "now%2Fd" },
    { name: "Today so far", from: "now%2Fd", to: "now" },
    { name: "This week", from: "now%2Fw", to: "now%2Fw" },
    { name: "This week so far", from: "now%2Fw", to: "now" },
    { name: "This month", from: "now%2FM", to: "now%2FM" },
    { name: "This month so far", from: "now%2FM", to: "now" },
    { name: "This year", from: "now%2Fy", to: "now%2Fy" },
    { name: "This year so far", from: "now%2Fy", to: "now" },
    { name: "This fiscal quarter so far", from: "now%2FfQ", to: "now" },
    { name: "This fiscal quarter", from: "now%2FfQ", to: "now%2FfQ" },
    { name: "This fiscal year so far", from: "now%2Ffy", to: "now" },
  ];

  const handleChange = (e) => {
    const filteredItem = ItemsList.find((item) => item.from === e.target.value);
    selectedFromRange(filteredItem.from);
    selectedToRange(filteredItem.to);
  };

  const MenuProps = {
    PaperProps: {
      style: {
        height: "200px",
        width: 100,
        color: "#1F1F29",
        font: "Plus Jakarta Sans",
      
      },
    },
  };


  return (
    <>
      {/* <LableNames></LableNames> */}
      <FormControl
        sx={{
          width: "auto",
          mt: 0,
          background: "#fff",
          ml:2,
          borderRadius:"10px"
        }}
      >
        <Box sx={{ position: "relative" }}>
          <div
            style={{
              width: "80px",
              position: "absolute",
              top: "16px",
              left: "10px",
              fontSize: "14px",
              color: "#E04EF8",
            }}
          >
            Sort By:
          </div>
          <Select
            sx={{ ml: 0, pl: 7,borderRadius:"10px",fontSize:"14px" }}
            placeholder="Ranges"
            variant="outlined"
            name="Ranges"
            value={value}
            onChange={(e) => handleChange(e)}
            MenuProps={MenuProps}
          >
            {ItemsList.map((obj, i) => (
              <MenuItem key={i} value={obj.from}>
                {obj.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </FormControl>
    </>
  );
};
