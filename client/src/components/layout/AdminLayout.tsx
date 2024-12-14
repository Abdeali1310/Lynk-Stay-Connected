import React, { useState } from "react";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { Close, ExitToApp, MenuBook, MenuOpen } from "@mui/icons-material";
import { adminTabs } from "../constants/routes";
import { Link } from "../Styles/StyledComponents";
import { Navigate, useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
    const isAdmin = true;
  const Sidebar = ({ w = "100%" }) => {

    const logoutHandler = ()=>{
        console.log("logout");
        
    }
    return (
      <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
        <Typography variant="h5" textTransform={"uppercase"}>
          Lynk
        </Typography>

        <Stack spacing={"1rem"}>
          {adminTabs.map((i) => {
            return (
              <Link
                to={i.path}
                key={i.path}
                sx={
                  location.pathname === i.path && {
                    p: "1rem",
                    bgcolor: "#010101",
                    color: "white",
                    ":hover": { color: "gray", bgcolor: "black" },
                    borderRadius: "2rem",
                  }
                }
              >
                <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                  {i.icon}
                  <Typography>{i.name}</Typography>
                </Stack>
              </Link>
            );
          })}

          <Link onClick={logoutHandler} >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              {<ExitToApp />}
              <Typography>Logout</Typography>
            </Stack>
          </Link>
        </Stack>
      </Stack>
    );
  };

  const handleMobile = () => {
    setIsMobile(!isMobile);
  };

  if(!isAdmin){
    return <Navigate to={"/admin"} />
  }
  const handleClose = () => {
    setIsMobile(false);
  };
  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <Close /> : <MenuOpen />}
        </IconButton>
      </Box>
      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <Sidebar />
      </Grid>
      <Grid item xs={12} md={8} lg={9} sx={{ bgcolor: "#f5f5f5" }}>
        {children}
      </Grid>

      <Drawer open={isMobile} onClose={handleClose}>
        <Sidebar w="50vw" />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
