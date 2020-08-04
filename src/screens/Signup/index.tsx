import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import IdentityAPI from "../../services/api/identity";
import ConfigGlobalLoader from "../../services/config";
import ApiService from "../../services/api/base";

import { OauthPayload } from "../Redirect";
const configGlobal = ConfigGlobalLoader.config;

const Signup = (props: any) => {
  const [activeStep, setActiveStep]: any = useState(0);
  const [email, setEmail]: any = useState<string>("");
  const [password, setPassword]: any = useState<string>("");

  const { addToast } = useToasts();
  const history = useHistory();

  const localStorageListener = async (event: any) => {
    const payload = localStorage.getItem("oauth_payload");

    try {
      if (payload) {
        const oauthPayload: OauthPayload = JSON.parse(payload);

        // Check that the URL which triggered this eventListener came from a trusted source
        const url = new URL(event.url);
        if (url.origin !== configGlobal.uiBaseUrl) {
          return;
        }

        const identityResponse = await IdentityAPI.PostTwitterAccessToken(
          oauthPayload?.token,
          oauthPayload?.verifier
        );

        if (identityResponse !== undefined) {
          // This should dispatch to the context in the future
          localStorage.setItem("authToken", identityResponse?.token);
          ApiService.setAuthToken(identityResponse?.token);

          window.removeEventListener("storage", localStorageListener);

          // If creating a new account, handleNext goes to create event
          // If logging in, redirects to dashboard
          return history.push("/dashboard");
        }

        window.removeEventListener("storage", localStorageListener);
      }
    } catch {
      addToast("Error logging in. Try again?", {
        appearance: "error",
        autoDismiss: true,
      });
      window.removeEventListener("storage", localStorageListener);
    }
  };

  const openAuthWindow = async () => {
    // Get the auth URL from the API
    const response = await IdentityAPI.GetTwitterAuthUrl();
    if (response !== undefined) {
      const authUrl = response.authorization_url;

      // Open a popup with our auth URL
      window.open(
        authUrl,
        "Twitter Auth",
        "toolbar=no, menubar=no,height=1050,width=550"
      );

      // Remove previous auth tokens
      localStorage.clear();

      // Specify an event listener to exchange the twitter tokens for an auth token once they're set
      return window.addEventListener("storage", localStorageListener, false);
    }

    return addToast("Error logging in. Are you on http://127.0.0.1?", {
      appearance: "error",
      autoDismiss: true,
    });
  };

  const handleToast = () => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let content;

    if (!emailRegex.test(String(email).toLowerCase())) {
      content = "Please enter a valid email.";
    } else if (password === "") {
      content = "Please enter a valid password.";
    }

    return content;
  };

  const handleCreateAccount = async () => {
    const errorMessage = handleToast();

    if (errorMessage !== undefined) {
      return addToast(errorMessage, {
        appearance: "error",
        autoDismiss: true,
      });
    }

    const response = await IdentityAPI.Signup(email, password);
    if (response !== undefined) {
      let responseBody = await IdentityAPI.Login(email, password);

      localStorage.setItem("authToken", responseBody["token"]);
      ApiService.setAuthToken(responseBody["token"]);

      return history.push("/dashboard");
    }

    return addToast("Error making account, try again?", {
      appearance: "error",
      autoDismiss: true,
    });
  };

  const handleSwitch = () => {
    return history.push("/login");
  };

  return (
    <Container>
      <Nav>
        <Logo src={""} onClick={() => history.push("/")} />
        <LoginButton onClick={() => handleSwitch()}>Sign in</LoginButton>
      </Nav>
      <Wrapper>
        <LoginSection>
          <Header>Create your account.</Header>
          {/* <SubHeader>Login to your account.</SubHeader> */}
          <FormSection>
            <TwitterButton onClick={() => openAuthWindow()}>
              <ButtonContent>
                <Icon src={""} />
                <Text>Login with Twitter</Text>
              </ButtonContent>
            </TwitterButton>
            <FormTitle>Email Address</FormTitle>
            <FormInput
              type="text"
              value={email}
              onChange={(event: any) => {
                setEmail(event.target.value);
              }}
            />
            <FormTitle>Password</FormTitle>
            <FormInput
              type="password"
              value={password}
              onChange={(event: any) => {
                setPassword(event.target.value);
              }}
            />
          </FormSection>
          <FormButton
            onClick={() => {
              handleCreateAccount();
            }}
          >
            Continue
          </FormButton>
        </LoginSection>
      </Wrapper>
    </Container>
  );
};

export default Signup;

const Container = styled.div`
  background-image: linear-gradient(227deg, #fbfbfb 123%, #f6f6f6 22%);
  height: 100vh;
  width: 100vw;
  /* padding: 0px 100px 0px 100px; */

  @media all and (max-width: 768px) {
    padding: 20px 20px 20px 20px;
  }
`;

const Header = styled.div`
  font-size: 44px;
  font-weight: 740;
  line-height: 1.68;
  letter-spacing: -0.81px;
  color: #0e1118;
`;

const SubHeader = styled.div`
  font-size: 24px;
  line-height: 1.58;
  color: #5b6279;
`;

const Nav = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 50px 100px 50px 100px;
  width: 100vw;
  flex-direction: row;
  align-items: center;

  @media all and (max-width: 768px) {
    padding: 50px 0px 50px 0px;
    grid-template-columns: 1fr 1fr;
  }
`;

const FormButton = styled.button`
  margin-top: 10px;
  background-color: ${(props) => props.theme.primaryColor}
  color: #fff;
  border-radius: 8px;
  border: none;
  height: 50px;
  width: 420px;
  font-size: 18px;

  &:hover {
    /* -webkit-transition: all 100ms;
    -moz-transition: all 100ms;
    transition: all 100ms;
    margin-top: -2px; */
    cursor: pointer;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  }
`;

const Logo = styled.img`
  justify-content: left;
  width: 202px;
  height: 38px;
  object-fit: contain;

  &:hover {
    cursor: pointer;
  }
`;

const LoginButton = styled.button`
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.17px;
  color: #181b25;
  width: 200px;
  height: 52px;
  opacity: 0.4;
  border-radius: 10px;
  border: solid 1.5px #8c91a3;

  &:hover {
    cursor: pointer;
  }

  @media all and (max-width: 768px) {
    width: 150px;
  }
`;

const Wrapper = styled.div`
  padding: 0px 100px 50px 100px;
  display: grid;
  /* grid-template-columns: 1fr 3fr;
  grid-column-gap: 100px; */
  margin: auto 0;
  justify-content: center;

  @media all and (max-width: 768px) {
    padding: 20px 20px 50px 20px;
    grid-template-columns: 1fr;
  }
`;

const LoginSection = styled.div``;
const ImageSection = styled.div``;

const Image = styled.img`
  border: 5px solid #5444da;
  border-radius: 20px;
  width: 600px;

  @media all and (max-width: 768px) {
    display: none;
  }
`;

const FormSection = styled.div`
  padding-top: 20px;
  display: grid;
`;

const TwitterButton = styled.button`
  height: 50px;
  width: 420px;
  border-radius: 12px;
  border: solid 1.5px #1da1f2;
  background-color: rgba(229, 243, 251, 0.5);
  padding: 5px;
  margin-bottom: 20px;

  &:hover {
    /* -webkit-transition: all 100ms;
    -moz-transition: all 100ms;
    transition: all 100ms;
    margin-top: -2px; */
    cursor: pointer;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  }
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  grid-column-gap: 10px;
`;

const Icon = styled.img`
  vertical-align: middle;
`;

const Text = styled.div`
  text-align: left;
  font-size: 22px;
  font-weight: bold;
  color: #1da1f2;
`;

// const Wrapper = styled.div`
//   height: 900px;
//   width: 100%;
//   margin: 0;
//   background-color: #f0f0f0;
// `;

// const Body = styled.div`
//   padding: 50px;
// `;

const FormTitle = styled.div`
  padding: 10px 0px 10px 0px;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 1.25px;
  color: #5b6279;
`;

const FormInput = styled.input`
  width: 400px;
  height: 30px;
  font-size: 14px;
  font-weight: 300;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #cccccc;
  margin-bottom: 15px;

  &:focus-within {
    border: solid 1.5px ${(props) => props.theme.primaryColor};
  }
`;
