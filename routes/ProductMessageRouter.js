import {Router} from "express"
import {verifyToken} from "../middlewares/AuthMiddleware.js"
import { addProductMessage, getAllProductMessages, getProductMessages } from "../controllers/ProductMessageController.js"

const productMessageRouter = Router()

productMessageRouter.post("/add-product-message/:orderId",verifyToken,addProductMessage)
productMessageRouter.get("/get-product-message/:orderId",verifyToken,getProductMessages)
productMessageRouter.get("/get-all-product-message",verifyToken,getAllProductMessages)

export default productMessageRouter