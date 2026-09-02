import mongoose from "mongoose";

const connectDB = async () => {
// 1. Tell Mongoose to listen for a successful connection event from the database
  mongoose.connection.on("connected", () => {
    console.log("db connected");
  });
  
// 2. runs automatically ONLY when the database connection succeeds
  await mongoose.connect(process.env.MONGODB_URI);
};

export default connectDB;