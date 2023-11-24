import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
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

            <li>
              <NavLink to={"/memberList"}>
                <i className="uil uil-history"></i>
                <span className="link-name">List By Clan</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
