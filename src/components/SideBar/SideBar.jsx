import { NavLink, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, createContext, useContext } from "react";
import aubrantLogo from "../../assets/aubrantLogo.png";
import LLMIcon from "../../assets/icons/llm.svg?react";
import LogoutIcon from "../../assets/icons/logout.svg?react";
import TabularIcon from "../../assets/icons/tabular.svg?react";
import { useLLMTab } from "../LLM/LLM";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import "./SideBar.css";

const llmSubItems = [
  { label: "All Projects", value: 0, path: "/llm" },
  { label: "Playground", value: 1, path: "/llm" },
];

// Create context for sidebar state
const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  return context || { isOpen: false, setIsOpen: () => {} };
};

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLLMPage = location.pathname.startsWith('/llm');
  const [isLLMExpanded, setIsLLMExpanded] = useState(isLLMPage);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 767;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Update expansion state when location changes
  React.useEffect(() => {
    if (isLLMPage && !isLLMExpanded) {
      setIsLLMExpanded(true);
    } else if (!isLLMPage && isLLMExpanded) {
      setIsLLMExpanded(false);
    }
  }, [isLLMPage, isLLMExpanded]);

  // Always call the hook to maintain hook order
  let tabValue = 0;
  let setTabValue = () => {};

  try {
    const llmTab = useLLMTab();
    // Only use the values if we're on an LLM page
    if (isLLMPage) {
      tabValue = llmTab.tabValue;
      setTabValue = llmTab.setTabValue;
    }
  } catch (error) {
    // Context not available, use defaults
  }

  const handleLLMClick = (e) => {
    e.preventDefault();
    if (isLLMPage) {
      // If already on LLM page, just toggle expansion
      setIsLLMExpanded(!isLLMExpanded);
    } else {
      // If not on LLM page, navigate and expand
      navigate('/llm');
      setIsLLMExpanded(true);
    }
  };

  const handleLLMSubItemClick = (item) => {
    setTabValue(item.value);
    navigate(item.path);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div
          className={`mobile-menu-overlay ${isMobileOpen ? 'active' : ''}`}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      {isMobile && (
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileSidebar}
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </button>
      )}

      <aside className={`ta-sidebar ${isMobileOpen ? 'open' : ''}`}>
        {/* Close button for mobile */}
        {isMobile && (
          <button
            className="ta-sidebar__close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        )}

        <div className="ta-sidebar__logo-section">
          <img src={aubrantLogo} alt="Aubrant Digital Logo" className="ta-sidebar__logo" />
        </div>
        <nav className="ta-sidebar__nav">
          <div className="ta-sidebar__section-label">MENU</div>
          <NavLink to="/Dashboard" className="ta-sidebar__item" onClick={handleNavClick}>
            <TabularIcon className="ta-sidebar__icon" />
            <span className="ta-sidebar__item-text">Dashboard</span>
          </NavLink>
          <NavLink to="/tabular" className="ta-sidebar__item" onClick={handleNavClick}>
            <TabularIcon className="ta-sidebar__icon" />
            <span className="ta-sidebar__item-text">MLOps</span>
          </NavLink>

          {/* Expandable LLM Menu */}
          <div>
            <div
              className={`ta-sidebar__item ta-sidebar__item--new ${isLLMPage ? 'ta-sidebar__item--active' : ''}`}
              onClick={handleLLMClick}
              style={{ cursor: 'pointer' }}
            >
              <LLMIcon className="ta-sidebar__icon" />
              <span className="ta-sidebar__item-text">LLM</span>
              <span className="ta-sidebar__badge">NEW</span>
              {isLLMExpanded ? (
                <ArrowDropDownIcon style={{ marginLeft: 'auto', fontSize: '18px' }} />
              ) : (
                <ArrowRightIcon style={{ marginLeft: 'auto', fontSize: '18px' }} />
              )}
            </div>

            {/* LLM Sub-items - only show when LLM is expanded and we're on LLM page */}
            {isLLMExpanded && isLLMPage && (
              <div style={{ marginLeft: '12px' }}>
                {llmSubItems.map((item) => (
                  <div
                    key={item.value}
                    onClick={() => handleLLMSubItemClick(item)}
                    className={`ta-sidebar__sub-item ${tabValue === item.value ? 'ta-sidebar__sub-item--active' : ''}`}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
        <div className="ta-sidebar__bottom">
          <div className="ta-sidebar__section-label">SUPPORT</div>
          <NavLink to="/logout" className="ta-sidebar__item ta-sidebar__item--logout" onClick={handleNavClick}>
            <LogoutIcon className="ta-sidebar__icon" />
            <span className="ta-sidebar__item-text">Logout</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

