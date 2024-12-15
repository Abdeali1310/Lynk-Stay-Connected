export const sampleChats = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John Doe",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Jane",
    _id: "2",
    groupChat: false,
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John Doe",
    _id: "1",
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Jane",
    _id: "2",
  },
];

export const sampleNotifications = [
  {
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "John Doe",
    },
    _id: "1",
  },
  {
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "Jane",
    },
    _id: "2",
  },
];

export const sampleMessage = [
  {
    attachments: [],
    content: "Hii",
    _id: "jsnandikim",
    sender: {
      _id: "user._id",
      name: "abc",
    },
    chat: "chatId",
    createdAt: "2024-12-12T13:40:32.920Z",
  },
  {
    attachments: [
      {
        public_id: "ajnkik",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "",
    _id: "jsnandikim",
    sender: {
      _id: "user2._id",
      name: "abc",
    },
    chat: "chatId",
    createdAt: "2024-12-12T13:40:32.920Z",
  },
];

export const dashboardData = {
  users: [
    {
      name: "John Doe",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: 1,
      username: "john_doe",
      friends: 20,
      groups: 5,
    },
    {
      name: "Jane Doe",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: 2,
      username: "jane_doe",
      friends: 15,
      groups: 20,
    },
  ],

  chats: [
    {
      name: "The Fashion Hub",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: 1,
      groupChat: false,
      members: [
        {
          _id: 1,
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
        {
          _id: 2,
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],

      totalMembers:2,
      totalMessages:20,
      creator:{
        name:"John Doe",
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      }
    },
    {
      name: "The Music Hub",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: 2,
      groupChat: false,
      members: [
        {
          _id: 1,
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
        {
          _id: 2,
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
        {
          _id: 3,
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
        {
          _id: 4,
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
        {
          _id: 5,
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],

      totalMembers:5,
      totalMessages:12,
      creator:{
        name:"Jane Doe",
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      }
    },
  ],
};
