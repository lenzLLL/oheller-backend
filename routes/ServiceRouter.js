import {Router} from "express"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { addReview, addService, deleteServiceById, editService, getAllServices, getAllUserServices, getServiceById, searchServiceByTerm } from "../controllers/ServiceController.js"
const serviceRouter = Router()
serviceRouter.get("/service/:serviceId",getServiceById)
serviceRouter.put("/service/:serviceId",verifyToken,editService)
serviceRouter.post("/service/add",verifyToken,addService)
serviceRouter.get("/services-user",verifyToken,getAllUserServices)
serviceRouter.get("/search-service",searchServiceByTerm)
serviceRouter.get("/services",getAllServices)
serviceRouter.post("/add-review/:serviceId",verifyToken,addReview)
serviceRouter.post("/delete-service/:serviceId",verifyToken,deleteServiceById)
export default serviceRouter