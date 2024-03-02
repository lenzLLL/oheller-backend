import {Router} from "express"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { addShop, deleteShopById, editShop, getAllShopUser, getAllShops, getShopById } from "../controllers/shopController.js"
const shopRouter = Router()
shopRouter.post("/shop/add",verifyToken,addShop)
shopRouter.get("/shop/user",verifyToken,getAllShopUser)
shopRouter.get("/shops",getAllShops)
shopRouter.get("/shop/:shopId",getShopById)
shopRouter.put("/shop/:shopId",verifyToken,editShop)
shopRouter.post("/shop/:id",verifyToken,deleteShopById)
export default shopRouter