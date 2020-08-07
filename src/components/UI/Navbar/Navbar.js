import React from 'react'
import classes from './Navbar.module.css'
import NavItem from './NavItem/NavItem'
import dashboardIcon from './navIcons/Dashboard.svg'
import compInfos from './navIcons/ComputerInformation.svg'
import settingsIcon from './navIcons/Settings.svg'

const Navbar = (props) => {
    return (
        <nav className={classes.Navigation}>
            <ul>
                <li><NavItem link='/' svg={dashboardIcon}>Dashboard</NavItem></li>
                <li><NavItem link='/computerInformation' svg={compInfos}>Computer information</NavItem></li>
                <li><NavItem link='/settings' svg={settingsIcon}>Settings</NavItem></li>
            </ul>
        </nav>
    )
}

export default Navbar