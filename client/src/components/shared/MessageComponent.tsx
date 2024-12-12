import { Typography } from "@mui/material";
import React, { memo } from "react";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachment = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;

  return (
    <div
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color="#2694ab" fontWeight={"300"} variant="caption">
          {sender.name}
        </Typography>
      )}
      {content && <Typography>{content}</Typography>}

      {/* Attachments */}
      
    </div>
  );
};

export default memo(MessageComponent);
