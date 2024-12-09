import React, { memo } from "react";
import { Link } from "../Styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";

interface NewMessageAlert {
  chatId: string;
  count: number;
}

interface ChatItemProps {
  avatar: string[];
  name: string;
  _id: string;
  groupChat?: boolean;
  sameSender: boolean;
  isOnline: boolean;
  newMessagesAlert: NewMessageAlert;
  index?: number;
  handleDeleteChatOpen: (e, _id: string, groupChat) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessagesAlert,
  index = 0,
  handleDeleteChatOpen,
}) => {
  return (
    <Link
      sx={{ padding: "0" }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChatOpen(e, _id, groupChat)}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
        }}
      >
        <AvatarCard avatar={avatar} />

        <Stack>
          <Typography>{name}</Typography>
          {newMessagesAlert && (
            <Typography>{newMessagesAlert.count} New Message</Typography>
          )}
        </Stack>

        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </div>
    </Link>
  );
};

export default memo(ChatItem);
