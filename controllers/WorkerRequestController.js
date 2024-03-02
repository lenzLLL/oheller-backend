import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../utils/sendMail.js";
export const sendRequestWorker = async (req,res)=>{
        try{
            const {workerId,workerEmail} = req.body
            const prisma = new PrismaClient()
            const isAlready = await prisma.workrequest.findFirst(
                {
                    where:{
                        userId:req.userId,
                        workerId:parseInt(workerId)
                    }
                }
            )
            if(isAlready)
            {   
                return res.status(400).send("already")
            }
            await prisma.workrequest.create({
                data:{
                    user:{connect:{id:req.userId}},
                    worker:{connect:{id:parseInt(workerId)}} 
                }
            })
            await prisma.notification.create(
                {
                    data:{
                        title:"Offre de recrutement",
                        message:"Un employeur cherche à obtenir votre cv",
                        user:{connect:{id:parseInt(workerId)}}
                    }
                }
            )
            await sendEmail(workerEmail,"Offre d'emploi\n","Un employeur cherche à obtenir votre cv, veillez vous rendre sur la plateforme pour plus d'informations\n\nCordialement O Heller team")
            return res.status(201).send("created")
        }
        catch(error)
        {
            console.log(error)
            return res.status(500).send("Internal server error")
        }
    }

    export const getAllWorkRequest = async (req,res) => {
        try{
            const prisma = new PrismaClient()
            const data = await prisma.workrequest.findMany({
                where:{
                    userId:req.userId,
                    isAgree:!true
                },
                include:{
                    worker:true,
                    user:true
                }
            })
            return res.status(200).json({data})
        }
        catch(err)
        {
            console.log(err)
            return res.status(500).send("Internal server error")
        }
    }

    export const getAllWorkerRequest = async (req,res) => {
        try{
            const prisma = new PrismaClient()
            const data = await prisma.workrequest.findMany({
                where:{
                    workerId:req.userId
                },
                include:{
                    worker:true,
                    user:true
                }
            })
            return res.status(200).json({data})
        }
        catch(err)
        {
            console.log(err)
            return res.status(500).send("Internal server error")
        }
    }