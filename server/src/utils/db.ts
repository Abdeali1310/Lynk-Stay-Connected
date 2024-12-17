import mongoose from "mongoose";

const connectDB = async (URL:string) => {
  await mongoose
    .connect(URL)
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((error) => {
      console.log("MongoDB Error", error);
    });
};

module.exports = {connectDB}