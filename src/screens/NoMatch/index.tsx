import React from "react";
import styled from "styled-components";

const NoMatch = () => {
  return (
    <Wrapper>
      <Body>
        <Title>404. There's nothing here!</Title>
      </Body>
    </Wrapper>
  );
};

export default NoMatch;

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  background-color: #f0f0f0;
`;

const Body = styled.div`
  padding: 50px;
`;

const Title = styled.div`
  font-size: 24px;
  text-align: center;
`;
