import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <Div className="lds-circle flex-center">
      <div></div>
    </Div>
  );
};

export default Loader;

const Div = styled.div`
  height: 85vh;
  transform: translateZ(1px);
  div {
    display: inline-block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    background: #cef;
    animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  @keyframes lds-circle {
    0%,
    100% {
      animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
    }
    0% {
      transform: rotateY(0deg);
    }
    50% {
      transform: rotateY(1800deg);
      animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
    }
    100% {
      transform: rotateY(3600deg);
    }
  }
`;
