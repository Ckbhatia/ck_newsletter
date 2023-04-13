import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Container } from "@material-ui/core";
import styled from "styled-components";
import Table from "./Table";

const Project = ({
  projects,
  match,
  getSelectedProject,
  projectData,
  deleteProject,
}) => {
  useEffect(() => {
    const id = match.params.id;
    getSelectedProject(id);
  }, [projects]);

  return (
    <Div className="project-main-container">
      <Container maxWidth="md">
        <div className="project-header-container">
          <h3 className="project-heading">Project</h3>
        </div>
        <div className="project-container">
          <Table projectData={projectData} />
        </div>
        <div className="project-btn-container">
          <Link
            to={`/project/${projectData && projectData._id}/edit`}
            className="project-btn btn-edit"
          >
            Edit
          </Link>
          <button
            onClick={() => deleteProject(projectData._id)}
            className="project-btn btn-delete"
          >
            Delete
          </button>
        </div>
      </Container>
    </Div>
  );
};

export default withRouter(Project);

const Div = styled.div`
  max-height: 120vh;
  min-height: 85vh;
  background-color: #f7fbfb;
  display: flex;
  justify-content: center;
  align-items: center;
  .project-container {
    -webkit-box-shadow: -1px 0px 5px 2px rgb(229, 229, 229);
    -moz-box-shadow: -1px 0px 5px 2px rgb(229, 229, 229);
    box-shadow: -1px 0px 5px 2px rgb(229, 229, 229);
  }
  .project-heading {
    font-size: 2rem;
    color: #40b9ff;
    font-weight: 600;
  }
  .project-header-container {
    margin-bottom: 2rem;
  }
  .project-btn-container {
    margin-top: 2rem;
    .project-btn {
      font-size: 1.2rem;
      color: #fff;
      border-radius: 2px;
      padding: 0.5rem 2rem;
      padding: 0.5rem 1.2rem;
      border: none;
      color: white;
      margin-right: 1rem;
      cursor: pointer;
    }
    .btn-edit {
      text-decoration: none;
      background-color: #40b9ff;
      &:hover {
        background-color: #3daef0;
      }
    }
    .btn-delete {
      background-color: #ff3636;
      &:hover {
        background-color: #ea3232;
      }
    }
  }
`;
