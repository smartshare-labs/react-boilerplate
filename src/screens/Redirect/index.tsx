import React, { useEffect } from "react";
import styled from "styled-components";

export interface OauthPayload {
  token: string;
  verifier: string;
}

const Redirect = () => {
  useEffect(() => {
    // get the URL params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const token = urlParams.get("oauth_token");
    const verifier = urlParams.get("oauth_verifier");

    if (token && verifier) {
      const oauthToken: string = token;
      const oauthVerifier: string = verifier;

      const oauthPayload: OauthPayload = {
        token: oauthToken,
        verifier: oauthVerifier,
      };

      // set the tokens in local storage
      localStorage.setItem("oauth_payload", JSON.stringify(oauthPayload));
    }

    // close the popup
    window.close();
  }, []);

  return (
    <Wrapper>
      <FormContainer>
        <FormHeader></FormHeader>
      </FormContainer>
    </Wrapper>
  );
};

export default Redirect;

const Wrapper = styled.div`
  margin-top: 20%;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 20px;
  height: 20%;
  width: 40%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  background-color: #ffff;
`;

const FormContainer = styled.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const FormHeader = styled.span`
  text-align: center;
  display: block;
  font-size: 18px;
  border-bottom: 1px solid rgba(35, 41, 46, 0.1);
  padding: 0px 0px 20px 0px;
`;
