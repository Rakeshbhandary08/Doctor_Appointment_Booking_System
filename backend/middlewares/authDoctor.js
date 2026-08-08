import jwt from "jsonwebtoken"

const authDoctor=async(req,res,next)=>{

    try{
    const {dtoken}=req.headers  //in headers all the keys will present in small case

    if(!dtoken){
        return res.json({success:false,message:"Not authorized Login again"})
    }

    const token_decoded=jwt.verify(dtoken,process.env.JWT_SECRET);

    req.docId=token_decoded.id;

    next()

}
catch(error){
    console.log(error);
    return res.json({success:false,message: "Invalid or expired token"})
}
}

export default authDoctor;










