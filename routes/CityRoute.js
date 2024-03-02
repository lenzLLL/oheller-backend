import {Router} from "express"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { addCity, getAllCity, removeCity } from "../controllers/CityController.js"
const cityRoutes = Router()

cityRoutes.post("/add-city",verifyToken,addCity)
cityRoutes.get("/get-all-cities",getAllCity)
cityRoutes.delete("/remove-city/:cityId",verifyToken,removeCity)

export default cityRoutes