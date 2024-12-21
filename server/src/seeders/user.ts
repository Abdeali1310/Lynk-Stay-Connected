import { faker, simpleFaker } from "@faker-js/faker";
import User from "../models/User";
import Chat from "../models/Chat";
import Message from "../models/Message";

const createUser = async (numUser) => {
  try {
    const userPromise = [];

    for (let i = 0; i < numUser; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.username(),
        bio: faker.lorem.sentences(10),
        password: "password",
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName,
        },
      });
      userPromise.push(tempUser);
    }

    await Promise.all(userPromise);
    console.log("Users created ", numUser);
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createSingleChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");
    const chatsPromise = [];

    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        chatsPromise.push(
          Chat.create({
            name: faker.lorem.words(2),
            members: [users[i], users[j]],
          })
        );
      }
    }

    await Promise.all(chatsPromise);
    console.log("Chats created successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const createGroupChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");
    const chatsPromise = [];

    const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
    const members = [];
    for (let i = 0; i < numChats; i++) {

      for (let i = 0; i < numMembers; i++) {
        const randomIndex = Math.floor(Math.random() * users.length);

        const randomUser = users[randomIndex];

        if (!members.includes(randomUser)) {
          members.push(randomUser);
        }
      }

      const chat = Chat.create({
        groupChat: true,
        name: faker.lorem.words(1),
        members,
        creator: members[0],
      });

      await Promise.all(chatsPromise);
      console.log("Chats created succesfully");

      process.exit();
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const createMessages = async (numMessages) => {
  try {
    const users = await User.find().select("_id");
    const chats = await Chat.find().select("_id");

    const messagePromise = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      messagePromise.push(
        Message.create({
          chat: randomChat,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagePromise);
    console.log("Message created successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const createMessagesInAChat = async (chatId, numMessages) => {
  try {
    const users = await User.find().select("_id");
    const messagePromise = [];
    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      messagePromise.push(
        Message.create({
          chat: chatId,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagePromise);
    console.log("Message created successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = {
  createUser,
  createSingleChats,
  createGroupChats,
  createMessages,
  createMessagesInAChat,
};
