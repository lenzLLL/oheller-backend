import {Router} from "express"
import { signup ,login, setUserCv, getAllUsers, getAllExperts, getLastLogger,activateAccount} from "../controllers/AuthRoutes.js"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { getUserInfos, setUserProfil,setUserImage} from "../controllers/AuthRoutes.js"
const authRoutes = Router()
authRoutes.post("/signup",signup)
authRoutes.get("/last-login",getLastLogger)
authRoutes.post("/login",login)
authRoutes.post("/get-user-infos",verifyToken,getUserInfos)
authRoutes.post("/set-user-profil",verifyToken,setUserProfil)
authRoutes.post("/set-user-image",verifyToken,setUserImage)
authRoutes.post("/set-user-cv",verifyToken,setUserCv)
authRoutes.get("/get-all-users",getAllUsers)
authRoutes.get("/get-all-experts",verifyToken,getAllExperts)
authRoutes.post("/activate-account",activateAccount)

export default authRoutes
