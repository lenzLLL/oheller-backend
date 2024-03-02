import { PrismaClient } from "@prisma/client"

export const addCity =  async (req,res) =>{
    try{
        const prisma = new PrismaClient()
        const {city,region} = req.body
        await prisma.city.create({
            data:{
                region,
                city
            }
        })
        return res.status(201).send("created")
    }
    catch(error){
        console.log(error)
        return res.status(500).send("Internal server error")
    }
}

export const getAllCity = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        const cities = await prisma.city.findMany()
        return res.status(200).json({cities})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json("Internal server error")
    }
}

export const removeCity = async (req,res) => {
    try{
        const prisma = new PrismaClient()
        await prisma.city.delete({
            where:{
                id:parseInt(req.params.cityId)
            }
        })
        return res.status(200).send("City removed")
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).sendd("Internal server error")
    }
}