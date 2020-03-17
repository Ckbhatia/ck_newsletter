import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            return <h1>Home page</h1>;
          }}
        />
        <Route
          path="/about"
          render={() => {
            return <h1>About page.</h1>;
          }}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
