import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import { FaGithub, FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import axios from "axios";
import config from "../config";

// Axios configuration
const rootUrl = process.env.NODE_ENV === "production"
  ? config.productionRootURL
  : "http://localhost:3000";

axios.defaults.baseURL = rootUrl;

const Register = (props) => {
  const [name, updateName] = useState("");
  const [username, updateUsername] = useState("");
  const [email, updateEmail] = useState("");
  const [password, updatePassword] = useState("");
  const [isError, updateError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { status } = await axios.post("/users/register", {
        name,
        username,
        email,
        password
      });
      if (status === 201) {
        // Redirect the user to login page
        props.history.push("/login");
      } else {
        // Change the state to true for error
        updateError(true);
      }
    } catch (err) {
      updateError(true);
    }
  };

  const handleSocialLogin = (app) => {
    window.open(
      `${rootUrl}/users/auth/${app}`,
      "_self"
    );
  };

  return (
    <Div className="login-main-container">
      <div className="form-main-container">
        <div className="form-heading-container text-center">
          <h1 className="form-heading">Register</h1>
          <Link className="login-link" to="/login">
            Have an account?
          </Link>
        </div>
        <div className="error-container center-child">
          <span className={`error-text error-${isError}`}>
            Username or email is already taken.
          </span>
        </div>
        <div className="form-container flex-center">
          <form className="form" onSubmit={handleSubmit}>
            <input
              required
              type="text"
              name="name"
              className="input"
              placeholder="Name"
              minLength="4"
              value={name}
              onChange={(e) => updateName(e.target.value)}
            />
            <input
              required
              type="text"
              name="username"
              className="input"
              placeholder="Username"
              minLength="4"
              value={username}
              onChange={(e) => updateUsername(e.target.value)}
            />
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
            <input className="submit-btn" type="submit" value="Register" />
          </form>
        </div>
        <div className="social-login-container">
          <h2 className="social-login-heading">
            Or, use another account:
          </h2>
          <div className="social-login-btn-container">
            <button className="social-btn" onClick={() => { handleSocialLogin("google") }}><FaGoogle /></button>
            <button className="social-btn" onClick={() => { handleSocialLogin("github") }}><FaGithub /></button>
            {/* <button className="social-btn" onClick={() => { handleSocialLogin("facebook") }}><FaFacebookF /></button>
            <button className="social-btn" onClick={() => { handleSocialLogin("twitter") }}><FaTwitter /></button> */}
          </div>
        </div>
      </div>
    </Div>
  );
};

export default withRouter(Register);

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85vh;
  width: 100%;
  .form-main-container {
    width: 50%;
    margin: 2.2rem 0;
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

  .social-login-container {
    margin: 2rem 1.2rem;
    .social-login-heading {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
  }

  .social-login-btn-container {
    display: flex;
    justify-content: center;
    align-items: space-between;
    .social-btn {
      font-size: 1.6rem;
      background-color: transparent;
      border: none;
      cursor: pointer;
      margin: 10px 20px;
      &:hover {
        background-color: rgba(234, 234, 234, 0.9);
border-radius: 5px;
      }
    }
  }

  .form {
    // width: 54%;
  }
  .form-container {
    margin-left: 1.2rem;
    margin-right: 1.2rem;
    height: 100%;
    .input {
      width: 100%;
      // width: 60%;
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
