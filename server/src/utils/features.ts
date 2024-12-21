const emitEvent = (req, event, users, data) => {
  console.log("Emitting event ", event);
};

const deleteFilesFromCloudinary = async (public_id) => {};
module.exports = { emitEvent, deleteFilesFromCloudinary };
