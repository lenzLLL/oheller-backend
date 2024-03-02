import express from "express"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { addOrder, editOrder, getBuyerOrders, getOrderById, getSellerOrders, userHasOrder } from "../controllers/OrderController.js"

const orderRoutes = express.Router()
orderRoutes.post("/create",verifyToken,addOrder)
orderRoutes.get("/buyer-orders",verifyToken,getBuyerOrders)
orderRoutes.get("/seller-orders",verifyToken,getSellerOrders)
orderRoutes.post("/seller-has-order",userHasOrder)
orderRoutes.get('/get-order/:orderId',getOrderById)
orderRoutes.put("/edit-order-service/:orderId",editOrder)

export default orderRoutes