import { NavLink, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import cibi from "../../assets/cibi.png";
import LLMIcon from "../../assets/icons/llm.svg?react";
import LogoutIcon from "../../assets/icons/logout.svg?react";
import TabularIcon from "../../assets/icons/tabular.svg?react";
import { useLLMTab } from "../LLM/LLM";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import "./SideBar.css";
const llmSubItems = [
  { label: "All Projects", value: 0, path: "/llm" },
  { label: "Playground", value: 1, path: "/llm" },
  { label: "Model Catalogue", value: 2, path: "/llm" },
];

export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLLMPage = location.pathname.startsWith('/llm');
  const [isLLMExpanded, setIsLLMExpanded] = useState(isLLMPage);

  // Update expansion state when location changes
  React.useEffect(() => {
    if (isLLMPage && !isLLMExpanded) {
      setIsLLMExpanded(true);
    } else if (!isLLMPage && isLLMExpanded) {
      setIsLLMExpanded(false);
    }
  }, [isLLMPage, isLLMExpanded]);

  // Only use LLM tab context if we're on an LLM page
  let tabValue = 0;
  let setTabValue = () => {};

  try {
    if (isLLMPage) {
      const llmTab = useLLMTab();
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
  };

  return (
    <aside className="ta-sidebar">
      <div className="ta-sidebar__logo-section">
        <img src={cibi} alt="Aubrant Digital Logo" className="ta-sidebar__logo" />
        <span className="ta-sidebar__brand">Aubrant Digital</span>
      </div>
      <nav className="ta-sidebar__nav">
        <div className="ta-sidebar__section-label">MENU</div>
        <NavLink to="/Dashboard" className="ta-sidebar__item">
          <TabularIcon className="ta-sidebar__icon" />
          <span>Dashboard</span>
        </NavLink>
        {/* <NavLink to="/tabular" className="ta-sidebar__item">
          <TabularIcon className="ta-sidebar__icon" />
          <span>Tabular</span>
        </NavLink> */}

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

