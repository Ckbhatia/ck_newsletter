import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Context from "./Context";
import Layout from "./Layout";
import Loader from "./Loader";

const Login = lazy(() => import("./Login"));
const Register = lazy(() => import("./Register"));

const App = () => {
  const [user, updateUser] = useState(null);
  const [projects, updateProjects] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      // TODO: Fetch the user
    }
  }, []);

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
                <h1>Profile page</h1>
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
    <BrowserRouter>
      <Context.Provider value={{ user, projects, handleLogout }}>
        {user ? privateRoutes() : publicRoutes()}
      </Context.Provider>
    </BrowserRouter>
  );
};

export default App;
