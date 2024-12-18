const emitEvent = (req, event, users, data) => {
  console.log("Emitting event ", event);
};

module.exports = { emitEvent };
