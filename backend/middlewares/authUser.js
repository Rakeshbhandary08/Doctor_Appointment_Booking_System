import jwt from 'jsonwebtoken'

//admin authentication middleware
const authUser = async(req,res,next)=>{
    try{
    const {token}=req.headers;
    
    if(!token){
        return res.json({success:false,message:"Not authorized Login again"})
    }
    const token_decode=jwt.verify(token,process.env.USER_JWT_SECRET);

    req.userId=token_decode.id;

    next()
    }
    catch(error){
        console.log(error);
        return res.json({success:false,message:error.message})
    }
}

export default authUser;