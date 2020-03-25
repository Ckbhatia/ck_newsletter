import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default function PageNotFound({ homeLink }) {
  return (
    <Div className="page-not-found-main-container">
      <div className="page-not-found-container">
        <h1 className="page-not-found-heading">404</h1>
        <p className="page-not-found-text">Oops! Page not found.</p>
        <Link className="home-link" to={homeLink}>
          Back to Home
        </Link>
      </div>
    </Div>
  );
}

const Div = styled.div`
  height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .home-link {
    font-weight: 300;
    color: #232129;
    font-size: 1.2em;
    text-decoration: none;
    border: 1px solid #4fbfff;
    text-decoration: none;
    padding: 0.5em;
    border-radius: 3px;
    float: left;
    margin: 6em 0 0 -155px;
    left: 50%;
    position: relative;
    transition: all 0.3s linear;
    &:hover {
      background-color: #4fbfff;
      color: #fff;
    }
  }

  .page-not-found-text {
    font-size: 2em;
    text-align: center;
    font-weight: 100;
  }

  .page-not-found-heading {
    text-align: center;
    font-size: 15em;
    font-weight: 100;
  }
`;
