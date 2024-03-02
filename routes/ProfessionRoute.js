import {Router} from "express"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { addProfession,removeProfession,getAllProfession } from "../controllers/profession.js"
const professionRoutes = Router()

professionRoutes.post("/add-profession",verifyToken,addProfession)
professionRoutes.get("/get-all-professions",getAllProfession)
professionRoutes.delete("/remove-profession/:professionId",verifyToken,removeProfession)

export default professionRoutes