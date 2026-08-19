import express from "express"
import dotenv from "dotenv"
import connectDb from "./utils/connectDb.js"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config()
import dns from "dns";
import notesRouter from "./routes/generate.route.js"

dns.setServers([
  "1.1.1.1",
  "8.8.8.8"
]);

const app = express()

app.use(cors({
    origin: "https://notes-generator-phi.vercel.app/auth",
    http: "localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 5000

app.get("/",(req,res)=>{
    res.json({message: "Exam notes backend running"})
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/notes",notesRouter)

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
    connectDb()
})