import './Header.css'
import { AppBar, StyledEngineProvider } from '@mui/material'

export default function Header(){
    const currentDate = new Date();
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const dateString = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <StyledEngineProvider injectFirst>
            <AppBar position='static' className="header-app-bar" color='inherit'>
                <div className="header-left">
                    <div className="calendar-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" fill="white"/>
                        </svg>
                    </div>
                    <div className="date-info">
                        <div className="day-name">{dayName}</div>
                        <div className="date-label">{dateString}</div>
                    </div>
                </div>

                <div className="header-right">
                    <div className="profile-section">
                        <div className="profile-avatar">
                            <span className="avatar-text">U</span>
                        </div>
                        <div className="profile-text">
                            <div className="welcome-text">WELCOME BACK!</div>
                            <div className="user-name">User</div>
                        </div>
                    </div>
                </div>
            </AppBar>
        </StyledEngineProvider>
    )
}