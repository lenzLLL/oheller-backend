import { PrismaClient } from "@prisma/client"
import { genSalt,hash,compareSync } from "bcrypt"
import cloudinary from "cloudinary"
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/sendMail.js"

const generatePassword = async (password) => {
    const salt = await genSalt()
    return await hash(password,salt)
}
const maxAge = 3 * 24 * 60 * 60 * 1000
const createToken = (email,userId) => {
    return jwt.sign({email,userId},process.env.JWT_KEY,{
        expiresIn:maxAge*1000
    })    
} 
export const signup = async (req,res,next) => {
    try{
        const prisma = new PrismaClient()
        const {email,password} = req.body
        if(email && password)
        {
             const verifyEmail = await prisma.user.findFirst({
            where:{
            email:email
            }})
            if(verifyEmail){
                return res.status(400).send("")
            }
            const user = await prisma.user.create({
                data:{
                    email,
                    password:await generatePassword(password),
                }
            })
             const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY, {
                 expiresIn: '2d',
               });
               const cookieOptions = {
                 httpOnly: false,
                 path:"/",
                 maxAge: 30 * 24 * 60 * 60 * 1000, // Durée de vie d'une heure (en millisecondes)
                 sameSite: 'none',
                 secure: process.env.NODE_ENV === 'production', // Utiliser "true" en production (HTTPS)
               };
          
              // Envoyer le cookie dans la réponse
            
            //return  res.status(201).json({jwt:token, user:{id:user.id,email:user.email}})
          
           //return res.cookie('jwt', token, cookieOptions).status(201).json({jwt:token,user:{id:user.id,email:user.email}})
              await sendEmail(email,"Hello","Votre compte Oheller a bien été créé. Veillez cliquer sur le lien suivant  pour l'activer: \noheller.com/activated/"+user.id+"\nCordialement")

          return res.status(200).send("okay")

        }
        return res.status(500).json("Internal server error")
    }
    catch(Err){
        console.log(Err)
        return res.status(500).send("Internal Server Error")
    }
}
export const login = async (req,res,next) => {
    try{
        const prisma = new PrismaClient()
        const {email,password} = req.body
        if(email && password)
        {
            const user = await prisma.user.findUnique({
                where: {email}
            })
            if(!user)
            {
                return res.status(401).send("Pas d'utilisateur")
            }
            const auth = await  compareSync(password,user.password)

            if(!auth){
                return res.status(400).send("Mot de passe invalide")
            }
               if(!user.isActivated){
               await sendEmail(email,"Hello","Votre compte Oheller a bien été créé. Veillez cliquer sur le lien suivant  pour l'activer: \noheller.com/activated/"+user.id+"\nCordialement")
               return res.status(402).send("Veillez activer votre compte")
                
            }
             const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY, {
                 expiresIn: '2d',
               });
               const cookieOptions = {
                 httpOnly: false,
                 maxAge:   30 * 24 * 60 * 60 * 1000, // Durée de vie d'une heure (en millisecondes)
                 sameSite: 'none',
                 path:"/",
                 secure: process.env.NODE_ENV === 'production', // Utiliser "true" en production (HTTPS)
               };
          
              // Envoyer le cookie dans la réponse
          
           return  res.cookie('jwt', token, cookieOptions).status(201).json({jwt:token,user:{id:user.id,email:user.email}})
           // return  res.status(201).json({jwt:token, user:{id:user.id,email:user.email}})
        }
        return res.status(500).json("Internal server error")
    }
    catch(Err){
        console.log(Err)
        return res.status(500).send("Internal Server Error")
    }
}
export const getUserInfos = async (req,res,next) => {
    try{
        if(req?.userId)
        { 
            const prisma = new PrismaClient()
            const user = await prisma.user.findUnique(
                {
                    where:{
                        id:req.userId
                    }
                }
            )
            delete user.password          
            return res.status(200).json({user})
        }
    }
    catch(err)
    {
        res.status(500).json("Internal server Error")
    }    
}
export const setUserProfil = async (req,res) => {
    try{
        if(req?.userId)
        {
            const { accountType,region,
                city,
                quarter,
                currentPictures,
                pictures,
                fullname ,
                workerType,
                secteur,
                work,
                sexe,
                diplome,
                langue,
                birthday,
                contact,
                experience } = req.body
            const prisma = new PrismaClient()
            const finalData = {}
            if(req.file)
            {
                myCloud = await cloudinary.v2.uploader.upload(req.file, {
                    folder: "avatars",
                    width: 150,
                    crop: "scale",
                });
                console.log("cool")
                        }
        
            if(city !=="")
            {
                finalData.city = city
            }
            if(quarter !=="")
            {
                finalData.quarter = quarter
            }            if(fullname !=="")
            {
                finalData.fullname = fullname
            }          
            if(sexe !=="")
            {
                finalData.sexe = sexe
            }
            if(secteur !=="")
            {
                finalData.secteur = secteur
            }
            if(work !=="")
            {
                finalData.work = work
            }
            if(diplome !=="")
            {
                finalData.diplome
                 = diplome
            }
            if(langue !=="")
            {
                finalData.langue = langue
            }
            if(region !=="")
            {
                finalData.region = region
            }
            if(accountType !== "")
            {
                finalData.accountType = accountType
            }
            if(birthday !== null)
            {
                finalData.birthday = birthday.toString()
            }
            if(pictures.length > 0 ){
                let finalPictures = currentPictures? [...currentPictures]:[]
                for(let i = 0;i<pictures.length;i++)
                    {
                        const result = await cloudinary.v2.uploader.upload(pictures[i],{
                            folder:"pictures"
                        })
                        finalPictures.push(result.secure_url)
                    }
                    finalData.pictures = finalPictures
            }
            if(experience)
            {
            finalData.experience = parseInt(experience)
            }
            finalData.isProfilInfosSet = true
       
            await prisma.user.update({
                where:{id:req.userId},data:{
                  ...finalData,contact,workerType
                  }
            })    
            res.status(200).send("Les informations de votre compte ont été sauvegardé")    
        }
    }
    catch(err)
    {console.log(err)
        res.status(500).send(err)
    }
}
export const setUserImage = async (req,res,next) => {
    try{
        if(req.body.image)
        {  
            if(req.userId)
            {   

                const prisma = new PrismaClient()
                const user = await prisma.user.findUnique({
                    where: {id:req.userId}
                })
                if(user.public_id_profile)
                {
                    await cloudinary.v2.uploader.destroy(user.public_id_profile); 
                }
                const  myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
                        folder: "avatars",
                        width: 150,
                        crop: "scale",
                  });                 
                
                 await prisma.user.update({
                     where:{id:req.userId},
                     data:{public_id_profile:myCloud.public_id,url_image:myCloud.secure_url}
                })



                return res.status(200).json({img:""})
            }
            else{
            res.status(400).send("cookie error")

            }
        } 
        else{
        res.status(400).send("aucune image trouvé")
        
        }
    }
    catch(error)
    {
       console.log(error)
       res.status(500).send("Internal server error")
    }
}
export const setUserCv = async (req,res,next) => {
    try{
        if(req.body.cv)
        {  
            console.log(req.userId)
            if(req.userId)
            {   

                const prisma = new PrismaClient()
                const user = await prisma.user.findUnique({
                    where: {id:req.userId}
                })
                if(user.public_id_cv)
                {
                    await cloudinary.v2.uploader.destroy(user.public_id_cv); 
                }
                const  myCloud = await cloudinary.v2.uploader.upload(req.body.cv, {
                        folder: "cv",
                        
                });               
                 await prisma.user.update({
                     where:{id:req.userId},
                     data:{public_id_cv:myCloud.public_id,url_cv:myCloud.secure_url}
                })
                return res.status(200).json({img:""})
            }
            else{
            res.status(400).send("cookie error")

            }
        } 
        else{
        res.status(400).send("aucun fichier trouvé")
        
        }
    }
    catch(error)
    {
       console.log(error)
       res.status(500).send("Internal server error")
    }
}
export const getAllUsers = async (req,res,next) => {
    try{
        const prisma  = new PrismaClient()
        const users = await prisma.user.findMany({orderBy:{id:"asc"}})
        return res.status(200).json({users})
    }

    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}
export const getAllExperts = async (req,res,next) => {
    try{
        const prisma  = new PrismaClient()
        let users = await prisma.user.findMany({})
        const myCurrentExperts = await prisma.workrequest.findMany({
            where:{
                userId:req.userId
            }
        })
        console.log(myCurrentExperts)
          
        
        for(let i = 0; myCurrentExperts.length; i++){
               users=   users.filter(user=>user.id === myCurrentExperts[i].workerId)  
            } 
        console.log(users)       
        return res.status(200).json({users})
    }

    catch(err)
    {
        
        return res.status(500).send("Internal server error")
    }    
}
export const getLastLogger = async (req,res,next) =>{
    try{
        const prisma = new PrismaClient()
        const users = await prisma.user.findMany({
            orderBy:{
                id:"desc",
            },
            take:10
        })
        return res.status(200).json({users})
    }
    catch(err)
    {
        alert(err)
        return res.status(500).send("Internal server error")
    }
}

export const activateAccount = async (req,res) =>{
    try{
        const prisma = new PrismaClient()
        const user = await prisma.user.update(
            {
                data:{
                    isActivated:true
                },
                where:{
                    id:parseInt(req.body.userId)
                }
            },
            
        )
      if(!user){
          return res.status(404).send("not found")
      }
      else{
          return res.status(200).send("successful")
      }
    } 
    catch(err)
    {
        console.log(err)
        return res.status(500).send("Internal server error")
    }
}
