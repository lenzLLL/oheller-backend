import { PrismaClient } from "@prisma/client"

export const addProfession =  async (req,res) =>{
    try{
        const prisma = new PrismaClient()
        const {profession,secteur} = req.body
        await prisma.profession.create({
            data:{
                secteur,
                profession
                
            }
        })
        return res.status(201).send("created")
    }
    catch(error){
        console.log(error)
        return res.status(500).send("Internal server error")
    }
}

export const getAllProfession = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const professions = await prisma.profession.findMany()
        return res.status(200).json({professions})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json("Internal server error")
    }
}

export const removeProfession = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        await prisma.profession.delete({
            where:{
                id:parseInt(req.params.professionId)
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