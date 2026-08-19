import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const connectDb = async ()=>{
   try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("✅ MongoDB Connected");
} catch (error) {
  console.error("❌ MongoDB Connection Error:", error.message);
}
}
export default connectDb