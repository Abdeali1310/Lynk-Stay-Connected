/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import {
  VisuallyHiddenInput,
  visuallyHiddenInput,
} from "../../components/Styles/StyledComponents";
import { useFileHandler } from "6pp";
import { Navigate } from "react-router-dom";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
    const isAdmin = false;
  const avatar = useFileHandler("single");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    bio: "",
    username: "",
    password: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "login" | "signup"
  ) => {
    const { name, value } = e.target;
    if (type === "login") {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setSignupData({ ...signupData, [name]: value });
    }
  };

  const handleSubmit = () => {
    if (isLogin) {
      console.log("Login Data:", loginData);
    } else {
      console.log("Signup Data:", signupData);
    }
  };


  if(isAdmin){
    return <Navigate to={"/admin/dashboard"} />
  }
  return (
    
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        p={3}
        bgcolor="#f5f5f5"
      >
        <Box
          width={400}
          p={4}
          bgcolor="#fff"
          borderRadius={4}
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
        >
          <Typography variant="h5" textAlign="center" mb={2}>
            {isLogin ? "Login" : "Signup"}
          </Typography>

          {!isLogin && (
            <>
              <Stack
                position="relative"
                width="10rem"
                margin="auto"
                mb={2}
                justifyContent="center"
                alignItems="center"
              >
                <Avatar
                  sx={{
                    width: "10rem",
                    height: "10rem",
                    objectFit: "contain",
                  }}
                  src={avatar.preview}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.5)",
                    ":hover": {
                      bgcolor: "rgba(0,0,0,0.5)",
                    },
                  }}
                  component="label"
                >
                  <>
                    <CameraAlt />
                    <VisuallyHiddenInput
                      type="file"
                      onChange={avatar.changeHandler}
                    />
                  </>
                </IconButton>
              </Stack>

              {avatar.error && (
                <Typography sx={{ color: "red" }} variant="caption">
                  * {avatar.error}
                </Typography>
              )}
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={signupData.name}
                onChange={(e) => handleInputChange(e, "signup")}
                margin="normal"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={signupData.bio}
                onChange={(e) => handleInputChange(e, "signup")}
                margin="normal"
                variant="outlined"
                required
              />
            </>
          )}

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={isLogin ? loginData.username : signupData.username}
            onChange={(e) => handleInputChange(e, isLogin ? "login" : "signup")}
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={isLogin ? loginData.password : signupData.password}
            onChange={(e) => handleInputChange(e, isLogin ? "login" : "signup")}
            margin="normal"
            variant="outlined"
            required
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            {isLogin ? "Login" : "Signup"}
          </Button>

          
        </Box>
      </Box>
    
  );
};

export default Login;
