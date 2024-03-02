import {Router} from "express"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { addProduct, addProductReview, deleteProductById, editProduct, getAllLiked, getAllReviewProductsController, getAllUserProducts, getProductById, getProductsByShopId, isLiked, likeOrDislikeProduct } from "../controllers/ProductController.js"
const ProductRouter = Router()
ProductRouter.post("/products/add",verifyToken,addProduct)
ProductRouter.get("/products",verifyToken,getAllUserProducts)
ProductRouter.get("/products/shop/:shopId",verifyToken,getProductsByShopId)
ProductRouter.get("/products/:productId",getProductById)
ProductRouter.post("/prodcuts/:productId",verifyToken,deleteProductById)
ProductRouter.put("/products/:productId",verifyToken,editProduct)
ProductRouter.post("/products-reviews/:productId",verifyToken,addProductReview)
ProductRouter.get("/get-all-products-reviews/:productId",getAllReviewProductsController)
ProductRouter.get("/products/liked/:productId",verifyToken,likeOrDislikeProduct)
ProductRouter.get("/products/isLiked/:productId",verifyToken,isLiked)
ProductRouter.get("/liked",verifyToken, getAllLiked)
export default  ProductRouter