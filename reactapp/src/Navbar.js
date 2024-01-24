import React from "react";
import { Link, useResolvedPath } from "react-router-dom"
import "./styles.css";


function CustomLink({ to, children, activeWhen, ...props }) {
    const resolvedPath = useResolvedPath(to);
    let isActive = window.location.pathname === resolvedPath.pathname;

    if (!isActive && activeWhen) {
        isActive = activeWhen.includes(window.location.pathname);
    }

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    );
}

function Navbar() {
    return (
        <nav className="nav">
            <div className="site-title">
                Production Planner
            </div>
            <ul>
                <CustomLink 
                    to="/home"
                    activeWhen={["/last-update", "/add-order", "/add-dimensions"]}
                >
                    Home
                </CustomLink>
                <CustomLink to="/open-orders">Open Orders</CustomLink>
                <CustomLink to="/all-orders">All Orders</CustomLink>
            </ul>
        </nav>
    );
}

export default Navbar;