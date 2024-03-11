import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/AuthRoute.js"
import cloudinary from "cloudinary"
import serviceRouter from "./routes/ServiceRouter.js"
import shopRouter from "./routes/ShopRoute.js"
import orderRoutes from "./routes/OrderRoute.js"
import serviceMessageRouter from "./routes/ServiceMessageRoute.js"
import ProductRouter from "./routes/ProductRouter.js"
import OrderProductRouter from "./routes/OrderProductRoute.js"
import productMessageRouter from "./routes/ProductMessageRouter.js"
import sondageRouter from "./routes/SondageRoute.js"
import notificationRouter from "./routes/NotificationRoute.js"
import workerRequestRouter from "./routes/WorkerRequestRouter.js"
import cityRoutes from "./routes/CityRoute.js"
import secteurRoutes from "./routes/secteurRoute.js"
import professionRoutes from "./routes/ProfessionRoute.js"

dotenv.config()
const app = express()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET

})

app.use(cors({origin:"https://oheller-front-end.vercel.app",methods:["GET","POST","DELETE","PUT","PATCH"],credentials:true}))
//app.use(cors({origin:"http://localhost:3000",methods:["GET","POST","DELETE","PUT","PATCH"],credentials:true}))
app.use(cookieParser())
app.use(express.json({limit: '50mb'}))
app.use("uploads/profiles",express.static("uploads/profiles"))
app.use("/api/",authRoutes)
app.use("/api/",notificationRouter)
app.use("/api/",serviceRouter)
app.use("/api/",shopRouter)
app.use("/api/",ProductRouter)
app.use("/api/orders-service/",orderRoutes)
app.use("/api/",serviceMessageRouter)
app.use("/api/",OrderProductRouter)
app.use("/api/",productMessageRouter)
app.use("/api/",sondageRouter)
app.use("/api/",notificationRouter)
app.use("/api/",workerRequestRouter)
app.use("/api/",cityRoutes)
app.use("/api/",secteurRoutes)
app.use("/api/",professionRoutes)

const port = process.env.PORT
app.listen(
    port,()=>{
        console.log(`Server is running on ${port}`)
    }
)
