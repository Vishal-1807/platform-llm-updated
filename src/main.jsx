import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'; 
const theme = createTheme({
  typography: {
    allVariants:{
      fontFamily: [
        'Plus Jakarta Sans'
      ].join(',')
    }
  }
});
ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
  <BrowserRouter>
    {/* <StrictMode> */}
      <App />
    {/* </StrictMode> */}
  </BrowserRouter>
  </ThemeProvider>
)
