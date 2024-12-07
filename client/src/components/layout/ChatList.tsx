/* eslint-disable @typescript-eslint/no-unused-vars */
import { Stack } from "@mui/material";
import React from "react";

interface ChatListProps {
  w?: string;
  chats: Array<{ id: string; name: string; message: string }>;
  chatId: string;
  onlineUsers: Array<string>;
  newMessageAlert: Array<{ chatId: string; count: number }>;
  handleDeleteChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessageAlert = [{ chatId: "", count: 0 }],
  handleDeleteChat,
}) => {
  return (
    <Stack width={w} direction={"column"}>
      {chats.map((data,index) => {
        return <div key={index}>{data}</div>;
      })}
    </Stack>
  );
};

export default ChatList;
