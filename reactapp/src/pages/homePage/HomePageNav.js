import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "./HomePageNav.css";

const HomePageNav = () => {
  return (
    <div className="home-page-nav-container">
      <div className="row1">
        <header>
          <h1>HomePage</h1>
        </header>
      </div>
      <div className="row2">
        <ul>
          <CustomLink to="/add-report">Add Report</CustomLink>
          <CustomLink to="/add-order">Add Order</CustomLink>
          <CustomLink to="/add-dimensions">Add Dimensions</CustomLink>
        </ul>
      </div>
    </div>
  );
};

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <Link to={to} {...props}>
      <li className={isActive ? "active" : ""}>{children}</li>
    </Link>
  );
}

export default HomePageNav;
