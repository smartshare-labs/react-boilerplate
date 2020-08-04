import React, { useState, useEffect } from "react";
import styled from "styled-components";
import moment from "moment-timezone";

import { getGreetingTime } from "../../utils/Greeting";
import {
  Sidebar,
  ShareCard,
  DataCard,
  EventCard,
  Button,
  Author,
  Table,
  ListItem,
  SubHeader,
} from "smartshare-ui";
import EventIcon from "../../assets/events.svg";

const Detail = ({ name, username, userId, profileUrl }: any) => {
  const [upcomingEvents, setUpcomingEvents] = useState<any>([]);

  useEffect(() => {}, []);

  return (
    <Container>
      <DetailHeader>
        <TitleSection>
          <Title>{"Delight Customers"}</Title>
        </TitleSection>
        <DataSection>
          <Label>Owned by SMCET</Label>
          <Label>Shared with 3 squads</Label>
          <Label>In Planning</Label>
          <Label>H1 2021</Label>
        </DataSection>
      </DetailHeader>
      <TableWrapper>
        <SubHeader text={"Key Results"} />
        {upcomingEvents !== null && upcomingEvents.length < 1 && (
          <Table
            headerItems={[]}
            tableData={[]}
            emptyTableIcon={EventIcon}
            emptyTableTitle={"No KRs yet."}
            emptyTableDescription={"This objective has no key results yet."}
          />
        )}
        {upcomingEvents.map((i: any) => {
          return (
            <ListItem
              onClick={() => {
                window.location.href = `/e/${i.event_id}`;
              }}
            />
          );
        })}
      </TableWrapper>
    </Container>
  );
};

export default Detail;

const Label = styled.div`
  font-size: 20px;
`;

const Title = styled.div`
  font-size: 30px;
`;

const DetailHeader = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-row-gap: 20px;
`;

const TitleSection = styled.div``;

const DataSection = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-column-gap: 10px;
  border-top: 1px solid #f2f2f2;
  padding-top: 20px;
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
