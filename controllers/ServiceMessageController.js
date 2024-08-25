import {PrismaClient} from "@prisma/client"
export const addMessage = async (req,res,next) => {
    try{
        const prisma = new PrismaClient()
        if(req.body.recipentId&&req.body.message&&req.params.orderId){
            const message = await prisma.serviceMessage.create({
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

export const getMessages = async (req,res,next) => {
    try{
        if(req.params.orderId && req.userId)
        {
            const prisma = new PrismaClient()
            const messages = await prisma.serviceMessage.findMany(
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
          await prisma.serviceMessage.updateMany(
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
          const order = await prisma.order.findUnique(
            {
                where:{
                    id:parseInt(req.params.orderId)
                },
                include:{
                    service:true
                }
            }
          )
         
          let recipentId;
          if(order.buyerId === req.userId)
          {
              recipentId = order.service.userId      
          }
          else if(order.service.userId === req.userId)
          {
            recipentId = order.buyerId
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

export const getAllServicesMessages = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const servicesMessages = await prisma.serviceMessage.groupBy(
            {
                by:['orderId'],
                _count:{
                    id:true
                },
                
                where:{
                    // order:{shop:{userId:req.userId}}
                    order:{service:{userId:req.userId}}
                },
                orderBy:{
                 orderId:"desc"   
                }
            }
        
        )
        let data 
        for(let i = 0;i<servicesMessages.length;i++)
        {
               data = await prisma.order.findUnique({
                where:{
                    id:servicesMessages[i].orderId
                },
                include:{
                    service:true,
                    buyer:true,
                }
               })      
               servicesMessages[i].service = data.service.title
               servicesMessages[i].customer = data.buyer.fullname  
               servicesMessages[i].id = i+1       
        }
        return res.status(200).json({servicesMessages})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send("internal server error")
    }
}
