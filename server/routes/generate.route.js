import express from "express"
import { generateNotes } from "../controllers/generate.controller.js"
import { getHistory, deleteHistory, updateHistory } from "../controllers/history.controller.js"
import isAuth from "../middleware/isAuth.js"


const notesRouter = express.Router()

notesRouter.post("/generate-notes",isAuth,generateNotes)
notesRouter.get("/history",isAuth,getHistory)
notesRouter.put("/history/:id",isAuth,updateHistory)
notesRouter.delete("/history/:id",isAuth,deleteHistory)

export default notesRouter