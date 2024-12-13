/* eslint-disable @typescript-eslint/no-unused-vars */
import { Stack } from "@mui/material";
import React from "react";
import ChatItem from "../shared/ChatItem";

interface ChatListProps {
  w?: string;
  chats: Array<{ id: string; name: string; message: string }>;
  chatId: string;
  onlineUsers: Array<string>;
  newMessagesAlert: Array<{ chatId: string; count: number }>;
  handleDeleteChatOpen: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [{ chatId: "", count: 0 }],
  handleDeleteChatOpen,
}) => {
  return (
    <Stack width={w} direction={"column"} overflow={"auto"} height={"100%"}>
      {chats.map((data, index) => {
        const { avatar, _id, members, groupChat, name } = data;

        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );

        const isOnline = members.some((member) => onlineUsers.includes(_id));
        return (
          <ChatItem
          index={index}
            newMessagesAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId == _id}
            handleDeleteChatOpen={handleDeleteChatOpen}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
