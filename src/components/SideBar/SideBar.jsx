import { NavLink, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import aubrantLogo from "../../assets/aubrantLogo.png";
import LLMIcon from "../../assets/icons/llm.svg?react";
import LogoutIcon from "../../assets/icons/logout.svg?react";
import TabularIcon from "../../assets/icons/tabular.svg?react";
import { useLLMTab } from "../LLM/LLM";
import { useTabularTab } from "../Tabular/Tabular";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import "./SideBar.css";
const llmSubItems = [
  { label: "All Projects", value: 0, path: "/llm" },
  { label: "Playground", value: 1, path: "/llm" },
  // { label: "Model Catalogue", value: 2, path: "/llm" }, // Commented out temporarily
];

const tabularSubItems = [
  { label: "All Projects", value: 0, path: "/tabular" },
  { label: "Data Connectors", value: 1, path: "/tabular" },
];

export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLLMPage = location.pathname.startsWith('/llm');
  const isTabularPage = location.pathname.startsWith('/tabular');
  const [isLLMExpanded, setIsLLMExpanded] = useState(isLLMPage);
  const [isTabularExpanded, setIsTabularExpanded] = useState(isTabularPage);

  // Update expansion state when location changes
  React.useEffect(() => {
    if (isLLMPage && !isLLMExpanded) {
      setIsLLMExpanded(true);
    } else if (!isLLMPage && isLLMExpanded) {
      setIsLLMExpanded(false);
    }

    if (isTabularPage && !isTabularExpanded) {
      setIsTabularExpanded(true);
    } else if (!isTabularPage && isTabularExpanded) {
      setIsTabularExpanded(false);
    }
  }, [isLLMPage, isLLMExpanded, isTabularPage, isTabularExpanded]);

  // Always call the hook to maintain hook order
  let tabValue = 0;
  let setTabValue = () => {};
  let tabularTabValue = 0;
  let setTabularTabValue = () => {};

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

  try {
    const tabularTab = useTabularTab();
    // Only use the values if we're on a Tabular page
    if (isTabularPage) {
      tabularTabValue = tabularTab.tabValue;
      setTabularTabValue = tabularTab.setTabValue;
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
  };

  const handleTabularClick = (e) => {
    e.preventDefault();
    if (isTabularPage) {
      // If already on Tabular page, just toggle expansion
      setIsTabularExpanded(!isTabularExpanded);
    } else {
      // If not on Tabular page, navigate and expand
      navigate('/tabular');
      setIsTabularExpanded(true);
    }
  };

  const handleTabularSubItemClick = (item) => {
    setTabularTabValue(item.value);
    navigate(item.path);
  };

  return (
    <aside className="ta-sidebar">
      <div className="ta-sidebar__logo-section">
        <img src={aubrantLogo} alt="Aubrant Digital Logo" className="ta-sidebar__logo" />
      </div>
      <nav className="ta-sidebar__nav">
        <div className="ta-sidebar__section-label">MENU</div>
        <NavLink to="/Dashboard" className="ta-sidebar__item">
          <TabularIcon className="ta-sidebar__icon" />
          <span>Dashboard</span>
        </NavLink>
        {/* Expandable ML(Tabular) Menu */}
        <div>
          <div
            className={`ta-sidebar__item ta-sidebar__item--new ${isTabularPage ? 'ta-sidebar__item--active' : ''}`}
            onClick={handleTabularClick}
            style={{ cursor: 'pointer' }}
          >
            <TabularIcon className="ta-sidebar__icon" />
            <span>ML(Tabular)</span>
            <span className="ta-sidebar__badge">NEW</span>
            {isTabularExpanded ? (
              <ArrowDropDownIcon style={{ marginLeft: 'auto', fontSize: '18px' }} />
            ) : (
              <ArrowRightIcon style={{ marginLeft: 'auto', fontSize: '18px' }} />
            )}
          </div>

          {/* Tabular Sub-items - only show when Tabular is expanded and we're on Tabular page */}
          {isTabularExpanded && isTabularPage && (
            <div style={{ marginLeft: '12px' }}>
              {tabularSubItems.map((item) => (
                <div
                  key={item.value}
                  onClick={() => handleTabularSubItemClick(item)}
                  className={`ta-sidebar__sub-item ${tabularTabValue === item.value ? 'ta-sidebar__sub-item--active' : ''}`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expandable LLM Menu */}
        <div>
          <div
            className={`ta-sidebar__item ta-sidebar__item--new ${isLLMPage ? 'ta-sidebar__item--active' : ''}`}
            onClick={handleLLMClick}
            style={{ cursor: 'pointer' }}
          >
            <LLMIcon className="ta-sidebar__icon" />
            <span>LLM</span>
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
        <NavLink to="/logout" className="ta-sidebar__item ta-sidebar__item--logout">
          <LogoutIcon className="ta-sidebar__icon" />
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}

