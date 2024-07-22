import { PrismaClient } from "@prisma/client"
import cloudinary from "cloudinary"

export const addService = async (req,res,next) => {
    try{

            const {        
            title,
            category,
            description,
            time,
            price
            } = req.query
        const {
            images,features
        } = req.body
        let keys = []
        let pictures = []
        console.log(req.body)
        if(images?.length > 0)
        {
            for(let i = 0;i<images.length;i++)
            {
                const result = await cloudinary.v2.uploader.upload(images[i],{
                    folder:"services"
                })
                pictures.push(result.secure_url)
                keys.push(result.public_id)
            }
        }
        const prisma = new PrismaClient()
        await prisma.service.create(
            {
            data:{    category,
                description,
                time:parseInt(time),
                price:parseInt(price),
                title,
                keys,
                images:pictures,
                features,
                createdBy:{connect:{id:req.userId}
            }
        }
            }
        )
        res.status(201).json({msg:"Service crée avec success"})
    }
    catch(error)
    {   
        console.log(error)
        res.status(500).send("internal server error")
    }
}


export const getAllUserServices = async (req,res,next) => {
    try{
        const prisma = new PrismaClient()
        const user = await prisma.user.findUnique({
            where:{
                id:req.userId
            },
            include:{
                services:true
            }
        })
        res.status(200).json({services:user?.services})  
           
    }
    catch(error)
    {   
        console.log(error)
        res.status(500).send("internal server error")
    }
}

export const getServiceById = async (req,res,next) => {
    try{
        if(req.params.serviceId)
        {

            const prisma = new PrismaClient()
            const service = await prisma.service.findUnique(
                {
                    where:{id:parseInt(req.params.serviceId)},include:{createdBy:true,reviews:{include:{buyer:true}}}
                }
            )

            
            res.status(200).json({service})
        }
        else{
            res.status(400).json({mag:"l'identifiant du service est réqui"})
        }
           
    }
    catch(error)
    {   
        console.log(error)
        res.status(500).send("internal server error")
    }
}

export const editService = async (req,res) => {
    try{

        const {
            newImages,newFeatures,            title,
            category,
            description,
            time,
            price
        } = req.body
        const prisma = new PrismaClient()
        const oldService = await prisma.service.findUnique(
            {
                where:{
                    id:parseInt(req.params.serviceId)
                }
            }
        )
        let keys = []
        let pictures = []
        if(newImages?.length > 0)
        {
            console.log("okey")
            for(let i = 0;i<newImages.length;i++)
            {
                const result = await cloudinary.v2.uploader.upload(newImages[i],{
                    folder:"services"
                })
                pictures.push(result.secure_url)
                keys.push(result.public_id)
            }
            for(let i = 0;i<oldService.keys.length;i++)
            {
                await cloudinary.v2.uploader.destroy(oldService.keys[i]); 

            }
        }
        const data = {category,
            description,
            time:parseInt(time),
            price:parseInt(price),
            title,
            features:newFeatures,}
        if(newImages?.length > 0)
        {
            data.images = pictures
            data.keys =  keys
        }
        console.log(data)
        await prisma.service.update(
            {
            where:{
                id:parseInt(req.params.serviceId)
            },    
            data:{ 
                ...data,   
                createdBy:{connect:{id:req.userId}
            }
            }
            }
        )
        res.status(201).json({msg:"Service modifié avec success"})    
    }
    catch(err)
    {
        res.status(500).send("Internal server error")
    }
}
const createSearchQuery = (searchTerm,category) => {
    const query = {
        where:{
            OR:[]
        }
        ,include:{
            createdBy:true 
            ,reviews:{include:{buyer:true}}

        }
    }
    if(searchTerm)
    {
        query.where.OR.push({
            title:{contains:searchTerm,mode:"insensitive"}
        })
    }
    else if(category)
    {
        query.where.OR.push({
            title:{contains:category,mode:"insensitive"}
        })   
    } 
    return query
}
export const searchServiceByTerm = async (req,res,next) => {
    try{
        console.log("cool")
        if(req.query.searchTerm||req.query.category)
        {
            const prisma = new PrismaClient()
            const services = await prisma.service.findMany(
                createSearchQuery(req.query.searchTerm.toString(),req.query.category.toString())
            )
             const shops  = await prisma.shop.findMany(
                {where:{
                    OR:[
                        {
                            name:{contains:req.query.searchTerm,mode:"insensitive"}
                        },
                        {
                            secteur:{contains:req.query.searchTerm,mode:"insensitive"}
                        }
                    ]
                },
                include:{
                    createdBy:true,
                    reviews:true,
                    products:{include:{reviews:true}}
    
                }
                }       
            )
            for(let j = 0;j<shops.length;j++)
            {
            for(let i = 0;i<shops[j].products.length;i++)
                {
                    shops[j].products[i].price = parseInt(shops[j].products[i].price)
                }
            }
            const products  = await prisma.product.findMany(
                {where:{
                    OR:[
                        {
                            title:{contains:req.query.searchTerm,mode:"insensitive"}
                        },
                        {
                            category:{contains:req.query.searchTerm,mode:"insensitive"}
                        }
                    ]
                },
                include:{
                    createdBy:true
                }
                }       
            )
            let p = []
            for(let j = 0;j<products.length;j++)
                {
                    p.push(products[j])
                    p[p.length-1].price = p[p.length-1].price.toString()
                }
            return res.status(200).json({services,shops,products:p})
        }
       



        
        return res.status(400).send("l'identifiant du service est requi")
    
    }
    catch(err)
    {
        res.status(500).send("Internal server error")
        console.log(err)
    }
}

export const getAllServices = async (req,res,next) =>{
    try{
        const prisma = new PrismaClient()
        const services =await prisma.service.findMany({
            include:{createdBy:true,reviews:{include:{buyer:true}},orders:true}
        })
        for(let i = 0;i<services.length;i++){
            services[i].price = services[i].price.toString()
            for(let j=0;j<services[i].orders.length;j++){
                services[i].orders[j].price = services[i].orders[j].price.toString()
                services[i].orders[j].date = services[i].orders[j].date.toString()

            }
        }
        return res.status(200).json({services})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send("Internal server error")
    }
} 

export const addReview = async (req,res) => {
    try{
        if(req.params.serviceId && req.userId)
        {
            const prisma = new PrismaClient()
            const data = await prisma.review.create({
                data:{
                    rating:req.body.rating,
                    text:req.body.text,
                    buyer:{connect:{id:parseInt(req.userId)}},
                    service:{connect:{id:parseInt(req.params.serviceId)}}
                },
                include:{
                    buyer:true
                }
            })
            return res.status(201).json({data})
        }
        else{
            return res.status(400).json({data})
        }    
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}

export const deleteServiceById = async (req,res,next) =>{
    try{
        const {keys} = req.body
        const prisma = new PrismaClient()
        const a = await prisma.service.delete(
            {
                where:{
                    id:parseInt(req.params.serviceId)
                }
            }
        ) 
        if(keys.length>0)
        {

            for(let i = 0;i<keys.length;i++)
            {
                await cloudinary.v2.uploader.destroy(keys[i]); 
                console.log("cool")
            }
        }
    

        return res.status(200).send("Deleted")
    }
    catch(err)
    {
        console.log(err)
       return res.status(500).json("Internal server error")
    }
}
