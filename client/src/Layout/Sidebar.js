import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <>
      <nav>
        <div className="logo-name">
          <div className="logo-image"></div>
          <span className="logo_name">Valudas</span>
        </div>

        <div className="menu-items">
          <ul className="nav-links">
            <li>
              <NavLink to={"/allclan"}>
                <i className="uil uil-estate"></i>
                <span className="link-name">Clan</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={`/allmember`}>
                <i className="uil uil-files-landscapes"></i>
                <span className="link-name">Member</span>
              </NavLink>
            </li>

            <li>
              <NavLink to={`/allyearlyincome`}>
                <i className="uil uil-chart"></i>
                <span className="link-name">Yearly Income</span>
              </NavLink>
            </li>

            <li>
              <NavLink to={"/allexpenses"}>
                <i className="uil uil-comments"></i>
                <span className="link-name">Expenses</span>
              </NavLink>
            </li>

            <li>
              <NavLink to={"/allincome"}>
                <i className="bi bi-currency-rupee"></i>
                <span className="link-name">Income</span>
              </NavLink>
            </li>

            <li>
              <NavLink to={"/paymentHistory"}>
                <i className="bi bi-credit-card-2-back"></i>
                <span className="link-name">Payment History</span>
              </NavLink>
            </li>

            {/* Dropdown for Reports */}
            <li className={`dropdown ${isDropdownOpen ? "open" : ""}`}>
              <span className="arrow-history" onClick={toggleDropdown}>
                <i className="uil uil-history"></i>
                <span className="report_dropdown">Reports</span>
                <i id='arrow' className={`uil ${isDropdownOpen ? "uil-angle-down" : "uil-angle-right"}`}></i>
              </span>
              <ul className="dropdown-content" onClick={(e) => e.stopPropagation()}>
                {/* Dropdown items */}
                <li>
                  <NavLink to={"/memberList"}>
                    <i className="uil uil-history drop"></i>
                    <span className="link-name">All Gross</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/memberListPerYear"}>
                    <i className="uil uil-history drop"></i>
                    <span className="link-name">Gross Per Year</span>
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* End of Dropdown */}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
