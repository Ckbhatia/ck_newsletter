import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Container } from "@material-ui/core";
import axios from "axios";

export default function Profile(props) {
  const [name, updateName] = useState("");
  const [username, updateUsername] = useState("");
  const [email, updateEmail] = useState("");
  const [password, updatePassword] = useState("");
  const [emailCredential, updateEmailCred] = useState("");
  const [passCredential, updatePasswordCred] = useState("");
  const [emailService, updateEmailService] = useState("");
  const [hasError, updateError] = useState(false);
  const [isSuccess, updateSuccess] = useState(false);

  useEffect(() => {
    if (props.user) {
      const {
        name,
        username,
        email,
        emailCredential,
        passCredential,
        emailService,
      } = props.user;
      updateName(name);
      updateEmail(email);
      updateUsername(username);
      // Only updates if these were filled before
      if (emailService) {
        updateEmailService(emailService);
      }
      if (emailCredential) {
        updateEmailCred(emailCredential);
      }
      if (passCredential) {
        updatePasswordCred(passCredential);
      }
    }
  }, [props.user]);

  const optionArr = [
    "gmail",
    "mailgun",
    "sendgrid",
    "zoho",
    "hotmail",
    "godaddy",
    "godaddyasia",
    "godaddyeurope",
    "fastmail",
    "icloud",
    "mailjet",
    "aol",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("userToken"));

    try {
      const { status } = await axios.patch(
        "/users",
        {
          name,
          username,
          email,
          password,
          emailCredential,
          passCredential,
          emailService,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (status === 200) {
        updateSuccess(true);
        setTimeout(() => updateSuccess(false), 3000);
      } else {
        await updateError(true);
        setTimeout(() => updateError(false), 3000);
      }
    } catch (err) {
      await updateError(true);
      setTimeout(() => updateError(false), 3000);
    }
  };

  return (
    <ProfileElement className="profile-main-container">
      <Container maxWidth="sm">
        <Div className="main-container">
          <div className="msg-txt-container center-child">
            {/* Show message on condition */}
            {isSuccess && (
              <span className="success-msg">Data saved successfully</span>
            )}
            {hasError && <span className="failed-msg">There's an error</span>}
          </div>
          <div className="form-main-container">
            <div className="form-container flex-center">
              <form className="form" onSubmit={handleSubmit}>
                <label>
                  Name
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
                </label>
                <label>
                  Username
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
                </label>
                <label>
                  Email
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
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    name="password"
                    className="input"
                    placeholder="New Password ( Leave blank to keep it same )"
                    minLength="6"
                    value={password}
                    onChange={(e) => updatePassword(e.target.value)}
                  />
                </label>
                <span className="note-text">
                  Note: Please put your email account credentials below to
                  activate newsletter service.
                </span>
                <label>
                  Email credential
                  <input
                    type="email"
                    name="email credential"
                    className="input"
                    placeholder="Email Credential"
                    minLength="12"
                    value={emailCredential}
                    onChange={(e) => updateEmailCred(e.target.value)}
                  />
                </label>
                <label>
                  Password credential
                  <input
                    type="password"
                    name="password cred"
                    className="input"
                    placeholder="Password Credential"
                    value={passCredential}
                    onChange={(e) => updatePasswordCred(e.target.value)}
                  />
                </label>
                <label>
                  Select the email service
                  <select
                    required
                    className="input select-input"
                    type="select"
                    value={emailService}
                    onChange={(e) => updateEmailService(e.target.value)}
                  >
                    {optionArr.map((el, i) => {
                      return (
                        <option key={i} value={el}>
                          {el}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <input className="submit-btn" type="submit" value="Save" />
              </form>
            </div>
          </div>
        </Div>
      </Container>
    </ProfileElement>
  );
}

const ProfileElement = styled.div`
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
    margin: 2.2rem 0;
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

  // Form
  .form {
    width: 100%;
  }
  .form-container {
    margin-left: 1.2rem;
    margin-right: 1.2rem;
    height: 100%;
    .input {
      font-size: 1.2rem;
      color: #5a5a5a;
      width: 100%;
      height: 100%;
      padding: 0.6rem 0.8rem;
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
      margin-bottom: 0.6rem;
      cursor: pointer;
      &:hover {
        background-color: #4fbfff;
      }
    }
  }

  .select-input {
    background-color: rgb(255, 255, 255);
  }
  .note-text {
    display: inline-block;
    color: crimson;
    font-size: 1rem;
    word-spacing: 0.1rem;
    line-height: 1.5;
    margin: 1rem 0;
  }

  label {
    font-size: 1.3rem;
    color: #1f1f1f;
  }
`;
