import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Context from "./Context";

export default function Header() {
  const { user, handleLogout } = useContext(Context);

  return (
    <HeaderElement className="header-main-container">
      <div className="header-container flex-between wrapper">
        <div className="heading-container">
          {user ? (
            <Link to="/dashboard">
              <h1 className="main-heading-text">Ck newsletter</h1>
            </Link>
          ) : (
            <Link to="/">
              <h1 className="main-heading-text">Ck newsletter</h1>
            </Link>
          )}
        </div>
        <div className="header-navigation-container">
          <nav className="navigation-container">
            <ul className="nav-list-container">
              {user ? (
                <>
                  <li className="nav-item">
                    <Link to="/docs">
                      <span className="docs-text nav-text">Docs</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/account/profile">
                      <span className="profile-text nav-text">Profile</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login">
                      <button
                        onClick={handleLogout}
                        className="logout-text nav-text"
                      >
                        Log out
                      </button>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/docs">
                      <span className="docs-text nav-text">Docs</span>
                    </Link>
                  </li>
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
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </HeaderElement>
  );
}

const HeaderElement = styled.header`
  min-height: 5vh;
  max-height: 10vh;
  background-color: #40b9ff;
  .header-container {
    min-height: 4.5rem;
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
      margin-left: 1rem;
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
  a {
    text-decoration: none;
  }
`;
