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
    attachments:[
      {
        public_id:"ajnkik",
        url:"https://www.w3schools.com/howto/img_avatar.png"
      }
    ],
    content:"Hii",
    _id:"jsnandikim",
    sender:{
      _id:"user._id",
      name:"abc", 
    },
    chat:"chatId",
    createdAt:'2024-12-12T13:40:32.920Z'
  },
  {
    attachments:[
      {
        public_id:"ajnkik",
        url:"https://www.w3schools.com/howto/img_avatar.png"
      }
    ],
    content:"Hey!",
    _id:"jsnandikim",
    sender:{
      _id:"user2._id",
      name:"abc", 
    },
    chat:"chatId",
    createdAt:'2024-12-12T13:40:32.920Z'
  }
]