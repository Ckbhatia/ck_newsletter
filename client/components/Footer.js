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
  min-height: 6rem;
  .footer-text {
    font-size: 1rem;
    color: #a6adc9;
  }
`;
