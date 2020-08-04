import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { Route, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Header from "../components/Header";
import { Sidebar } from "smartshare-ui";
import IdentityAPI from "../services/api/identity";
import { AppContext } from "../store/AppContext";

import { GridList } from "material-ui";

// Routes that include the navbar
const NavRoute = ({ component: Component }: any) => {
  const [auth, setAuth]: any = useState(false);
  const [name, setName] = useState<string>("");
  const [imageSource, setImageSource] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const history = useHistory();
  const { state } = useContext(AppContext);

  // Navbar Content
  const navItems = [
    {
      title: "Dashboard",
      icon: "",
      onClick: () => history.push("/"),
    },
    {
      title: "OKRs",
      icon: "",
      onClick: () => history.push("/create"),
    },
    {
      title: "Teams",
      icon: "",
      onClick: () => history.push("/settings"),
    },
  ];

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token !== null || undefined) {
        return setAuth(true);
      }
    } catch {
      // Do nothing
    }

    return setAuth(false);
  };

  const getCurrentUser = async () => {
    const response: any = await IdentityAPI.GetUserInfo();
    localStorage.setItem("currentUser", response?.identity?.id);

    if (response?.identity) {
      // Full name
      setName(response.identity.first_name + " " + response.identity.last_name);
      // Image for navbar
      setImageSource(response.identity.image_url);
      // Get userID to show whether they're hosting any upcoming events
      setUserId(response.identity.id);
      // Greet them by first name
      setUsername(response.identity.first_name);
      // Get the profile URL for them to share
      setProfileUrl(response.identity.profile_url);
    }
  };

  useEffect(() => {
    checkAuth();
    getCurrentUser();
  }, [state.accessToken]);

  return (
    <Route
      render={(props) => (
        <>
          {!auth ? (
            <Container>
              <Sidebar logo={""} navItems={navItems} />
              <PageContent>
                <Header currentUser={name} imageSource={imageSource} />
                <Component
                  {...props}
                  username={username}
                  profileUrl={profileUrl}
                  userId={userId}
                  imageSource={imageSource}
                  name={name}
                />
              </PageContent>
            </Container>
          ) : (
            <PageContent>
              <Nav>
                <Logo src={""} onClick={() => history.push("/")} />
                <LoginButton onClick={() => history.push("/signup")}>
                  Sign in
                </LoginButton>
              </Nav>
              <Component
                {...props}
                username={username}
                profileUrl={profileUrl}
                userId={userId}
                imageSource={imageSource}
                name={name}
              />
            </PageContent>
          )}
        </>
      )}
    />
  );
};

export default NavRoute;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  background-color: #f7f7f7;
  width: 100vw;
  height: 100vh;

  @media all and (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const PageContent = styled.div`
  justify-content: center;
  padding: 0px 50px 0px 50px;
  align-items: center;
  overflow: auto;
  background-color: #f7f7f7;

  @media all and (max-width: 1200px) {
    padding: 0px 20px 0px 20px;
  }
`;

const Nav = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 50px 0px 50px 0px;
  width: 100vw;
  flex-direction: row;
  align-items: center;

  @media all and (max-width: 1200px) {
    padding: 50px 20px 50px 20px;
    grid-template-columns: 1fr 1fr;
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
  flex-direction: row;
  align-items: right;
  margin: auto;
  justify-content: right;
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
`;
