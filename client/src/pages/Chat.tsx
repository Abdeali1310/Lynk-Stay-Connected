/* eslint-disable react-refresh/only-export-components */
import { IconButton, Stack } from "@mui/material";
import AppLayout from "../components/layout/AppLayout";
import { useRef } from "react";
import { AttachFile, Send, SendAndArchiveOutlined } from "@mui/icons-material";
import { InputBox } from "../components/Styles/StyledComponents";
import { sampleMessage } from "../components/constants/sampleData";
import MessageComponent from "../components/shared/MessageComponent";

const Chat = () => {
  const containerRef = useRef(null);
  const fileMenuRef = useRef(null);

  const user = {
    _id:"user._id",
      name:"abc",
  }

  return (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={"lightgray"}
        height={"90%"}
        sx={{ overflowX: "hidden", overflowY: "auto" }}
      >
        

        {sampleMessage.map((i)=>(
          <MessageComponent message={i} user={user} />
        ))}
      </Stack>

      <form action="" style={{ height: "10%" }}>
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{ position: "absolute", left: "1.5rem", rotate: "30deg" }}
          >
            <AttachFile />
          </IconButton>

          <InputBox placeholder="Type Message here....." />

          <IconButton
            type="submit"
            sx={{
              bgcolor: "green",
              rotate: "-30deg",
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": { bgcolor: "darkgreen" },
            }}
          >
            <Send />
          </IconButton>
        </Stack>
      </form>
    </>
  );
};

export default AppLayout()(Chat);
