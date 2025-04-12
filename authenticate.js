const jwt=require("jsonwebtoken")

const authenticate=(req,res,next)=>{
    let jwttoken
    const authHeader=req.headers["authorization"]
    if (authHeader!==undefined){
        jwttoken=authHeader.split(" ")[1]
    }
    if(jwttoken===undefined){
        return res.status(401).json({message:"Token not provided"})
    }else{
         jwt.verify(jwttoken,process.env.SECRET_TOKEN,async(error,payload)=>{
            if(error){
                return res.status(401).json({message:"Invalid token"})
            }else{
                req.userId=payload.userId
                next()
            }
         })
    }

}

module.exports={authenticate}