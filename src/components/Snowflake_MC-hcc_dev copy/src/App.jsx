// App.js
import { Alert, Box, CssBaseline, Snackbar } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

// Components
import DocumentViewer from "./components/DocumentViewer";
import FileUpload from "./components/FileUpload";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import StatusTable from "./components/StatusTable";

// Material-UI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1E90FF",
      light: "#4FC3F7",
      dark: "#0066CC",
    },
    secondary: {
      main: "#FFA500",
    },
    success: {
      main: "#4caf50",
      50: "#e8f5e8",
    },
    warning: {
      main: "#ff9800",
      50: "#fff3e0",
    },
    info: {
      main: "#2196f3",
      50: "#e3f2fd",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Custom styles for chat formatting
const chatStyles = `
  .chat-section-title {
    font-weight: bold;
    font-size: 1.1em;
    margin: 16px 0 8px 0;
    color: #1976d2;
    border-bottom: 2px solid #1976d2;
    padding-bottom: 4px;
  }
  
  .chat-section-title.supported-codes {
    color: #4caf50;
    border-bottom-color: #4caf50;
  }
  
  .chat-section-title.unsupported-codes {
    color: #ff9800;
    border-bottom-color: #ff9800;
  }
  
  .chat-section-title.final-codes {
    color: #2196f3;
    border-bottom-color: #2196f3;
  }
  
  .chat-strong {
    font-weight: 600;
    color: #333;
  }
  
  .chat-emphasis {
    font-style: italic;
    color: #666;
  }
  
  .chat-cpt-label,
  .chat-icd-label {
    background-color: #e3f2fd;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
    color: #1976d2;
  }
  
  .chat-description-label,
  .chat-reason-label {
    font-weight: 500;
    color: #555;
  }
  
  .chat-divider {
    margin: 16px 0;
    border: none;
    border-top: 1px solid #e0e0e0;
  }
  
  .chat-paragraph-break {
    height: 16px;
  }
`;

// Create a wrapper component to access useNavigate
function AppContent() {
  const navigate = useNavigate();
  const [userId] = useState(() => sessionStorage.getItem("userId") || uuidv4());
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Drawer state for header
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    sessionStorage.setItem("userId", userId);

    // Inject chat styles
    const styleElement = document.createElement("style");
    styleElement.textContent = chatStyles;
    document.head.appendChild(styleElement);

    // Check for existing authentication
    const storedToken = sessionStorage.getItem("access_token");
    const storedUsername = sessionStorage.getItem("username");

    if (storedToken && storedUsername) {
      // TODO: Optionally validate token with server
      // For now, we'll trust the stored token
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }

    setIsLoading(false);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [userId]);

  const handleLogin = (loginUsername, token = null) => {
    setIsAuthenticated(true);
    setUsername(loginUsername);
    sessionStorage.setItem("username", loginUsername);

    if (token) {
      sessionStorage.setItem("access_token", token);
    }
    // Note: access_token is already stored by the Login component
  };

  const handleLogout = () => {
    // Clear authentication state
    setIsAuthenticated(false);
    setUsername("");

    // Clear sessionStorage
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("username");
    // Note: We keep userId for continuity

    // Navigate to login page
    navigate("/login");

    // Show notification
    showNotification("Logged out successfully", "success");
  };

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "text.secondary",
        }}
      >
        Loading...
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header - only show when authenticated */}
      {isAuthenticated && (
        <Header
          open={open}
          handleDrawerToggle={handleDrawerToggle}
          onLogout={handleLogout}
        />
      )}

      {/* Main content container */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: isAuthenticated ? "64px" : 0, // Use padding instead of margin
          minHeight: "100vh",
          position: "relative",
          overflow: "auto", // Ensure proper scrolling
        }}
      >
        {/* Routes container with proper scroll handling */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: isAuthenticated ? "calc(100vh - 64px)" : "100vh",
            overflow: "auto", // Enable scrolling for content
            position: "relative",
          }}
        >
          <Routes>
            {/* Login route */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/upload" replace />
                ) : (
                  <Login
                    onLogin={handleLogin}
                    showNotification={showNotification}
                  />
                )
              }
            />

            {/* Authenticated routes */}
            {isAuthenticated ? (
              <>
                <Route
                  path="/upload"
                  element={<FileUpload showNotification={showNotification} />}
                />

                <Route
                  path="/status"
                  element={<StatusTable showNotification={showNotification} />}
                />

                <Route
                  path="/document/:documentId"
                  element={
                    <DocumentViewer showNotification={showNotification} />
                  }
                />

                {/* Default route for authenticated users */}
                <Route path="/" element={<Navigate to="/upload" replace />} />

                {/* Fallback route for authenticated users */}
                <Route path="*" element={<Navigate to="/upload" replace />} />
              </>
            ) : (
              // Redirect unauthenticated users to login
              <>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            )}
          </Routes>
        </Box>
      </Box>

      {/* Global Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          zIndex: 9999,
          position: "fixed", // Ensure it stays above everything
        }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
