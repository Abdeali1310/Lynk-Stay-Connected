const { userSocketIDs } = require("../server");
const getOtherMember = (members, userId) => {
  return members.find((member) => member._id.toString() !== userId.toString());
};

const getSockets = (users = []) => {
  const sockets = users.map((user) => userSocketIDs.get(user._id.toString()));
  return sockets;
};
module.exports = { getOtherMember, getSockets };
