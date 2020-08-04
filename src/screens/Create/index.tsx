import React, { useState, useEffect } from "react";
import styled from "styled-components";
import moment from "moment-timezone";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import ReactGA from "react-ga";
import Modal, { ModalProps } from "../../components/Modal";
import { useHistory } from "react-router-dom";
import { timeOptions, durationOptions } from "../../utils/MenuOptions";
import Confirm from "./components/Confirm";

const Create = (props: any) => {
  const [name, setName] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);

  const { handleNext, addToast, username } = props;
  const history = useHistory();

  const zone = moment.tz.guess();

  useEffect(() => {}, []);

  const handleChange = (newValue: any, actionMeta: any) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  const handleInputChange = (inputValue: any, actionMeta: any) => {
    console.group("Input Changed");
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  const handleToast = () => {
    let content = undefined;
    if (name === "") {
      content = "Please enter a title.";
    }
    return content;
  };

  const submitEvent = async () => {
    const errorMessage = await handleToast();
    if (errorMessage !== undefined) {
      return addToast(errorMessage, {
        appearance: "error",
        autoDismiss: true,
      });
    }

    // analytics tracking
    ReactGA.event({
      category: "EVENT",
      action: "Event created",
      label: "CREATE_EVENT",
    });
  };

  // DOM ref for modals, so we can disable scroll on our parent element (this page) when visible
  const targetRef: any = React.createRef();

  const handleCloseModal = () => {
    return setModalVisible(false);
  };

  return (
    <Wrapper>
      <FormWrapper>
        <FormInputContainer>
          <FormContainer>
            <FormHeaderText>OKR Details</FormHeaderText>
            <FormTitle>Objective</FormTitle>
            <SelectOrCreate
              isClearable
              onChange={handleChange}
              onInputChange={handleInputChange}
              options={timeOptions}
              placeholder="Select or create an objective"
            />
            <FormTitle>Description</FormTitle>
            <DescriptionInput
              rows={4}
              placeholder=""
              value={""}
              onChange={(event: any) => {}}
            />
            <FormTitle>KR</FormTitle>
            <SelectTimeWrapper>
              <StyledSelect
                value={""}
                onChange={(time: any) => {}}
                options={timeOptions}
              />
            </SelectTimeWrapper>
            <FormTitle>Business Period</FormTitle>
            <StyledSelect
              value={""}
              onChange={(time: any) => {}}
              options={durationOptions}
            />
            <PaymentSection>
              <FormHeaderText>Team</FormHeaderText>
              <TicketWrapper>
                <StyledSelect
                  value={""}
                  onChange={(time: any) => {}}
                  options={durationOptions}
                />
              </TicketWrapper>
            </PaymentSection>
          </FormContainer>
          <FormButton
            onClick={(event) => {
              event.preventDefault();
              window.scroll(0, 0);
              submitEvent();
            }}
          >
            Create
          </FormButton>
        </FormInputContainer>
      </FormWrapper>
      <ModalWrapper
        isVisible={modalVisible}
        closeModal={handleCloseModal}
        targetRef={targetRef}
      >
        <Confirm closeModal={handleCloseModal} />
      </ModalWrapper>
    </Wrapper>
  );
};

export default Create;

const SelectOrCreate = styled(CreatableSelect)`
  width: 70%;
  height: 30px;
  margin-bottom: 20px;
`;

const ModalWrapper = styled(Modal)<ModalProps>`
  padding: 0px;
  min-height: 100px;
`;

const Wrapper = styled.div`
  border-radius: 5px;
  padding: 0px 10px 50px 10px;
  /* background-color: #fff; */
  /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); */

  @media all and (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

const FormWrapper = styled.div`
  height: 100%;
`;

const FormInputContainer = styled.div`
  padding: 10px 0px 10px 0px;
  display: grid;
`;

const FormContainer = styled.div`
  display: block;
  padding-bottom: 20px;
`;

const FormTitle = styled.div`
  font-weight: 300;
  font-size: 16px;
  padding: 10px 0px 10px 0px;
`;

const PaymentSection = styled.div`
  /* border-top: 1px solid #cccccc; */
  padding: 20px 0px 20px 0px;
  /* margin-top: 20px; */
  /* display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 10px; */
`;

const TicketWrapper = styled.div`
  width: 50%;
`;

const FormHeaderText = styled.div`
  font-size: 24px;
  font-weight: 500;
  padding: 0px 0px 20px 0px;
`;

const FormInput = styled.input`
  width: 70%;
  height: 30px;
  font-size: 14px;
  font-weight: 300;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #cccccc;
  margin-bottom: 15px;
`;

const DescriptionInput = styled.textarea`
  width: 70%;
  white-space: pre-line;
  padding: 10px;
  height: 100px;
  font-size: 14px;
  font-weight: 300;
  border-radius: 5px;
  border: 1px solid #cccccc;
  resize: none;
  margin-bottom: 15px;
`;

const FormButton = styled.div`
  background-color: ${(props) => props.theme.primaryColor}
  color: #fff;

  opacity: 0.7;
  border: none;

  border-radius: 4px;
  height: 25px;
  padding: 10px;
  width: 70%;
  font-size: 18px;
  font-weight: 300;
  display: grid;
  justify-content: center;

  /* prevent users from selecting menu text */
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const StyledSelect = styled(Select)`
  display: inline-block;
  position: relative;
  margin-bottom: 15px;
  min-width: 200px;

  .Select.is-open {
    z-index: 1000 !important;
  }
`;

const SelectTimeWrapper = styled.div`
  display: grid;
  grid-template-columns: 200px 200px;
  grid-column-gap: 20px;
`;
