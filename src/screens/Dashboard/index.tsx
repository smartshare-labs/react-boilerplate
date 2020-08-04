import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal, { ModalProps } from "../../components/Modal";
import DetailModal from "../../components/DetailModal";
import { getGreetingTime } from "../../utils/Greeting";
import { DataCard, Table, SubHeader } from "smartshare-ui";
import EventIcon from "../../assets/events.svg";

const Dashboard = ({ name, username, userId, profileUrl }: any) => {
  const [upcomingEvents, setUpcomingEvents] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {}, []);

  const handleCloseModal = () => {
    return setModalVisible(false);
  };

  // DOM ref for modals, so we can disable scroll on our parent element (this page) when visible
  const targetRef: any = React.createRef();

  return (
    <Container>
      <Header>
        <Greeting>
          {getGreetingTime() + (username ? `, ${username}` : ".")}
        </Greeting>
      </Header>
      <Wrapper>
        <DataCard
          data={[
            {
              title: "In progress",
              data: `${34} / ${100}`,
              label: "",
            },
            {
              title: "Completed",
              data: `${66} / ${100}`,
              label: "",
            },
          ]}
        />
      </Wrapper>
      <TableWrapper>
        <SubHeader text={"Your Objectives"} />
        {upcomingEvents !== null && upcomingEvents.length < 1 && (
          <Table
            headerItems={[]}
            tableData={[]}
            emptyTableIcon={EventIcon}
            emptyTableTitle={"No objectives yet."}
            emptyTableDescription={"Once you create an OKR you'll see it here."}
          />
        )}
      </TableWrapper>
      <ModalWrapper
        isVisible={modalVisible}
        closeModal={handleCloseModal}
        targetRef={targetRef}
      >
        <DetailModal closeModal={handleCloseModal} />
      </ModalWrapper>
    </Container>
  );
};

export default Dashboard;

const ModalWrapper = styled(Modal)<ModalProps>`
  padding: 0px;
  min-height: 100px;
`;

const Container = styled.div`
  padding: 10px 10px 50px 10px;
`;

const Wrapper = styled.div`
  max-width: 70%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;

  @media only screen and (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1em;
  }
`;

const TableWrapper = styled.div`
  padding: 20px 0px 20px 0px;
`;

const Greeting = styled.div`
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #0e1118;
  justify-content: left;
  font-size: 30px;

  @media only screen and (max-width: 768px) {
    display: grid;
    justify-content: left;
  }
`;

const Header = styled.div`
  display: grid;
  padding: 0px 0px 30px 0px;
  width: 100%;

  @media only screen and (max-width: 600px) {
    margin-bottom: 0px;
  }
`;
