import { PrismaClient } from "@prisma/client"

export const addSecteur =  async (req,res) =>{
    try{
        const prisma = new PrismaClient()
        const {name} = req.body
        await prisma.secteur.create({
            data:{
                name,
                
            }
        })
        return res.status(201).send("created")
    }
    catch(error){
        console.log(error)
        return res.status(500).send("Internal server error")
    }
}

export const getAllSecteur = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const secteurs = await prisma.secteur.findMany()
        return res.status(200).json({secteurs})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json("Internal server error")
    }
}

export const removeSecteur = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        await prisma.secteur.delete({
            where:{
                id:parseInt(req.params.secteurId)
            }
        })
        return res.status(200).send("secteur removed")
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).sendd("Internal server error")
    }
}