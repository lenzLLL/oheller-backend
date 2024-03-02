import {Router} from "express"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { addCity, getAllCity, removeCity } from "../controllers/CityController.js"
import { addSecteur, getAllSecteur, removeSecteur } from "../controllers/secteurController.js"
const secteurRoutes = Router()

secteurRoutes.post("/add-secteur",verifyToken,addSecteur)
secteurRoutes.get("/get-all-secteurs",getAllSecteur)
secteurRoutes.delete("/remove-secteur/:secteurId",verifyToken,removeSecteur)

export default secteurRoutes