import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiCheck } from "react-icons/fi";
import { useHistory } from "react-router-dom";
const DetailModal = (props: any) => {
  const history = useHistory();
  const { closeModal } = props;

  useEffect(() => {}, []);

  return <Wrapper></Wrapper>;
};

export default DetailModal;

const Wrapper = styled.div`
  border-radius: 5px;
  padding: 20px;
  margin: auto;
  background-color: #fff;
`;
