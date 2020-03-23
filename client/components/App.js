import React, { useState, useEffect, lazy, Suspense } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import axios from "axios";
import Context from "./Context";
import Layout from "./Layout";
import Loader from "./Loader";

const Login = lazy(() => import("./Login"));
const Register = lazy(() => import("./Register"));
const Profile = lazy(() => import("./Profile"));

// Axios configuration
axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? config.productionRootURL
    : "http://localhost:3000/";

const App = (props) => {
  const [user, updateUser] = useState(null);
  const [projects, updateProjects] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userToken"));
    if (token) {
      fetchUser(token);
      fetchProjects(token);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const { data, status } = await axios.get("/users", {
        headers: {
          Authorization: token
        }
      });
      if (status === 200) {
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
          Authorization: token
        }
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
    localStorage.clear();
  };

  const privateRoutes = () => {
    return (
      <Switch>
        <Route
          path="/dashboard"
          render={() => {
            return (
              <Layout>
                <h1>Dashboard page</h1>
              </Layout>
            );
          }}
        />
        <Route
          path="/project/:id"
          render={() => {
            return (
              <Layout>
                <h1>Project page</h1>
              </Layout>
            );
          }}
        />
        <Route
          path="/account/profile"
          render={() => {
            return (
              <Layout>
                <Suspense fallback={<Loader />}>
                  <Profile user={user} />
                </Suspense>
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
                <h1>Landing page</h1>
              </Layout>
            );
          }}
        />

        <Route
          path="/login"
          render={() => {
            return (
              <Layout>
                <Suspense fallback={<Loader />}>
                  <Login updateUser={updateUser} />
                </Suspense>
              </Layout>
            );
          }}
        />
        <Route
          path="/register"
          render={() => {
            return (
              <Layout>
                <Suspense fallback={<Loader />}>
                  <Register />
                </Suspense>
              </Layout>
            );
          }}
        />
      </Switch>
    );
  };

  return (
    <Context.Provider value={{ user, projects, handleLogout }}>
      {user ? privateRoutes() : publicRoutes()}
    </Context.Provider>
  );
};

export default withRouter(App);
