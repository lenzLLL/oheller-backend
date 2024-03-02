import { PrismaClient } from "@prisma/client"
import cloudinary from "cloudinary"
import { response } from "express"

export const addProduct = async (req,res,next) => {
    try{

            const {        
            title,
            category,
            description,
            features,
            images,
            sizes,
            price,
            shopId,
            book
            } = req.body

        let keys = []
        let pictures = []
        let BOOK = null
        if(book)
        {
            BOOK = await cloudinary.v2.uploader.upload(req.body.book, {
                folder: "books",       
        });               

        }
        if(images?.length > 0)
        {
            for(let i = 0;i<images.length;i++)
            {
                const result = await cloudinary.v2.uploader.upload(images[i],{
                    folder:"products"
                })
                pictures.push(result.secure_url)
                keys.push(result.public_id)
            }
        }
        const prisma = new PrismaClient()
        await prisma.product.create(
            {
            data:{    category,
                description,
                price:parseInt(price),
                title,
                keyBook:BOOK?.public_id? BOOK?.public_id:"",
                book:BOOK?.secure_url? BOOK?.secure_url:"",
                keys,
                size:sizes,
                images:pictures,
                features,
                createdBy:{connect:{id:shopId}
            }
        }
            }
        )
        res.status(201).json({msg:"Prouit crée avec success"})
    }
    catch(error)
    {   
        console.log(error)
        res.status(500).send("internal server error")
    }
}
export const getAllUserProducts = async (req,res,next) => {
    try{
        const prisma = new PrismaClient()
        const shops = await prisma.shop.findMany({
            where:{
                userId:req.userId
            },
            include:{
                products:{include:{createdBy:true}},    
            }
          
        })
        let products = []
        for(let i = 0;i<shops.length;i++)
        {
            for(let j = 0;j<shops[i].products.length;j++)
            {
                products.push(shops[i].products[j])
                products[products.length-1].price = products[products.length-1].price.toString()
            }
        }
        console.log(products)
        res.status(200).json({products})  
    }
    catch(error)
    {   
        console.log(error)
        res.status(500).send("internal server error")
    }
}
export const getProductsByShopId = async (req,res,next) => {
    try{
    const prisma = new PrismaClient()
    const products = await prisma.product.findMany(
        {
            where:{
                shopId:parseInt(req.params.shopId)
            }
        }
    )
    return res.status(200).json({products})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}
export const getProductById = async (req,res,next) => {
    try{
        const prisma = new PrismaClient()
        const product = await prisma.product.findUnique({
            where:{
                id:parseInt(req.params.productId)
            },include:{
            createdBy:true,
            reviews:true
            
            }
        })
        product.price = product.price.toString()
      
        return res.status(200).json({product})
    }
    catch(err)
    {
        console.log(err)
    }
}
export const deleteProductById = async (req,res,next) =>{
    try{
        const {keys,keyBook} = req.body
        const prisma = new PrismaClient()
        const a = await prisma.product.delete(
            {
                where:{
                    id:parseInt(req.params.productId)
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
        if(keyBook)
        {
            await cloudinary.v2.uploader.destroy(keyBook);  
        }
      

        return res.status(200).send("Deleted")
    }
    catch(err)
    {
        console.log(err)
       return res.status(500).json("Internal server error")
    }
}
export const editProduct = async (req,res) => {
    try{

        const {
            title,
            category,
            description,
            features,
            newImages,
            sizes,
            price,
            shopId,
            date,
            newBook
        } = req.body
        let key,book;
        const prisma = new PrismaClient()
        const oldProduct = await prisma.product.findUnique(
            {
                where:{
                    id:parseInt(req.params.productId)
                }
            }
        )

        let keys = []
        let pictures = []
        if(newImages?.length > 0)
        {
    
            for(let i = 0;i<newImages.length;i++)
            {
                const result = await cloudinary.v2.uploader.upload(newImages[i],{
                    folder:"products"
                })
                pictures.push(result.secure_url)
                keys.push(result.public_id)
            }
            for(let i = 0;i<oldProduct.keys.length;i++)
            {
                console.log("cool")
                await cloudinary.v2.uploader.destroy(oldProduct.keys[i]); 

            }
        }
        if(newBook)
        {
          book =  await cloudinary.v2.uploader.upload(newBook,{
            folder:"book"
        })  
        await cloudinary.v2.uploader.destroy(oldProduct.keyBook); 

        }
    
        const data = {               
            title,
            category,
            description,
            features,
            size:sizes,
            price:parseInt(price),
            date
            }
        if(newImages?.length > 0)
        {
            data.images = pictures
            data.keys =  keys
        }
        if(book)
        {
            
            data.keyBook = book.public_id
            data.book = book.secure_url
        }

        
    
        await prisma.product.update(
            {
            where:{
                id:parseInt(req.params.productId)
            },    
            data:{ 
                ...data,
                createdBy:{connect:{id:shopId}}
            }
            
            }
        )
        res.status(201).json({msg:"Produit modifié avec success"})    
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send("Internal server error")
    }
}
export const addProductReview = async (req,res) => {
    try{
     
            const prisma = new PrismaClient()
            const data = await prisma.reviewProduct.create({
                data:{
                    rating:req.body.rating,
                    text:req.body.text,
                    buyer:{connect:{id:parseInt(req.userId)}},
                    product:{connect:{id:parseInt(req.params.productId)}},
                    shop:{connect:{id:parseInt(req.body.shopId)}}
                },
                include:{
                    buyer:true
                }
            })
            return res.status(201).json({data})
     
         
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}
export const getAllReviewProductsController = async (req,res)=>{
    try{
        const prisma = new PrismaClient()
        const reviews = await prisma.reviewProduct.findMany({
                include:{buyer:true},
                where:{productId:parseInt(req.params.productId)}
        })
        return res.status(200).json({reviews})

    }
    catch(err)
    {
        return res.status(500).send("Internal server error")
    }
}

export const likeOrDislikeProduct = async (req,res) =>{
    try{
        const prisma = new PrismaClient()
        const isAlreadyLiked = await prisma.liked.findFirst({
            where:{
                userId:req.userId,
                productId:parseInt(req.params.productId)  
            }
        })
        if(isAlreadyLiked)
        {
            await prisma.liked.deleteMany(
                {
                    where:{
                        userId:req.userId,
                        productId:parseInt(req.params.productId)
                    }
                }
            )
            return res.status(200).send("")
        }

        else{
            await prisma.liked.create({
                data:{
                    user:{connect:{id:parseInt(req.userId)}},
                    product:{connect:{id:parseInt(req.params.productId)}}   
                }
            }) 
        return res.status(201).send("opération terminée")
            
        }
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json("Internal server error")
    }
}

export const isLiked = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const t = await prisma.liked.findFirst({
            where:{
                userId:req.userId,
                productId:parseInt(req.params.productId)
            }
        })
        if(!t)
        {
            return res.status(401).send("no liked")
        }
        return res.status(200).send("is liked") 
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}
export const getAllLiked = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        let liked = []
        const data = await prisma.liked.findMany({
            where:{
                userId:req.userId
            },
            include:{
                product:true
            }
        })
        for(let i = 0;i<data.length;i++)
        {
            data[i].product.price = data[i].product.price.toString()
        }
        for(let i = 0;i<data.length;i++)
        {
            liked.push({
                id:data[i].product.id,
                img:data[i].product.images[0],
                price:data[i].product.price,
                quantite:1,
                shopId:data[i].product.shopId,
                title:data[i].product.title,
                total:data[i].product.price,


              })  
        }

        console.log(liked)
        return res.status(200).json({liked})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}