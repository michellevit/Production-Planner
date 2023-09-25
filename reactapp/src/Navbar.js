import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import "./styles.css";


function Navbar() {
    return (
        <nav className="nav">
            <div className="site-title">
                Production Planner
            </div>
            <ul>
                <CustomLink to="/open-orders">Open Orders</CustomLink>
                <CustomLink to="/closed-orders">Closed Orders</CustomLink>
            </ul>
        </nav>
    );
}

function CustomLink({to, children, ...props}) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}

export default Navbar;
