import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import {
  AdminPanelSettings,
  Group,
  Message,
  NotificationAddSharp,
  NotificationImportant,
  Notifications,
  Person,
} from "@mui/icons-material";
import {
  CurveButton,
  SearchField,
} from "../../components/Styles/StyledComponents";
import moment from "moment";
import {DoughnutChart, LineChart} from "../../components/specific/Charts"

const Dashboard = () => {
  const Appbar = (
    <Paper
      elevation={3}
      sx={{ padding: "2rem", margin: "2rem 0", borderRadius: "2rem" }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AdminPanelSettings sx={{ fontSize: "2.5rem" }} />
        <SearchField placeholder="Search here..." />
        <CurveButton>Search</CurveButton>
        <Box flexGrow={1} />
        <Typography
          display={{ xs: "none", lg: "block" }}
          color={"rgba(0,0,0,0.7)"}
          textAlign={"center"}
        >
          {moment().format("dddd MMMM Do YYYY")}
        </Typography>
        <Notifications />
      </Stack>
    </Paper>
  );

  const Widgets = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent={"space-between"}
      alignItems={"center"}
      margin={"2rem 0"}
      spacing={"2rem"}
    >
        
      <Widget title={"Users"} value={50} Icon={<Person />} />
      <Widget title={"Chats"} value={10} Icon={<Group />} />
      <Widget title={"Messages"} value={250} Icon={<Message />} />
    </Stack>
  );

  return (
    <AdminLayout>
      <Container component={"main"}>
        {Appbar}

        <Stack direction={{xs:"column",lg:"row"}} alignItems={{sm:"center",lg:"stretch"}} justifyContent={"center"} sx={{gap:"2rem"}} flexWrap={"wrap"}>
          <Paper
            elevation={3}
            sx={{
              padding: "2rem 3.5rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem",
            }}
          >
            <Typography margin={"2rem 0"} variant="h4">
              Last Messages
            </Typography>
            <LineChart value={[22,56,33,67,34,3]}/>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              borderRadius: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              position: "relative",
              width: "100%",
              maxWidth: "25rem",
              height:"25rem"
            }}
          >
            <DoughnutChart labels={["Single Chats","Group Chats"]} value={[25,75]} />

            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"0.5rem"}
              width={"100%"}
              height={"100%"}
            >
                <Group /><Typography>Vs</Typography> <Person />
            </Stack>
          </Paper>
        </Stack>

        {Widgets}
      </Container>
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: "2rem",
        margin: "2rem 0",
        borderRadius: "1rem",
        width: "20rem",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
      }}
      
    >
      <Stack alignContent={"center"} justifyContent={"center"} spacing={"1rem"}>
        <Typography
          sx={{
            color: "rgba(0,0,0,0.7)",
            borderRadius: "50%",
            border: "5px solid rgba(0,0,0,0.9)",
            width: "5rem",
            height: "5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value}
        </Typography>
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
          {Icon}
          <Typography>{title}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};
export default Dashboard;
