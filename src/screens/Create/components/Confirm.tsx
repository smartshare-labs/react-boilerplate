import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiCheck } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import CheckIcon from "../../../assets/connected.svg";
const StyledIcon = ({ className, size }: any) => {
  return (
    <div className={className}>
      <FiCheck size={size} />
    </div>
  );
};

const Confirm = (props: any) => {
  const history = useHistory();
  const { closeModal } = props;
  const [eventId, setEventId] = useState<string>("");

  useEffect(() => {
    const createdEventId: any = localStorage.getItem("createdEventId");
    if (createdEventId !== undefined) {
      setEventId(createdEventId);
      localStorage.removeItem("createdEventId");
    }
  }, []);

  return (
    <Wrapper>
      <FormContainer>
        <FormHeader>You're going!</FormHeader>
        <IconContainer>
          <IconWrapper src={CheckIcon} />
        </IconContainer>
        <FormTitle>We sent a confirmation to your email.</FormTitle>
      </FormContainer>
      <FormButton
        onClick={() => {
          history.push(`/event/${eventId}`);
        }}
      >
        Close
      </FormButton>
    </Wrapper>
  );
};

export default Confirm;

const IconWrapper = styled.img`
  height: 60px;
  width: 60px;
`;

const Wrapper = styled.div`
  border-radius: 5px;
  padding: 20px;
  margin: auto;
  background-color: #fff;
`;

const IconContainer = styled.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
  margin-bottom: 10px;
`;

const Icon = styled(StyledIcon)`
  margin-left: auto;
  margin-right: auto;
  color: #000;
`;

const FormContainer = styled.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const FormTitle = styled.div`
  text-align: center;
  font-size: 20px;
  color: #5b6279;
  padding: 10px 0px 10px 0px;
`;

const FormHeader = styled.span`
  text-align: center;
  display: block;
  font-size: 30px;
  font-weight: bold;
  color: #0e1118;
`;

const FormButton = styled.button`
  width: 241px;
  height: 50px;
  border-radius: 14px;
  color: #fff;
  background-color: ${(props) => props.theme.primaryColor}
  border: none;
  letter-spacing: 0.1em;
  margin-top: 10px;
  padding: 0px 20px;
  font-size: 16px;
  font-weight: 400;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
