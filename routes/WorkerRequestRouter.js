import {Router} from "express"
import {verifyToken} from "../middlewares/AuthMiddleware.js"
import { getAllWorkRequest, getAllWorkerRequest, sendRequestWorker } from "../controllers/WorkerRequestController.js"

const workerRequestRouter = Router()

workerRequestRouter.post("/send-work-request",verifyToken,sendRequestWorker)
workerRequestRouter.get("/get-all-work-request-user",verifyToken,getAllWorkRequest)
workerRequestRouter.get("/get-all-work-request-worker",verifyToken,getAllWorkerRequest)

export default workerRequestRouter