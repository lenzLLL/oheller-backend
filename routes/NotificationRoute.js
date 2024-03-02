import {Router} from "express"
import {verifyToken} from "../middlewares/AuthMiddleware.js"
import { NotificationsSetAllReaded, getNoticiation } from "../controllers/NotificationController.js"

const notificationRouter = Router()

notificationRouter.get("/get-notifications",verifyToken,getNoticiation)
notificationRouter.put("/set-all-readed-notifications",verifyToken,NotificationsSetAllReaded)

export default notificationRouter