import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import GenericAvatar from "../assets/avatar.png";
import { Button } from "smartshare-ui";
import { slide as Menu } from "react-burger-menu";

const Header = (props: any) => {
  const history = useHistory();
  const { currentUser, imageSource } = props;

  const displayUserAvatar = () => {
    // If we have an image icon, add it to the navbar
    if (imageSource !== null && imageSource.length > 6) {
      return (
        <AvatarButtonWrapper avatarImage={imageSource}></AvatarButtonWrapper>
      );
      // If we don't have an image or user initials, show the generic avatar
    }
    return (
      <AvatarButtonWrapper
        onMouseEnter={() => {}}
        avatarImage={GenericAvatar}
      ></AvatarButtonWrapper>
    );
  };

  const handleLogout = async () => {
    localStorage.clear();
    return (window.location.href = "/");
  };

  return (
    <>
      <MobileMenu>
        <BurgerBar>
          <Menu styles={styles} isOpen={false}>
            <a id="home" className="menu-item" href="/dashboard">
              Dashboard
            </a>
            <a id="create" className="menu-item" href="/create">
              Create OKR
            </a>
            <a className="menu-item--small" href="/settings">
              Settings
            </a>
          </Menu>
        </BurgerBar>
      </MobileMenu>
      <Wrapper>
        <LogoSection
          onClick={() => {
            history.goBack();
          }}
        >
          Go back
        </LogoSection>
        <OptionsSection>
          <NavButtonWrapper>
            <FormButton onClick={() => history.push("/create")}>
              Create OKR
            </FormButton>
          </NavButtonWrapper>
          {displayUserAvatar()}
        </OptionsSection>
      </Wrapper>
    </>
  );
};

export default Header;

const FormButton = styled.button`
  background-color: ${(props) => props.theme.primaryColor}
  color: #fff;
  border-radius: 8px;
  border: none;
  height: 50px;
  width: 200px;
  font-size: 18px;

  &:hover {
    cursor: pointer;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  }
`;

const Wrapper = styled.div`
  display: grid;
  height: 20px;
  padding: 50px 0px 50px 0px;
  grid-template-columns: 1fr 1fr;
  flex-direction: row;
  align-items: center;

  @media only screen and (max-width: 1200px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media only screen and (max-width: 1200px) {
    width: 100vw;
    height: 100px;
    display: grid;
  }
`;

const LogoSection = styled.div`
  padding-left: 10px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1.88px;
  color: #5b6279;
  cursor: pointer;
  text-transform: uppercase;
`;

const OptionsSection = styled.div`
  display: grid;
  justify-content: right;
  grid-template-columns: auto 100px;
  grid-column-gap: 20px;

  @media only screen and (max-width: 1200px) {
    grid-template-columns: 80% 20%;
    justify-content: left;
    padding-left: 10px;
  }
`;

const NavButtonWrapper = styled.div``;

interface AvatarProps {
  avatarImage: any;
}

// @ts-ignore
const AvatarButtonWrapper = styled.div<AvatarProps>`
  position: relative;
  transition: 0.3s;
  /* cursor: pointer; */
  border-radius: 50%;
  margin-left: 10px;
  width: 40px;
  height: 40px;
  padding: 5px;
  border: none;
  background-color: #fff;
  background-image: url(${(props: any) => props.avatarImage});
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;

  /* prevent users from selecting menu text */
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
`;

const BurgerBar = styled.div`
  display: none;

  @media only screen and (max-width: 1200px) {
    display: grid;
    height: 100vh;
  }
`;

const UserInitials = styled.div`
  justify-content: center;
  color: #fff;
  display: block;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
`;

const styles = {
  bmBurgerButton: {
    position: "fixed",
    width: "36px",
    height: "30px",
    left: "36px",
    top: "36px",
  },
  bmBurgerBars: {
    background: "#5444DA",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
  },
  bmCrossButton: {
    height: "24px",
    width: "24px",
    display: "none",
  },
  bmCross: {
    background: "#bdc3c7",
    display: "none",
  },
  bmMenuWrap: {
    position: "fixed",
    height: "100%",
  },
  bmMenu: {
    background: "#f2f2f2",
    fontSize: "1.15em",
    overflow: "none",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "#b8b7ad",
    padding: "0.8em",
    display: "grid",
    height: "200px",
  },
  bmItem: {
    marginTop: "20px",

    height: "30px",
    textDecoration: "none",
    display: "flex",
    flexDirection: "row",
    fontFamily: "Mulish', sans-serif",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "bold",
    letterSacing: "1.88px",
    color: "#5b6279",
    textTransform: "uppercase",
    outline: "none",
  },
  bmOverlay: {
    // background: "rgba(0, 0, 0, 0.3)",
  },
};
