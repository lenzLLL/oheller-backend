import { PrismaClient } from "@prisma/client"

export const getNoticiation = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const notifications = await prisma.notification.findMany({
            where:{
                userId:req.userId
            },
            orderBy:{
                id:"desc"
            }
        })
        console.log(notifications)
        return res.status(200).json({notifications})

    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}

export const NotificationsSetAllReaded = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        await prisma.notification.updateMany(
            {
                where:{
                    userId:req.userId
                },
                data:{
                    isReaded:true
                }
            }
        )
        return res.status(201).send("All is readed")
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}