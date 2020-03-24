import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import config from "../config";

// Axios configuration
axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? config.productionRootURL
    : "http://localhost:3000/";

const Login = (props) => {
  const [email, updateEmail] = useState("");
  const [password, updatePassword] = useState("");
  const [isError, updateError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { status, data } = await axios.post("/users/login", {
        email,
        password
      });
      if (status === 200) {
        // Set the user
        await props.updateUser(data.data);
        // Fetch projects
        await props.fetchProjects(data.token);
        if (data.token) {
          localStorage.setItem("userToken", JSON.stringify(data.token));
        }
        // Redirect the user to dashboard page
        props.history.push("/dashboard");
      } else {
        // Change the state to true for error
        updateError(true);
      }
    } catch (err) {
      updateError(true);
    }
  };

  return (
    <Div className="login-main-container">
      <div className="form-main-container">
        <div className="form-heading-container text-center">
          <h1 className="form-heading">Log In</h1>
          <Link className="login-link" to="/register">
            Don't have an account?
          </Link>
        </div>
        <div className="error-container center-child">
          <span className={`error-text error-${isError}`}>
            Email or password is invalid
          </span>
        </div>
        <div className="form-container">
          <form className="form" onSubmit={handleSubmit}>
            <input
              required
              type="email"
              name="email"
              className="input"
              placeholder="Email"
              minLength="12"
              value={email}
              onChange={(e) => updateEmail(e.target.value)}
            />
            <input
              required
              type="password"
              name="password"
              className="input"
              placeholder="Password"
              minLength="6"
              value={password}
              onChange={(e) => updatePassword(e.target.value)}
            />
            <input className="submit-btn" type="submit" value="Log in" />
          </form>
        </div>
      </div>
    </Div>
  );
};

export default withRouter(Login);

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85vh;
  .form-main-container {
    padding: 1rem 0;
    background-color: #fff;
    -webkit-box-shadow: 0px 0px 5px 0px rgba(230, 230, 230, 1);
    -moz-box-shadow: 0px 0px 5px 0px rgba(230, 230, 230, 1);
    box-shadow: 0px 0px 2px 1px rgba(230, 230, 230, 1);
  }

  .form-heading {
    font-size: 2.2rem;
  }

  .login-link {
    display: block;
    color: #76838f;
    font-size: 0.9rem;
    letter-spacing: 0.02rem;
    margin: 0.5rem 0;
    &:hover {
      color: #131217;
    }
  }

  .form-container {
    margin-left: 1.2rem;
    margin-right: 1.2rem;
    height: 100%;
    .input {
      width: 100%;
      height: 100%;
      padding: 0.9rem 1.5rem;
      margin: 0.4rem 0;
      border: 1px solid rgb(211, 209, 209);
      border-radius: 5px;
      &::placeholder {
        color: rgb(156, 154, 154);
        font-size: 1.18rem;
      }
    }
    .submit-btn {
      background-color: #40b9ff;
      color: #ffffff;
      border: none;
      padding: 0.8rem 1.8rem;
      border-radius: 5px;
      margin-top: 0.6rem;
      cursor: pointer;
      &:hover {
        background-color: #4fbfff;
      }
    }
  }

  .error-container {
    // position: relative;
    // top: 20px;
    text-align: center;
    width: 100%;
    height: 100%;
  }

  .error-text {
    font-size: 1.2rem;
    font-weight: bold;
    background-color: #ff1f35;
    color: #fff;
    padding: 0.8rem 0;
    width: 100%;
  }
  .error-false {
    visibility: hidden;
  }

  .error-true {
    visibility: visible;
  }
`;
