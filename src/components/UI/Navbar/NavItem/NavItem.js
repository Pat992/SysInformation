import React from 'react'
import { NavLink } from 'react-router-dom'
import classes from './NavItem.module.css'

const Navitem = (props) => {
    return (
        <NavLink className={classes.NavItem} activeClassName={classes.NavItemActive} to={props.link} exact>
            <img src={props.svg} />
            {props.children}
        </NavLink>
    )
}

export default Navitem
