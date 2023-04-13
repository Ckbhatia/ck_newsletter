import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Container } from "@material-ui/core";
import axios from "axios";
import ProjectForm from "./ProjectForm";

// This component works for both, create project and edit project.
function EditProject({
  projects,
  fetchProjects,
  projectData,
  getSelectedProject,
  history,
  match,
}) {
  const [status, updateStatus] = useState(null);

  useEffect(() => {
    if (getSelectedProject) {
      const id = match.params.id;
      getSelectedProject(id);
    }
  }, [projects]);

  const handleSubmit = async (
    name,
    siteUrl,
    isCustomTemplate,
    customTemplateData
  ) => {
    const token = JSON.parse(localStorage.getItem("userToken"));

    try {
      const { status } = await axios.post(
        "/projects",
        {
          name,
          siteUrl,
          isCustomTemplate,
          customTemplateData,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (status === 201) {
        updateStatus({ currentStatus: true, msg: "Created project" });
        await fetchProjects(token);
        setTimeout(() => history.push("/dashboard"), 700);
      } else {
        await updateStatus({ currentStatus: false, msg: "There's an error" });
        setTimeout(() => updateStatus(null), 3000);
      }
    } catch (err) {
      await updateStatus({
        currentStatus: false,
        msg: "Project name or site url is duplicate",
      });
      setTimeout(() => updateStatus(null), 3000);
    }
  };

  const handleEdit = async (
    name,
    siteUrl,
    isCustomTemplate,
    customTemplateData
  ) => {
    const token = JSON.parse(localStorage.getItem("userToken"));

    try {
      const id = match.params.id;

      const { status } = await axios.patch(
        `/projects/${id}`,
        {
          name,
          siteUrl,
          isCustomTemplate,
          customTemplateData,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (status === 200) {
        updateStatus({ currentStatus: true, msg: "Updated project" });
        await fetchProjects(token);
        setTimeout(() => history.push("/dashboard"), 700);
      } else {
        await updateStatus({ currentStatus: false, msg: "There's an error" });
        setTimeout(() => updateStatus(null), 3000);
      }
    } catch (err) {
      await updateStatus({
        currentStatus: false,
        msg: "Project name or site url is duplicate",
      });
      setTimeout(() => updateStatus(null), 3000);
    }
  };

  return (
    <ProjectContainer className="create-project-main-container">
      <Container maxWidth="sm">
        <Div className="main-container">
          <div className="msg-txt-container center-child">
            {/* Show message on condition */}
            {status && status.currentStatus && (
              <span className="success-msg">{status.msg}</span>
            )}
            {status && status.currentStatus === false && (
              <span className="failed-msg">{status.msg}</span>
            )}
          </div>
          <div className="form-main-container">
            <ProjectForm
              handleSubmit={match.params.id ? handleEdit : handleSubmit}
              projectData={projectData}
            />
          </div>
        </Div>
      </Container>
    </ProjectContainer>
  );
}

export default withRouter(EditProject);

const ProjectContainer = styled.div`
  max-height: 120vh;
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Div = styled.div`
  background-color: #fcfcfc;
  width: 100%;
  -webkit-box-shadow: 0px 0px 5px 0px rgba(230, 230, 230, 1);
  -moz-box-shadow: 0px 0px 5px 0px rgba(230, 230, 230, 1);
  box-shadow: 0px 0px 2px 1px rgba(230, 230, 230, 1);
  .form-main-container {
    margin: 2.2rem 0.8rem;
  }

  // Message container
  .msg-txt-container {
    position: relative;
    top: 20px;
    text-align: center;
    width: 100%;
    height: 100%;
  }

  .success-msg {
    font-size: 1.2rem;
    color: #fff;
    padding: 1.2rem 0;
    width: 100%;
    background-color: #38c942;
  }

  .failed-msg {
    font-size: 1.2rem;
    color: #fff;
    padding: 1.2rem 0;
    width: 100%;
    background-color: #ff1f35;
  }
`;
