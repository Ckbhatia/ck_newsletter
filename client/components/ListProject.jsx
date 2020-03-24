import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default function ListProject({ project }) {
  const { _id, name, siteUrl, slugs, subscribers, updatedAt } = project;

  // Simplify date format
  let date = new Date(updatedAt);
  date = `${date.toISOString().substring(0, 10)} ${date
    .toISOString()
    .substring(11, 19)}`;

  return (
    <ProjectContainer className="project-main-container">
      <Link className="project-card-link-wrapper" to={`/project/${_id}`}>
        <div className="project-header">
          <h4 className="project-heading">{name}</h4>
        </div>
        <div className="project-details">
          <div className="project-site-info">
            <span className="site-url-text">{siteUrl}</span>
          </div>
          <div className="project-detail-count">
            <span className="project-last-slug">
              blogs: {slugs && slugs.length}
            </span>
            <span className="project-last-subscriber">
              subscribers: {subscribers && subscribers.length}
            </span>
          </div>
          <div className="project-footer">
            <span className="last-update-time">updated at: {date}</span>
            <span className="last-subscriber">
              last subscriber: {subscribers[subscribers.length - 1]}
            </span>
            <span className="last-slug">
              last blog: {slugs[slugs.length - 1]}
            </span>
          </div>
        </div>
      </Link>
    </ProjectContainer>
  );
}

const ProjectContainer = styled.div`
  padding: 1rem;
  -webkit-box-shadow: -1px 0px 5px 2px rgb(229, 229, 229);
  -moz-box-shadow: -1px 0px 5px 2px rgb(229, 229, 229);
  box-shadow: -1px 0px 5px 2px rgb(229, 229, 229);
  background-color: #fff;
  &:hover {
    -webkit-box-shadow: -1px 0px 2px 1px rgb(229, 229, 229);
    -moz-box-shadow: -1px 0px 2px 1px rgb(229, 229, 229);
    box-shadow: -1px 0px 2px 1px rgb(229, 229, 229);
  }

  .project-card-link-wrapper {
    text-decoration: none;
    color: #484848;
  }
  .project-heading {
    font-size: 1.6rem;
    color: #191919;
  }

  .project-site-info {
    font-size: 1.2rem;
    display: inline-block;
    margin: 1.2rem 0;
  }
  .project-detail-count {
    margin: 1rem 0;
    display: flex;
    justify-content: space-around;
    .project-last-slug {
      font-size: 1.2rem;
      color: #484848;
    }
  }
  .project-last-subscriber {
    font-size: 1.2rem;
    color: #484848;
  }
  .project-footer {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
  }
`;
