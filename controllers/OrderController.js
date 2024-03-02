import { PrismaClient } from "@prisma/client";

export const addOrder = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        if(req.body.serviceId)
        {
            const service = await prisma.service.findUnique(
                {
                    where:{id:parseInt(req.body.serviceId)}
                }
            )
            await prisma.order.create({
                data:{
                    description:req.body.description,
                    date:parseInt(req.body.date),
                    price:parseInt(req.body.price),
                    buyer:{connect:{id:req.userId}},
                    service:{connect:{id:service.id}}
                }
            })
            return res.status(201).send("Commande enregistré avec success")
        }
        return res.status(400).send("l'ID du service est requis")

    }
    catch(err){
        console.log(err)
        return res.status(500).send(err)
        
    }
}

export const  getBuyerOrders = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const orders = await prisma.order.findMany({
            where:{buyerId:parseInt(req.userId) },
            include:{service:true}
        })
        for(let i = 0;i<orders.length;i++)
        {
           orders[i].price = orders[i].price.toString()
           orders[i].service.price = orders[i].service.price.toString()
           orders[i].date = orders[i].date.toString()
        }
        
        return res.status(200).json({orders}) 
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("internal server error")
    }
}

export const getSellerOrders = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const orders =  await prisma.order.findMany({
            where:{
                service:{
                    createdBy:{
                        id:parseInt(req.userId)
                    }
                }
            },
            include:{
                service:true,
                buyer:true
            }
        })
        for(let i = 0;i<orders.length;i++)
        {
            orders[i].price = orders[i].price.toString()
            orders[i].service.price = orders[i].service.price.toString()
            orders[i].date = orders[i].date.toString()
        }
        return res.status(200).json({orders})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}

export const userHasOrder = async (req,res,next) =>{
    try{
        const prisma = new PrismaClient()
        const data = prisma.order.findFirst({
            where:{
                buyerId:parseInt(req.body.userId),
                serviceId:parseInt(req.body.serviceId)
            }
        })
        if(data)
        {
            return res.status(200).send("")
        }
        return res.status(401).send("no data")
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}

export const getOrderById = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const order = await prisma.order.findUnique(
            {
                where:{
                    id:parseInt(req.params.orderId)
                },
                include:{
                    service:true,
                    buyer:true
                }
            }
        )
        order.price = order.price.toString()
        order.service.price = order.service.price.toString()
        order.date = order.date.toString()
        return res.status(200).json({order})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}
export const editOrderProduct = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const order = await prisma.productOrder.update(
            {
                where:{
                    id:parseInt(req.params.orderId)
                },
                data:{
                    status:"Livré"
                }
            }
        )
        return res.status(201).send("Commande livré")
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send("Internal server error")
    }
}

export const editOrder = async (req,res) => {
    try{
        console.log("cool")
        const {status} = req.body
        const prisma = new PrismaClient()
        const order = await prisma.order.update(
            {
                where:{
                    id:parseInt(req.params.orderId)
                },
                data:{
                    status:status
                }
            }
        )
        return res.status(201).send("Commande livré")
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}
