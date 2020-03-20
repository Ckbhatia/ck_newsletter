import React from "react";
import styled from "styled-components";

export default function Footer() {
  return (
    <FooterElement className="footer-main-container">
      <div className="footer-container">
        <span className="footer-text">2020 @ Ck newsletter</span>
      </div>
    </FooterElement>
  );
}

const FooterElement = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5vh;
  .footer-text {
    font-size: 1rem;
    color: #a6adc9;
  }
`;
