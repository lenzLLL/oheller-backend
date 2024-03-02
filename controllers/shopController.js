import { PrismaClient } from "@prisma/client"
import cloudinary from "cloudinary"

export const addShop = async (req,res,next) => {
    try{
    
          const {
            images,
            features,
            numbers,
            name,
            type,
            region,
            city,
            quarter,
            description,
            secteur,
            disponibilite,
            cover
        } = req.body

        let keys = []
        let keyCover = []
        let pictures = []
        if(images?.length > 0)
        {
            for(let i = 0;i<images.length;i++)
            {
                const result = await cloudinary.v2.uploader.upload(images[i],{
                    folder:"shops"
                })
                pictures.push(result.secure_url)
                keys.push(result.public_id)
            }
        }
        const result = await cloudinary.v2.uploader.upload(cover,{
            folder:"shops"
        })
        let COVER = result.secure_url
        keyCover = result.public_id

        const prisma = new PrismaClient()
        await prisma.shop.create(
            {
            data:{   
                name,
                type,
                region,
                city,
                quarter,
                description,
        
                secteur,
                disponibilite,
                cover:COVER,
                numbers,
                features,
                images:pictures,
                keys,
                keyCover,
                createdBy:{connect:{id:req.userId}
            }
        }
            }
        )
        res.status(201).json({msg:"Boutique crée avec success"})
    }
    catch(error)
    {   
        console.log(error)
        res.status(500).send("internal server error")
    }
}

export const getAllShopUser = async (req,res,next) => {
    try{
        const prisma = new PrismaClient()
        const user = await prisma.user.findUnique({
            where:{
                id:req.userId
            },
            include:{
                shops:true
            }
        })
        res.status(200).json({shops:user?.shops})  
           
    }
    catch(error)
    {   
        console.log(error)
        res.status(500).send("internal server error")
    }
}

export const getShopById = async (req,res,next) => {
    try{
        if(req.params.shopId)
        {

            const prisma = new PrismaClient()
            const shop = await prisma.shop.findUnique(
                {
                    where:{id:parseInt(req.params.shopId)},
                    include:{products:{include:{reviews:true}},createdBy:true,orders:true}
                }
            )
            for(let i = 0;i<shop.products.length;i++)
            {
                shop.products[i].price = parseInt(shop.products[i].price)
            }
            for(let j= 0;j<shop.orders.length;j++)
            {
                shop.orders[j].price = shop.orders[j].price.toString()
                shop.orders[j].totalPrice = shop.orders[j].totalPrice.toString()
                shop.orders[j].date = shop.orders[j].date.toString()
                shop.orders[j].quantity = shop.orders[j].quantity.toString()

                
            }
            console.log(shop)
        
            res.status(200).json({shop})
        }
        else{
            res.status(400).json({mag:"l'identifiant du service est réquis"})
        }
           
    }
    catch(error)
    {   
        console.log(error)
        res.status(500).send("internal server error")
    }
}

export const editShop = async (req,res) => {
    try{

        const {
            newImages,
            features,
            numbers,
            name,
            type,
            region,
            city,
            quarter,
            description,
            secteur,
            disponibilite,
            newCover
        } = req.body
        const prisma = new PrismaClient()
        const oldShop = await prisma.shop.findUnique(
            {
                where:{
                    id:parseInt(req.params.shopId)
                }
            }
        )
        let keys = []
        let pictures = []
        let key = ""
        let picture =""
        if(newImages?.length > 0)
        {
    
            for(let i = 0;i<newImages.length;i++)
            {
                const result = await cloudinary.v2.uploader.upload(newImages[i],{
                    folder:"shops"
                })
                pictures.push(result.secure_url)
                keys.push(result.public_id)
            }
            for(let i = 0;i<oldShop.keys.length;i++)
            {
                await cloudinary.v2.uploader.destroy(oldShop.keys[i]); 

            }
        }
        if(newCover)
        {
            const result = await cloudinary.v2.uploader.upload(newCover,{
                folder:"shops"
            })
            picture = result.secure_url
            key =  result.public_id
        }
        const data = {                name,
            type,
            region,
            city,
            quarter,
            description,
            secteur,
            disponibilite,
            numbers,
            features
            }
        if(newImages?.length > 0)
        {
            data.images = pictures
            data.keys =  keys
        }
        if(newCover)
        {
            data.cover = picture
            data.keyCover = key
        }
    
        await prisma.shop.update(
            {
            where:{
                id:parseInt(req.params.shopId)
            },    
            data:{ 
                ...data,   
                createdBy:{connect:{id:req.userId}
            }
            }
            }
        )
        res.status(201).json({msg:"Boutique modifié avec success"})    
    }
    catch(err)
    {
        console.log(err)
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
            return res.status(200).json({services})
        }
        return res.status(400).send("l'identifiant du service est requi")
    
    }
    catch(err)
    {
        res.status(500).send("Internal server error")
        console.log(err)
    }
}
export const deleteShopById = async (req,res,next) =>{
    try{
        const {keys,keyCover} = req.body
        const prisma = new PrismaClient()
        const a = await prisma.shop.delete(
            {
                where:{
                    id:parseInt(req.params.id)
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
        if(keyCover)
        {
            await cloudinary.v2.uploader.destroy(keyCover); 
                
        }

        return res.status(200).send("Deleted")
    }
    catch(err)
    {
        console.log(err)
       return res.status(500).json("Internal server error")
    }
}

export const getAllShops = async (req,res,next) =>{
    try{
        const prisma = new PrismaClient()
        const shops =await prisma.shop.findMany({
            include:{
                createdBy:true  ,
                products:{include:{reviews:true}}  
            }
        })
        for(let i = 0;i<shops.length;i++)
        {
            for(let j=0;j<shops[i].products.length;j++)
            {
                shops[i].products[j].price = shops[i].products[j].price.toString()
            }
        }
        return res.status(200).json({shops})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send("Internal server error")
    }
} 