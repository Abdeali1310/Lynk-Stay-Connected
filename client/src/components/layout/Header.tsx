import React, { lazy, Suspense, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import Logout from "@mui/icons-material/Logout";
import { Backdrop } from "@mui/material";

const Search = lazy(() => import("../specific/Search"));
const Notifications = lazy(() => import("../specific/Notifications"));
const NewGroup = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [isNotification, setIsNotification] = useState(false);

  const navigate = useNavigate();
  const handleMenuClick = () => {
    console.log("Menu icon clicked");
    setIsMobile((prev) => !prev);
  };
  const handleSearchClick = () => {
    console.log("Search icon clicked");
    setIsSearch((prev) => !prev);
  };
  //for open new group
  const handleAddClick = () => {
    console.log("Add icon clicked");
    setIsNewGroup((prev) => !prev);
  };

  const handleNotification = () => {
    console.log("Notification icon clicked");
    setIsNotification((prev) => !prev);
  };

  const handleGroupClick = () => {
    navigate("/groups");
  };

  const logoutHandler = () => {
    console.log("Logout handler called");
  };
  return (
    <div>
      <AppBar
        position="static"
        sx={{ height: "4rem", justifyContent: "center" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <Tooltip title="Menu">
              <IconButton color="inherit" onClick={handleMenuClick}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            <b>Lynk</b>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Search">
              <IconButton color="inherit" onClick={handleSearchClick}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add">
              <IconButton color="inherit" onClick={handleAddClick}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Group">
              <IconButton color="inherit" onClick={handleGroupClick}>
                <GroupIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotification}>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={logoutHandler}>
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <Search />{" "}
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <Notifications />{" "}
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroup />{" "}
        </Suspense>
      )}
    </div>
  );
};

export default Header;
