import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import penguinlogo from "../../assets/LoginImages/penguin.svg";
import Penguinai from "../../assets/Penguinai.png";

function Header({ open, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = () => {
    // Clear localStorage instead of sessionStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    // Call the logout handler passed from App component
    if (onLogout) {
      onLogout();
    } else {
      // Fallback: force page reload to reset app state
      window.location.href = "/login";
    }

    handleMenuClose();
  };

  // Get username from localStorage instead of sessionStorage
  const username = localStorage.getItem("username");

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer - 1,
        boxShadow: 2,
        bgcolor: "background.paper",
        color: "text.primary",
        top: 0,
        left: 0,
        right: 0,
        height: "64px", // Explicit height
        width: "100%",
      }}
    >
      <Toolbar
        sx={{
          height: "64px", // Match the AppBar height
          minHeight: "64px !important", // Override any default min-height
          paddingLeft: { xs: 2, sm: 3 },
          paddingRight: { xs: 2, sm: 3 },
        }}
      >
        <img style={{ height: "32px" }} src={penguinlogo} alt="Penguin" />
        <img
          style={{ width: "140px", marginLeft: "8px" }}
          src={Penguinai}
          alt="Penguin"
        />

        <Box sx={{ flexGrow: 1 }} />

        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                ml: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography sx={{ mr: 1, fontSize: "12px" }}>Welcome!</Typography>
              <Typography
                fontWeight="700"
                sx={{ fontSize: "14px", textTransform: "capitalize" }}
              >
                {username || "User"}
              </Typography>
            </Box>
            <IconButton
              color="inherit"
              size="large"
              sx={{ mx: 0.5 }}
              onClick={handleMenuOpen}
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        )}

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          sx={{
            zIndex: theme.zIndex.modal + 1, // Ensure menu appears above everything
          }}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
