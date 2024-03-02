import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { addOrderProduct, editOrderProduct, getAllSellerOrders, getBuyerOrder, getOrderProductById } from "../controllers/OrderProdcutController.js";

const router = express.Router()

router.post("/order-product/add",verifyToken,addOrderProduct)
router.get("/get-seller-orders",verifyToken,getAllSellerOrders)
router.get("/get-buyer-orders",verifyToken,getBuyerOrder)
router.get("/get-order-product/:orderId",verifyToken,getOrderProductById)
router.put("/edit-order-product/:orderId",verifyToken,editOrderProduct)



export default router