import { PrismaClient } from "@prisma/client";

export const addOrderProduct = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const {  
            size,
            price,
            quantite,
            title,
            date,
            total,
            shopId,
            id } = req.body
     
    
            await prisma.productOrder.create({
                data:{
                    customer:{connect:{id:req.userId}},
                    size,
                    price:parseInt(price),
                    totalPrice:total,
                    quantity:quantite,
                    date:parseInt(date),
                    product:{connect:{id:id}},
                    shop:{connect:{id:shopId}}
                     

                }
            })
            return res.status(201).send("Commande enregistré avec success")


    }
    catch(err){
        console.log(err)
        return res.status(500).send(err)
        
    }
}
export const getAllSellerOrders = async (req,res) => {
    try{
        const prisma = new PrismaClient
        const orders = await prisma.productOrder.findMany(
            {
                where:{
                    shop:{userId:req.userId}
                },
                include:{product:true,customer:true,shop:true},
                orderBy:{
                    id:"desc"
                }
            }
        )
        for(let i = 0;i<orders.length;i++)
        {
            orders[i].price = orders[i].price.toString()
            orders[i].totalPrice = orders[i].totalPrice.toString()
            orders[i].product.price = orders[i].product.price.toString()
            orders[i].quantity = orders[i].quantity.toString()
            orders[i].date = orders[i].date.toString()
        }
        console.log(orders)
        return res.status(200).json({orders}) 
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}
export const getBuyerOrder = async (req,res)=>{
    try{
        const prisma = new PrismaClient()
        const orders = await prisma.productOrder.findMany(
            {
                where:{
                    customerId:req.userId
                },
                include:{product:true,customer:true,shop:true},
                orderBy:{
                    id:"desc"
                }
            }
        )
        for(let i = 0;i<orders.length;i++)
        {
            orders[i].price = orders[i].price.toString()
            orders[i].totalPrice = orders[i].totalPrice.toString()
            orders[i].product.price = orders[i].product.price.toString()
            orders[i].quantity = orders[i].quantity.toString()
            orders[i].date = orders[i].date.toString()
        }
        console.log(orders)
        return res.status(200).json({orders})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send("Internal server error")
    }
}
export const getOrderProductById = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const order = await prisma.productOrder.findUnique(
            {
                where:{
                    id:parseInt(req.params.orderId)
                },
                include:{
                    product:true,
                    shop:true,
                    customer:true
                }
            }
        )
        order.price = order.price.toString()
        order.totalPrice = order.totalPrice.toString()
        order.product.price = order.product.price.toString()
        order.quantity = order.quantity.toString()
        order.date = order.date.toString()
        order.product.price = order.product.price.toString()
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