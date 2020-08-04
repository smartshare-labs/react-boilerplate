import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <Wrapper>
      <Body>
        <FooterSection>
          {/* <FooterText>About</FooterText> */}
          <FooterText>OKR Tool</FooterText>
          {/* <FooterText>API</FooterText> */}
        </FooterSection>
        <CopyrightText>NYT</CopyrightText>
        <TermsWrapper>
          <TermsText onClick={() => (window.location.href = "nyt.com")}>
            Privacy
          </TermsText>
          <TermsText onClick={() => (window.location.href = "nyt.com")}>
            Terms
          </TermsText>
        </TermsWrapper>
      </Body>
    </Wrapper>
  );
};

export default Footer;

const Wrapper = styled.div`
  height: 180px;
  width: 100%;
  background-color: ${({ theme }) => theme.indieBlue};
  bottom: 0;
  position: relative;

  @media only screen and (max-width: 1100px) {
    display: none;
  }
`;

const Body = styled.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
  justify-content: left;
`;

const FooterSection = styled.div`
  display: grid;
  border-bottom: 1px solid #cccccc;
  grid-row-gap: 20px;
  text-align: left;
  justify-content: left;
  font-weight: 300;
  padding: 5px 20px 5px 50px;
  color: #fff;

  @media all and (max-width: 1160px) {
    top: 0;
    bottom: 0;
    text-align: center;
    justify-content: center;
    margin: auto;
  }
`;

const FooterText = styled.div`
  padding: 20px 0px 20px 0px;
  font-size: 18px;
  font-weight: 600;
  text-align: left;
  color: #fff;
  /* &:hover {
    cursor: pointer;
    opacity: 0.8;
  } */
`;

const CopyrightText = styled.div`
  padding: 20px 20px 0px 50px;
  font-size: 20px;
  font-weight: 100;
  text-align: left;
  color: #fff;

  @media all and (max-width: 1160px) {
    text-align: center;
    padding-top: 20px 0px 0px 0px;
  }
`;

const TermsText = styled.div`
  padding: 10px;
  font-size: 14px;
  font-weight: 100;
  text-align: center;
  justify-content: left;
  color: #fff;
`;

const TermsWrapper = styled.div`
  grid-template-columns: 50px 50px;
  grid-column-gap: 10px;
  display: grid;
  padding: 10px 10px 10px 40px;
  font-size: 20px;
  font-weight: 100;
  text-align: left;
  justify-content: left;
  color: #fff;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  @media all and (max-width: 1160px) {
    justify-content: center;
    margin: auto;
  }
`;
