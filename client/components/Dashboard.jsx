import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container } from "@material-ui/core";
import ListProject from "./ListProject";

export default function Dashboard({ projects, error }) {
  return (
    <Div className="dashboard-main-container">
      <Container maxWidth="md">
        <div className="dashboard-header-container">
          <div className="heading-text-container">
            <h3 className="heading">Projects</h3>
          </div>
          <div className="create-btn-container">
            <Link to="/projects/create" className="create-btn">
              New
            </Link>
          </div>
          <div
            className={`msg-container error-${
              error && error.action === "deleteProject" ? "true" : "false"
            }`}
          >
            <span className="msg-text">{error && error.msg}</span>
          </div>
        </div>
        <div className="projects-main-container">
          <div className="projects-container">
            {projects && projects.length > 0 ? (
              <ul className="projects-list">
                {projects.map((project) => {
                  return (
                    <li key={project._id} className="project-item">
                      <ListProject project={project} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="no-projects-container">
                <span className="no-projects-text">
                  No projects found. Please create a project.
                </span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Div>
  );
}

let Div = styled.div`
  min-height: 81vh;
  margin-top: 2rem;
  overflow-y: scroll;
  .heading {
    font-size: 2rem;
    color: #40b9ff;
    font-weight: 600;
  }
  .create-btn-container {
    display: flex;
    justify-content: flex-end;
    .create-btn {
      font-size: 1.2rem;
      color: #fff;
      background-color: #35dd30;
      border: none;
      border-radius: 2px;
      padding: 0.5rem 1.2rem;
      text-decoration: none;
      cursor: pointer;
      &:hover {
        background-color: #17c712;
      }
    }
  }

  .msg-container {
    text-align: center;
    height: 100%;
    width: 100%;
    background-color: #ff1f35;
    padding: 0.8rem 0;
    margin: 0.5rem 0;
  }

  .msg-text {
    font-size: 1.2rem;
    font-weight: bold;
    color: #fff;
    width: 100%;
  }

  .error-false {
    visibility: hidden;
  }
  .error-true {
    visibility: visible;
  }

  .project-item {
    margin: 2rem 0;
  }
  .no-projects-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 45vh;
  }
  .no-projects-text {
    font-size: 1.4rem;
    color: #3a3a3a;
  }
`;
