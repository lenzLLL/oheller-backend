import {PrismaClient} from "@prisma/client"
export const addProductMessage = async (req,res,next) => {
    try{
        const prisma = new PrismaClient()
        if(req.body.recipentId&&req.body.message&&req.params.orderId){
            const message = await prisma.productMessage.create({
                data:{
                    sender:{
                        connect:{id:parseInt(req.userId)}
                    },
                    recipent:{
                        connect:{id:parseInt(req.body.recipentId)}
                    },
                    order:{
                        connect:{id:parseInt(req.params.orderId)}
                    },
                    text:req.body.message,
                    date:parseInt(req.body.date)
                }
            })
            
let msg = await prisma.user.findFirst({
                where:{
                    id:parseInt(body.body.recipentId)
                }
            })
            msg = msg? msg:0
            await prisma.user.update({
                where:{
                    msg:msg+1
                }
            })
            message.date = message.date.toString()
            return res.status(201).json({message})
        }
        return res.status(400).send("Incompleted informations")
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}

export const getProductMessages = async (req,res,next) => {
    try{
        if(req.params.orderId && req.userId)
        {
            const prisma = new PrismaClient()
            const messages = await prisma.productMessage.findMany(
                {
                    where:{
                        order:{
                            id:parseInt(req.params.orderId)
                        }
                    },
                    orderBy:{
                        createdAt:"asc"
                    }
                }
            )
          await prisma.productMessage.updateMany(
            {
                where:{
                    orderId:parseInt(req.params.orderId),
                    recipentId:parseInt(req.userId)
                },
                data:{
                    isRead:true
                }
            }
          )
          const order = await prisma.productOrder.findUnique(
            {
                where:{
                    id:parseInt(req.params.orderId)
                },
                include:{
                    shop:true
                }
            }
          )
         
          let recipentId;
          if(order.customerId === req.userId)
          {
              recipentId = order.shop.userId  
          }
          else if(order.shop.userId === req.userId)
          {
            recipentId = order.customerId
          }
          for(let i = 0;i<messages.length;i++)
          {
            messages[i].date = messages[i].date.toString()
          }
           await prisma.user.update({
            where:{
                id:req.userId
            },
            data:{
                msg:0
            }
          })
          return res.status(200).json({messages,recipentId})
        }
        return res.status(400).send("Order id is required")
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}

export const getAllProductMessages = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const productsMessages = await prisma.productMessage.groupBy(
            {
                by:['orderId'],
                _count:{
                    id:true
                },
                
                where:{
                    order:{shop:{userId:req.userId}}
                },
                orderBy:{
                 orderId:"desc"   
                }
            }
        
        )
        let data 
        for(let i = 0;i<productsMessages.length;i++)
        {
               data = await prisma.productOrder.findUnique({
                where:{
                    id:productsMessages[i].orderId
                },
                include:{
                    customer:true,
                    product:true
                }
               })      
               productsMessages[i].product = data.product.title
               productsMessages[i].customer = data.customer.fullname  
               productsMessages[i].id = i+1       
        }
        console.log(productsMessages)
        return res.status(200).json({productsMessages})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send("internal server error")
    }
}
