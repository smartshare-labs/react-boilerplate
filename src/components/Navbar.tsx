import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import GenericAvatar from "../assets/avatar.png";

const NavBar = (props: any) => {
  const history = useHistory();
  const { currentUser, imageSource } = props;

  const displayUserAvatar = () => {
    if (imageSource !== "") {
      return (
        <AvatarButtonWrapper avatarImage={imageSource}></AvatarButtonWrapper>
      );
    }
    return (
      <AvatarButtonWrapper avatarImage={GenericAvatar}></AvatarButtonWrapper>
    );
  };

  const handleLogout = async () => {
    localStorage.clear();
    return (window.location.href = "/");
  };

  return (
    <Wrapper>
      <LogoSection
        onClick={() => {
          history.push("/");
        }}
      >
        App
      </LogoSection>
      {currentUser === "" ? (
        <LoginSection>
          <NavButtonWrapper>
            <NavButton
              onClick={() => {
                history.push("/login");
              }}
            >
              LOG IN
            </NavButton>
          </NavButtonWrapper>
        </LoginSection>
      ) : (
        <OptionsSection>
          <NavButtonWrapper>
            <NavButton
              onClick={() => {
                currentUser === "" ? history.push("/") : history.push("/");
              }}
            >
              CREATE
            </NavButton>
          </NavButtonWrapper>
          <NavButtonWrapper>
            <NavButton
              onClick={() => {
                history.push("/");
              }}
            >
              PROFILE
            </NavButton>
          </NavButtonWrapper>
          <NavButtonWrapper>
            <NavButton
              onClick={() => {
                history.push("/");
              }}
            >
              SETTINGS
            </NavButton>
          </NavButtonWrapper>
          <NavButtonWrapper>
            <NavButton
              onClick={() => {
                handleLogout();
              }}
            >
              LOG OUT
            </NavButton>
          </NavButtonWrapper>
          {displayUserAvatar()}
        </OptionsSection>
      )}
    </Wrapper>
  );
};

export default NavBar;

const HamburgerMenu = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${({ theme }) => theme.primaryLight};
  height: 100vh;
  text-align: left;
  padding: 2rem;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;

  @media (max-width: ${({ theme }) => theme.mobile}) {
    width: 100%;
  }

  a {
    font-size: 2rem;
    text-transform: uppercase;
    padding: 2rem 0;
    font-weight: bold;
    letter-spacing: 0.5rem;
    color: ${({ theme }) => theme.primaryDark};
    text-decoration: none;
    transition: color 0.3s linear;

    @media (max-width: ${({ theme }) => theme.mobile}) {
      font-size: 1.5rem;
      text-align: center;
    }

    &:hover {
      color: ${({ theme }) => theme.primaryHover};
    }
  }
`;

const Wrapper = styled.div`
  display: grid;
  height: 50px;
  width: 100%;
  background-color: ${({ theme }) => theme.indieBlue};
  padding: 20px 0px 20px 0px;
  grid-template-columns: 50% 50%;

  @media only screen and (max-width: 600px) {
    display: grid;
    grid-template-columns: 50% 50%;
  }
`;

const LogoSection = styled.div`
  padding: 0px 70px 0px 70px;
  height: 70px;
  justify-content: left;
  padding-top: 5px;
  font-size: 30px;
  font-family: "Gill Sans", sans-serif;
  color: #fff;
  cursor: pointer;
`;

const LoginSection = styled.div`
  padding: 0px 70px 0px 70px;
  display: grid;
  height: 50px;
  justify-content: right;
`;

const MenuSection = styled.div`
  padding: 0px 70px 0px 70px;
  display: grid;
  height: 50px;
  justify-content: left;
  grid-template-columns: 100px 100px;
`;

const OptionsSection = styled.div`
  display: grid;
  justify-content: right;
  grid-template-columns: 100px 100px 100px 100px 100px;
  grid-column-gap: 10px;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const AccountSection = styled.div<any>`
  padding: 0px 70px 0px 70px;
  display: grid;
  height: 50px;
  justify-content: right;
  grid-template-columns: ${(props: any) =>
    props.currentUser ? "50px" : "100px"};
`;

const NavButtonWrapper = styled.div`
  margin-left: 10px;
`;

interface AvatarProps {
  avatarImage: any;
}

// @ts-ignore
const AvatarButtonWrapper = styled.div<AvatarProps>`
  position: relative;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  /* cursor: pointer; */
  border-radius: 50%;
  margin-left: 10px;
  width: 40px;
  height: 40px;
  padding: 5px;
  border: 1px solid #ddd;
  background-color: ${({ theme }) => theme.indieBlue};
  background-image: url(${(props: any) => props.avatarImage});
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;

  /* prevent users from selecting menu text */
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */

  /* &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    opacity: 0.5;
  } */
`;

const UserInitials = styled.div`
  justify-content: center;
  color: #fff;
  display: block;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
`;

const NavButton = styled.button`
  background-color: ${({ theme }) => theme.indieBlue};
  color: #fff;
  height: 45px;
  min-width: 90px;
  letter-spacing: 0.1em;
  font-size: 12px;
  border: none;
  /* border-bottom: 0.5px solid #fff; */
  font-weight: 400;

  padding: 0 10px;
  &:focus {
    outline: none;
  }

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
