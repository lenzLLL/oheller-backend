import {Router} from "express"
import {verifyToken} from "../middlewares/AuthMiddleware.js"
import {getMessages,addMessage, getAllServicesMessages} from "../controllers/ServiceMessageController.js"

const serviceMessageRouter = Router()

serviceMessageRouter.post("/add-service-message/:orderId",verifyToken,addMessage)
serviceMessageRouter.get("/get-service-message/:orderId",verifyToken,getMessages)
serviceMessageRouter.get("/get-all-services-messages",verifyToken,getAllServicesMessages)

export default serviceMessageRouter