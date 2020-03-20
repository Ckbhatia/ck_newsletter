import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default function Header() {
  return (
    <HeaderElement className="header-main-container">
      <div className="header-container flex-between">
        <div className="heading-container">
          <Link to="/">
            <h1 className="main-heading-text">Ck newsletter</h1>
          </Link>
        </div>
        <div className="header-navigation-container">
          <nav className="navigation-container">
            <ul className="nav-list-container">
              {/* TODO: show nav on condition */}
              <li className="nav-item">
                <Link to="/login">
                  <span className="login-text nav-text">Log in</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register">
                  <span className="signup-text nav-text">Sign up</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/account/profile">
                  <span className="profile-text nav-text">Profile</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login">
                  <span className="logout-text nav-text">Log out</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </HeaderElement>
  );
}

const HeaderElement = styled.header`
  height: 10vh;
  background-color: #40b9ff;
  .header-container {
    height: 4.5rem;
    margin: 0 6.2rem;
    .heading-container {
      margin: 0.2rem 0;
    }
    .main-heading-text {
      font-size: 1.4rem;
      color: #ffffff;
      &:hover {
        color: #e3e3e3;
      }
    }
    .main-heading {
      color: #ffffff;
    }
  }
  .header-navigation-container {
    .nav-item {
      display: inline-block;
      margin: 0 1rem;
    }
    .nav-text {
      font-size: 1.2rem;
      color: #fcfcfc;
      background-color: transparent;
      border: none;
      cursor: pointer;
      &:hover {
        color: #e3e3e3;
      }
    }
  }
  // Link
  a {
    text-decoration: none;
  }
`;
