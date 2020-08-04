import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import IdentityAPI from "../../services/api/identity";

import Modal, { ModalProps } from "../../components/Modal";
import { Button } from "smartshare-ui";

const Settings = (props: any) => {
  const { addToast } = useToasts();
  const history = useHistory();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [imageSource, setImageSource] = useState<any>("");
  const [selectedImage, setSelectedImage] = useState<any>("");
  const [bio, setBio] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const imageUploader: any = React.useRef(null);

  useEffect(() => {}, []);

  const handleImageUpload = async (e: any) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    try {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageSource(reader.result);
        setSelectedImage(file);
      };
    } catch (error) {
      return addToast("Unable to upload photo.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const handleToast = () => {
    let content;
    if (firstName === "") {
      content = "Please enter a first name.";
    } else if (lastName === "") {
      content = "Please enter a last name.";
    } else if (email === "") {
      content = "Please enter an email address.";
    }
    return content;
  };

  const handleSave = async () => {
    const errorMessage = await handleToast();
    if (errorMessage !== undefined) {
      return addToast(errorMessage, {
        appearance: "error",
        autoDismiss: true,
      });
    }

    let uploadedImage = undefined;

    // if user uploaded a new photo
    if (selectedImage !== "") {
      // upload and save profile picture
      const strImage = imageSource.replace(/^data:image\/[a-z]+;base64,/, "");
      const imageResponse = await IdentityAPI.UploadImage(strImage);
      if (imageResponse === undefined) {
        return addToast("Error uploading photo. Please try another.", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      uploadedImage = imageResponse.url;
    }

    let payload: any = {};
    payload["firstName"] = firstName;
    payload["lastName"] = lastName;
    payload["bio"] = bio;
    payload["imageUrl"] = uploadedImage;
    payload["email"] = email;

    const response = await IdentityAPI.UpdateUser(
      payload?.firstName,
      payload?.lastName,
      payload?.bio,
      payload?.imageUrl,
      payload?.email
    );

    if (response !== undefined) {
      return addToast("Settings saved!", {
        appearance: "success",
        autoDismiss: true,
      });
    }
    return addToast("Error saving settings.", {
      appearance: "error",
      autoDismiss: true,
    });
  };

  // DOM ref for modals, so we can disable scroll on our parent element (this page) when visible
  const targetRef: any = React.createRef();

  return (
    <Wrapper>
      <SettingSection>
        <HeadingSection>
          <Title>Account Settings</Title>
        </HeadingSection>
        <FormTitle>Profile Picture</FormTitle>
        <AvatarContainer>
          <input
            type="file"
            accept="image/*"
            style={{
              display: "none",
              cursor: "none",
            }}
            onChange={handleImageUpload}
            ref={imageUploader}
          />

          <ProfilePicture
            onClick={() => imageUploader.current.click()}
            // ref={uploadedImage}
            imageSource={imageSource}
          ></ProfilePicture>
          <ButtonRow>
            <UploadButton onClick={() => imageUploader.current.click()}>
              Select photo
            </UploadButton>
            <RemoveButton onClick={() => imageUploader.current.click()}>
              Remove photo
            </RemoveButton>
          </ButtonRow>
        </AvatarContainer>
        <FormTitle>First Name</FormTitle>
        <FormInput
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(event) => {
            setFirstName(event.target.value);
          }}
        />
        <FormTitle>Last Name</FormTitle>
        <FormInput
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(event) => {
            setLastName(event.target.value);
          }}
        />
        <FormTitle>Email Address</FormTitle>
        <FormInput
          type="text"
          placeholder="email@aol.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <FormTitle>Bio</FormTitle>
        <BioInput
          rows={4}
          placeholder="Bio"
          value={bio}
          onChange={(event) => {
            setBio(event.target.value);
          }}
        />
      </SettingSection>
    </Wrapper>
  );
};

export default Settings;

const Wrapper = styled.div`
  padding: 0px 10px 50px 10px;
`;

const ModalWrapper = styled(Modal)<ModalProps>`
  border: none;
  padding: 0px;
  min-height: 100px;
`;

const Body = styled.div`
  padding: 20px 100px 20px 100px;
  background-color: #f2f2f2;
  border-radius: 5px;
`;

const AvatarContainer = styled.div`
  width: 400px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 28px 64px -56px rgba(22, 28, 52, 0.4);
  background-color: #ffffff;
  display: grid;
  grid-template-columns: auto auto;
  margin-bottom: 15px;
`;

interface ProfilePictureProps {
  imageSource: string;
}

const ProfilePicture = styled.div<ProfilePictureProps>`
  display: block;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  padding: 5px;
  border: 1px solid #ddd;
  background-color: #f2f2f2;
  background-image: url(${(props: any) => props.imageSource});
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
  cursor: pointer;
`;

const UploadButton = styled.button`
  border: none;
  height: 30px;
  padding: 5px;
  width: 150px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #5444da;
  border-radius: 10px;
  background-color: #f4f5ff;
`;

const RemoveButton = styled.button`
  height: 30px;
  padding: 5px;
  width: 150px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #5b6279;
  border-radius: 10px;
  border: solid 1px rgba(91, 98, 121, 0.4);
  background-color: #fff;
`;

const Title = styled.div`
  font-size: 36px;
  font-weight: bold;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: -0.26px;
  color: #0e1118;
`;

const HeadingSection = styled.div`
  width: 100%;
  padding: 20px 0px 20px 0px;
`;

const SettingSection = styled.div`
  padding: 0px 0px 50px 0px;
  border-bottom: 1px solid #cccccc;

  &:last-child {
    border-bottom: none;
  }
`;

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
    border: solid 1.5px ${(props) => props.theme.primaryColor}

`;

const BioInput = styled.textarea`
  width: 400px;
  white-space: pre-line;
  padding: 10px;
  height: 100px;
  font-size: 14px;
  font-weight: 300;
  border-radius: 5px;
  border: 1px solid #cccccc;
  resize: none;
  margin-bottom: 15px;

  &:focus-within {
    border: solid 1.5px ${(props) => props.theme.primaryColor};
  }
`;

const FormButton = styled.div`
  background-color: ${({ theme }) => theme.indieButtonBackground};
  color: ${({ theme }) => theme.indieButtonText};
  opacity: 0.7;
  border: none;
  margin-bottom: 20px;
  border-radius: 4px;
  text-align: center;
  height: 25px;
  padding: 10px;
  width: 300px;
  font-size: 18px;
  font-weight: 300;
  display: block;

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

const ButtonRow = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-row-gap: 10px;
`;
