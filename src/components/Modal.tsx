import React, { useEffect } from "react";
import styled from "styled-components";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

export interface ModalProps {
  children?: React.ReactElement;
  isVisible: boolean;
  closeModal: Function;
  className?: string;
  targetRef?: any;
}

const Modal = ({
  children,
  isVisible,
  closeModal,
  className,
  targetRef,
}: ModalProps) => {
  // const targetRef: any = React.createRef();

  useEffect(() => {
    // Scroll to top to avoid getting caught beneath the scroll lock
    window.scroll(0, 0);

    if (isVisible) {
      disableBodyScroll(targetRef);
    } else {
      clearAllBodyScrollLocks();
      // enableBodyScroll(targetRef);
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <Wrapper
      onClick={() => {
        closeModal();
      }}
    >
      <ModalWrapper
        onClick={(event) => {
          event.stopPropagation();
        }}
        className={className}
      >
        {children}
      </ModalWrapper>
    </Wrapper>
  );
};

export default Modal;

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  text-align: center;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(35, 41, 46, 0.3);
  text-align: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 60vw;
  height: 80vh;
  background-color: #fff;
  border-radius: 0px;
  padding: 20px;
  /* box-shadow: 2px 2px rgba(35, 41, 46, 0.2); */
  /* border: 1px solid rgba(35, 41, 46, 0.3); */

  animation: slideIn 500ms forwards;

  @keyframes slideIn {
    from {
      opacity: 0.1;
      top: -600px;
    }
    to {
      opacity: 1;
      top: 0px;
    }
  }
`;
