import jwt from "jsonwebtoken"

export const verifyToken = (req,res,next) => {
    if(!req.signedCookies.jwt)
    {
        return res.status(404).send("token is not found")
    }
    console.log(req.cookies.jwt)
    const token = req.cookies.jwt
    if(!token) return res.status(401).send("you are not authentificated")
    jwt.verify(token,process.env.JWT_KEY,async (err,payload)=>{
        if(err) return res.status(403).send("Token is not valid")
        req.userId = payload?.userId
        next()
    })        
}
