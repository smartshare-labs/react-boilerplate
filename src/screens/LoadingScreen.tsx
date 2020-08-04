import React, { useEffect, useContext } from "react";
import styled from "styled-components";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import { AppContext } from "../store/AppContext";

const LoadingScreen = ({ className }: any) => {
  const targetRef: any = React.createRef();
  const { state, dispatch } = useContext(AppContext);

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  useEffect(() => {
    if (state.callsLoading > 0) {
      disableBodyScroll(targetRef.current);
    } else {
      enableBodyScroll(targetRef.current);
    }
  }, [state.callsLoading]);

  if (!state.callsLoading) {
    return null;
  }

  return (
    <Wrapper>
      <Spinner
        onClick={(event) => {
          event.stopPropagation();
        }}
        className={className}
      ></Spinner>
    </Wrapper>
  );
};

export default LoadingScreen;

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  text-align: center;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 150vh;
  background-color: rgba(35, 41, 46, 0.4);
  text-align: center;
  align-items: center;
  body {
    margin: 0;
    height: 100%;
    overflow: hidden;
  }
`;

const Spinner = styled.div`
  border: 4px solid ${(props) => props.theme.primaryColor}
  border-top: 4px solid #fff;
  opacity: 0.8;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
