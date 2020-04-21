import React, { useState, useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import axios from "axios";
import Context from "./Context";
import Layout from "./Layout";
import Loader from "./Loader";
import config from "../config";

import Landing from "./Landing";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import Project from "./Project";
import EditProject from "./EditProject";
import PageNotFound from "./PageNotFound";
import Docs from "./Docs";

// Axios configuration
axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? config.productionRootURL
    : "http://localhost:3000/";

const App = (props) => {
  const [user, updateUser] = useState(null);
  const [projects, updateProjects] = useState(null);
  const [projectData, updateProjectData] = useState(null);
  const [error, updateError] = useState(null);
  const [isFetchingUser, updateFetchingUser] = useState(false);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userToken"));
    if (token) {
      fetchUser(token);
      fetchProjects(token);
    }
  }, []);

  const fetchUser = async (token) => {
    // Update fetchingUser
    updateFetchingUser(true);
    try {
      const { data, status } = await axios.get("/users", {
        headers: {
          Authorization: token,
        },
      });
      if (status === 200) {
        // Update fetchingUser
        updateFetchingUser(false);
        // Set the user
        await updateUser(data.user);
      } else {
        // Clear the invalid tokens and redirect to the login
        localStorage.clear();
        props.history.push("/login");
      }
    } catch (err) {
      // Clear the invalid tokens and redirect to the login
      localStorage.clear();
      props.history.push("/login");
    }
  };

  const fetchProjects = async (token) => {
    try {
      const { data, status } = await axios.get("/projects", {
        headers: {
          Authorization: token,
        },
      });
      if (status === 200) {
        // Set the user
        await updateProjects(data.data);
        // Redirect to the dashboard page
      } else {
        // Clear the invalid tokens and redirect to the login
        localStorage.clear();
        props.history.push("/login");
      }
    } catch (err) {
      // Clear the invalid tokens and redirect to the login
      localStorage.clear();
      props.history.push("/login");
    }
  };

  const handleLogout = () => {
    updateUser(null);
    updateProjects(null);
    localStorage.clear();
  };

  const getSelectedProject = async (id) => {
    if (projects) {
      const project = await projects.filter((project) => project._id === id);
      updateProjectData(project[0]);
    }
  };

  const deleteProject = async (id) => {
    // Take a snapshot of projects state before updating
    const projectsSnapshotBeforeUpdate = projects;

    const newProjects = await projects.filter((project) => project._id !== id);
    // Pre update projects
    updateProjects(newProjects);
    // Push to the dashboard
    props.history.push("/dashboard");

    const token = JSON.parse(localStorage.getItem("userToken"));

    try {
      const { status } = await axios.delete(`/projects/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      if (status === 200) {
        // Retain the pre update
      } else {
        // Revert back the changes
        updateProjects(projectsSnapshotBeforeUpdate);
        updateError({
          action: "deleteProject",
          msg: "Failed to delete the project",
        });
        // Re-update the error
        setTimeout(() => updateError(null), 3000);
      }
    } catch (err) {
      // Revert back the changes
      updateProjects(projectsSnapshotBeforeUpdate);
      // Update the error
      updateError({
        action: "deleteProject",
        msg: "Failed to delete the project",
      });
      // Re-update the error
      setTimeout(() => updateError(null), 3000);
    }
  };

  const privateRoutes = () => {
    return (
      <Switch>
        <Route
          path="/dashboard"
          render={() => {
            return (
              <Layout>
                <Dashboard projects={projects} error={error} />
              </Layout>
            );
          }}
        />
        <Route
          path="/docs"
          render={() => {
            return (
              <Layout>
                <Docs />
              </Layout>
            );
          }}
        />
        <Route
          exact
          path="/project/:id"
          render={() => {
            return (
              <Layout>
                <Project
                  projects={projects}
                  projectData={projectData}
                  deleteProject={deleteProject}
                  getSelectedProject={getSelectedProject}
                />
              </Layout>
            );
          }}
        />
        <Route
          path="/account/profile"
          render={() => {
            return (
              <Layout>
                <Profile user={user} />
              </Layout>
            );
          }}
        />
        <Route
          path="/projects/create"
          render={() => {
            return (
              <Layout>
                <EditProject fetchProjects={fetchProjects} />
              </Layout>
            );
          }}
        />
        <Route
          path="/project/:id/edit"
          render={() => {
            return (
              <Layout>
                <EditProject
                  projects={projects}
                  fetchProjects={fetchProjects}
                  projectData={projectData}
                  getSelectedProject={getSelectedProject}
                />
              </Layout>
            );
          }}
        />
        <Route
          path="*"
          render={() => {
            return (
              <Layout>
                <PageNotFound homeLink={"/dashboard"} />
              </Layout>
            );
          }}
        />
      </Switch>
    );
  };

  const publicRoutes = () => {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            return (
              <Layout>
                <Landing />
              </Layout>
            );
          }}
        />
        <Route
          path="/docs"
          render={() => {
            return (
              <Layout>
                <Docs />
              </Layout>
            );
          }}
        />
        <Route
          path="/login"
          render={() => {
            return (
              <Layout>
                <Login updateUser={updateUser} fetchProjects={fetchProjects} />
              </Layout>
            );
          }}
        />
        <Route
          path="/register"
          render={() => {
            return (
              <Layout>
                <Register />
              </Layout>
            );
          }}
        />
        <Route
          path="*"
          render={() => {
            return (
              <Layout>
                <PageNotFound homeLink={"/"} />
              </Layout>
            );
          }}
        />
      </Switch>
    );
  };

  return (
    <Context.Provider value={{ user, projects, handleLogout }}>
      {isFetchingUser || user ? privateRoutes() : publicRoutes()}
    </Context.Provider>
  );
};

export default withRouter(App);
