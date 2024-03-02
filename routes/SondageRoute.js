import {Router} from "express"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { addAnswer, addSondage, deleteSondageById, getAllAdminSondages, getAllSondages, getSondageAnswer, getSondageById, participeSondage, proceedeToSondagePaiement, saveAnswer, updateSondageByAdmin, updateSondageById } from "../controllers/SondageController.js";
const sondageRouter = Router()
sondageRouter.post("/sondage/add",verifyToken,addSondage)
sondageRouter.get("/sondages",verifyToken,getAllSondages)
sondageRouter.delete("/sondages/delete/:sondageId",verifyToken,deleteSondageById)
sondageRouter.get("/sondages/:sondageId",verifyToken,getSondageById)
sondageRouter.put("/sondages/update/:sondageId",verifyToken,updateSondageById)
sondageRouter.get("/get-all-admin-sondage",verifyToken,getAllAdminSondages)
sondageRouter.put("/sondages/admin/update/:sondageId",verifyToken,updateSondageByAdmin)
sondageRouter.put("/sondages/payment/:sondageId",verifyToken,proceedeToSondagePaiement)
sondageRouter.get("/participe-sondage/",verifyToken,participeSondage)
sondageRouter.post("/answer-questions",verifyToken,saveAnswer)
sondageRouter.post("/add-answer",verifyToken,addAnswer)
sondageRouter.post("/get-sondage-answers/:sondageId",verifyToken,getSondageAnswer)
sondageRouter.get("/get-answers/:sondageId",verifyToken,getSondageAnswer)
export default sondageRouter