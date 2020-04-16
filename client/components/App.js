import React, { useState, useEffect, lazy, Suspense } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import axios from "axios";
import Context from "./Context";
import Layout from "./Layout";
import Loader from "./Loader";
import config from "../config";

const Login = lazy(() => import("./Login"));
const Register = lazy(() => import("./Register"));
const Profile = lazy(() => import("./Profile"));
const Dashboard = lazy(() => import("./Dashboard"));
const Project = lazy(() => import("./Project"));
const EditProject = lazy(() => import("./EditProject"));
const PageNotFound = lazy(() => import("./PageNotFound"));

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
    const project = await projects.filter((project) => project._id === id);
    updateProjectData(project[0]);
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
              <Suspense fallback={<Loader />}>
                <Layout>
                  <Dashboard projects={projects} error={error} />
                </Layout>
              </Suspense>
            );
          }}
        />
        <Route
          exact
          path="/project/:id"
          render={() => {
            return (
              <Suspense fallback={<Loader />}>
                <Layout>
                  <Project
                    projectData={projectData}
                    deleteProject={deleteProject}
                    getSelectedProject={getSelectedProject}
                  />
                </Layout>
              </Suspense>
            );
          }}
        />
        <Route
          path="/account/profile"
          render={() => {
            return (
              <Suspense fallback={<Loader />}>
                <Layout>
                  <Profile user={user} />
                </Layout>
              </Suspense>
            );
          }}
        />
        <Route
          path="/projects/create"
          render={() => {
            return (
              <Suspense fallback={<Loader />}>
                <Layout>
                  <EditProject fetchProjects={fetchProjects} />
                </Layout>
              </Suspense>
            );
          }}
        />
        <Route
          path="/project/:id/edit"
          render={() => {
            return (
              <Suspense fallback={<Loader />}>
                <Layout>
                  <EditProject
                    fetchProjects={fetchProjects}
                    projectData={projectData}
                    getSelectedProject={getSelectedProject}
                  />
                </Layout>
              </Suspense>
            );
          }}
        />
        <Route
          path="*"
          render={() => {
            return (
              <Suspense fallback={<Loader />}>
                <Layout>
                  <PageNotFound homeLink={"/dashboard"} />
                </Layout>
              </Suspense>
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
                <h1>Landing page</h1>
              </Layout>
            );
          }}
        />

        <Route
          path="/login"
          render={() => {
            return (
              <Suspense fallback={<Loader />}>
                <Layout>
                  <Login
                    updateUser={updateUser}
                    fetchProjects={fetchProjects}
                  />
                </Layout>
              </Suspense>
            );
          }}
        />
        <Route
          path="/register"
          render={() => {
            return (
              <Suspense fallback={<Loader />}>
                <Layout>
                  <Register />
                </Layout>
              </Suspense>
            );
          }}
        />
        <Route
          path="*"
          render={() => {
            return (
              <Suspense fallback={<Loader />}>
                <Layout>
                  <PageNotFound homeLink={"/"} />
                </Layout>
              </Suspense>
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
