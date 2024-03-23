import { PrismaClient } from "@prisma/client"
import { sendEmail } from "../utils/sendMail.js"

export const addSondage = async (req,res) => {
    try{
        const {sondage,questions,users} = req.body
        const prisma = new PrismaClient()
        const Sondage = await prisma.sondage.create({
            data:{
                title:sondage.title,
                days:sondage.days,
                numQuest:sondage.numQuest,
                ageMax:sondage.ageMax,
                ageMin:parseInt(sondage.ageMin),
                city:sondage.city,
                participants:parseInt(sondage.participants),
                profession:sondage.profession,
                region:sondage.region,
                secteur:sondage.secteur,
                sexe:sondage.sexe,
                title:sondage.title,
                dateInit:new Date().getTime(),
                dateExpire: new Date().getTime()*sondage.days,
                customer:{connect:{id:req.userId}},            
            }
        })
        for(let i = 0;i<questions.length;i++)
        {
            await prisma.sondageQuestions.create({
                data:{
                    sondage:{connect:{id:Sondage.id}},
                    type:questions[i].type,
                    label:questions[i].label,
                    tags:questions[i].tags

                }
            })
        }
        for(let i = 0;i<users.length;i++)
        {
            await prisma.sondageUsers.create(
                {
                    data:{
                        sondage:{connect:{id:Sondage.id}},
                        user:{connect:{id:users[i].id}}
                    }
                }
            )
        }
        const user = await prisma.user.findUnique({
            where:{
                id:req.userId
            }
        })
        await sendEmail(user.email,"Lancement du sondage "+sondage.title,"Après une profonde analyse nous vous commnuniquerons le cout pour le lancement de votre sondage\n\nCordialement l'équipe O Heller")
        return res.status(201).send("Sondage créé")

    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}
export const getAllSondages = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const sondages = await prisma.sondage.findMany({
            include:{
                questions:true,
                answers:true,
                users:{
                    where:{
                        isAgree:true
                    }
                },

            },
            orderBy:{
                id:"desc"
            },
             where:{
                userId:req.userId
            }
        })
        for(let i = 0;i<sondages.length;i++)
        {
            sondages[i].dateInit = sondages[i].dateInit.toString()
            sondages[i].dateExpire = sondages[i].dateExpire.toString()
            sondages[i].dateInit = sondages[i].dateInit.toString()
            sondages[i].dateInit = sondages[i].dateInit.toString()

        }
        
        return res.status(200).json({sondages})

    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}
export const deleteSondageById = async (req,res,next) =>{
    try{
    
        const prisma = new PrismaClient()
        await prisma.sondageQuestions.deleteMany({
            where:{
                sondageId:parseInt(req.params.sondageId)
            }
        })
        await prisma.sondageAnswers.deleteMany({
            where:{
                sondageId:parseInt(req.params.sondageId)
            }
        })
        await prisma.sondageUsers.deleteMany({
            where:{
                sondageId:parseInt(req.params.sondageId)
            }
        })
        
        const a = await prisma.sondage.delete(
            {
                where:{
                    id:parseInt(req.params.sondageId)
                }
            }
        ) 

      

        return res.status(200).send("Deleted")
    }
    catch(err)
    {
        console.log(err)
       return res.status(500).json("Internal server error")
    }
}
export const getSondageById = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const sondage = await prisma.sondage.findUnique(
            {
                where:{
                    id:parseInt(req.params.sondageId)
                }
            }
        )
        sondage.dateExpire = sondage.dateExpire.toString()
        sondage.dateInit = sondage.dateInit.toString()
        const questions = await prisma.sondageQuestions.findMany({
            where:{
                sondageId:parseInt(req.params.sondageId)
            }
        })
        return res.status(200).json({sondage,questions})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json(err)
    }
}
export const updateSondageById = async (req,res) => {
    try{
        const {sondage,questions} = req.body
        const prisma = new PrismaClient()
        await prisma.sondageQuestions.deleteMany(
            {
                where:{
                    sondageId:parseInt(req.params.sondageId)
                }
            }
        )
        await prisma.sondage.update(
            {
                where:{
                    id:parseInt(req.params.sondageId)
                },
                data:{
                    title:sondage.title,
                    days:sondage.days,
                    numQuest:sondage.numQuest,
                    ageMax:parseInt(sondage.ageMax),
                    ageMin:parseInt(sondage.ageMin),
                    city:sondage.city,
                    participants:parseInt(sondage.participants),
                    profession:sondage.profession,
                    region:sondage.region,
                    secteur:sondage.secteur,
                    sexe:sondage.sexe,
                    title:sondage.title,
                    dateInit:new Date().getTime(),
                    dateExpire: new Date().getTime()*sondage.days,
                }
            }
        )
        for(let i = 0;i<questions.length;i++)
        {
            await prisma.sondageQuestions.create({
                data:{
                    sondage:{connect:{id:parseInt(req.params.sondageId)}},
                    type:questions[i].type,
                    label:questions[i].label,
                    tags:questions[i].tags

                }
            })
        }

        return res.status(201).send("Updated")
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send("Internal server error")
    }
}
export const getAllAdminSondages = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const sondages = await prisma.sondage.findMany({
            orderBy:{
                id:"desc"
            },
            include:{
                questions:true,
                answers:true,
                customer:true,
                users:{
                    where:{
                        isAgree:true
                    }
                },

            }
        })
        for(let i = 0;i<sondages.length;i++)
        {
            sondages[i].dateInit = sondages[i].dateInit.toString()
            sondages[i].dateExpire = sondages[i].dateExpire.toString()
            sondages[i].dateInit = sondages[i].dateInit.toString()
            sondages[i].dateInit = sondages[i].dateInit.toString()
        }
        return res.status(200).json({sondages})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server errror")
    }
}
export const updateSondageByAdmin = async (req,res) =>{
    try{
        const {montant,participation} = req.body
        const prisma = new PrismaClient()
        const data = await prisma.sondage.findUnique({
            where:{
                id:parseInt(req.params.sondageId)
            },
            include:{
                customer:true
            }
        })

        await prisma.sondage.update({
            where:{
                id:parseInt(req.params.sondageId)
            },
            data:{
                participation:parseInt(participation),
                montant:parseInt(montant),
                status:"En attente de paiement",
            }
        })
        
        await sendEmail(data.customer.email,"A propos de votre sondage "+data.title,"Après une profonde analyse nous estimons que le cout pour votre sondage s'élève à "+montant+" Fcfa veillez vous rendre dans le tableau board pour payer les frais afin de lancer le sondage")
        await prisma.notification.create(
            {
                data:{
                    title:"A propos de votre sondage ",
                    message:"Après une profonde analyse nous estimons que le cout pour votre sondage s'élève à "+montant+" Fcfa veillez vous rendre dans le tableau board pour payer les frais afin de lancer le sondage",
                    user:{connect:{id:data.customer.id}}
                }
            }
        )

        return res.status(201).send("Updated")
    }
    catch(err)
    {
        console.log(err)
        return res.status(200).send("Internal server error")
    }    
}
export const proceedeToSondagePaiement = async (req,res) =>{
    try{
        const prisma = new PrismaClient()
        const data = await prisma.sondage.findUnique({
            where:{
                id:parseInt(req.params.sondageId)
            },
            include:{
                customer:true
            }
        })
        await prisma.sondage.update({
            where:{
                id:parseInt(req.params.sondageId)
            },
            data:{
                status:"En cours",
                dateInit:new Date().getTime(),
                dateExpire: new Date().getTime()+24*60*60*data.days*1000, 
                 
            }
        })
        const users = await prisma.sondageUsers.findMany({
            where:{
                sondageId:parseInt(req.params.sondageId)
            },
            include:{
                user:true
            }
        })
        for(let i = 0;i<users.length;i++)
        {
            await sendEmail(users[0].user.email,"Participation à un sondage "+data.title,"Vous avez la possibilité de participer à un sondage afin de gagner une somme s'élévant à "+data.participation+" Fcfa veillez vous rendre sur la plateforme O Heller")
            await prisma.notification.create(
                {
                    data:{
                        title:"Participation à un sondage",
                        message:"Vous avez la possibilité de participer à un sondage afin de gagner une somme s'élévant à "+data.participation+" Fcfa veillez vous rendre vers l'onglet sondage",
                        user:{connect:{id:users[0].user.id}}
                    }
                }
            )
        }
        await prisma.sondageUsers.updateMany(
            {
                where:{
                    sondageId:parseInt(req.params.sondageId)
                },
                data:{
                    isAvailable:true
                }
            }
        )
        return res.status(201).send("updated")
        
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}
export const participeSondage = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const sondages = await prisma.sondageUsers.findMany({
            where:{
                userId:req.userId
            },
            include:{
                sondage:true     
            },
            orderBy:{
                id:"desc"
            }
        })
        for(let i = 0;i<sondages.length;i++)
        {
            sondages[i].sondage.dateInit = sondages[i].sondage.dateInit.toString()
            sondages[i].sondage.dateExpire = sondages[i].sondage.dateExpire.toString()

        }

        return res.status(200).json({sondages})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}
export const saveAnswer = async (req,res) => {
    try{
        const {questions,sondageId,sondageUserId} = req.body
        const prisma = new PrismaClient()
        const sondage = await prisma.sondage.findUnique({
            where:{
                id:parseInt(sondageId)
            },
        })
        const alreadyPlay = await prisma.sondageUsers.findMany({
            where:{
                isAgree:true,
                sondageId:sondageId
            }
        })
        if(alreadyPlay.length === sondage.participants)
        {
            return res.status(400).send("")
        }
        for(let i = 0;i<questions.length;i++)
        {
            await prisma.sondageAnswers.create({
                data:{
                    answer:questions[i].answer,
                    question:{connect:{id:questions[id]}},
                    sondage:{connect:{id:parseInt(sondageId)}},
                    sondageUser:{coonnect:{id:parseInt(sondageUserId)}}
                }
            })
            
        }
        await prisma.sondageUsers.update({
            where:{
                id:parseInt(sondageUserId)
            },
            data:{
                isAgree:true
            }
        })
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}
export const addAnswer = async (req,res) =>{
    try{
        const prisma = new PrismaClient()
        const {data,sondageId} = req.body
        const sondageUser = await prisma.sondageUsers.findFirst({
            where:{
                userId:req.userId,
                sondageId:parseInt(sondageId)
            }
        })
        for(let i = 0;i<data.length;i++){
            await prisma.sondageAnswers.create({
                data:{
                    user:{connect:{id:req.userId}},
                    answer:data[i].answer,
                    sondage:{connect:{id:parseInt(sondageId)}},
                    question:{connect:{id:parseInt(parseInt(data[i].id))}},
                    sondageUser:{connect:{id:sondageUser.id}}
                }
            })
        }
        await prisma.sondageUsers.updateMany({
            where:{
                userId:req.userId,
                sondageId:parseInt(sondageId)
            },
            data:{
                isAgree:true
            }
        })
        const allSondageUsers = await prisma.sondageUsers.findMany({
            where:{
                sondageId:parseInt(sondageId),
                isAgree:true
            }
        })
        const sondage = await prisma.sondage.findUnique({
            where:{
                id:parseInt(sondageId)
            }
        })
        if(sondage.participants === allSondageUsers.length){
            await prisma.sondage.update({
                where:{
                    id:parseInt(sondageId)
                },
                data:{
                    status:"Terminé"
                }
            })
        }
        return res.status(201).send("created")
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).send("Interval server error")
    }
}
export const getSondageAnswer = async (req,res)=>{
    try{
        const prisma = new PrismaClient()
        if(!req.params.sondageId)
        {
            return res.status(404).send("we need sondageId")
        }
        const answers = await prisma.sondageAnswers.findMany({
            where:{
                sondageId:parseInt(req.params.sondageId)
            },
            include:{
                user:true,
                
            }
        })
        const questions = await prisma.sondageQuestions.findMany({
            where:{
                sondageId:parseInt(req.params.sondageId)
            }
        })
 

          

        
        return res.status(201).json({answers,questions})  
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).send("Internal server error")
    }
}
