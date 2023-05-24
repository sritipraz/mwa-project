const {SECRET}=require("../config.json")
const jwt_client=require("jsonwebtoken")
module.exports.checkToken= async (req,res,next)=>{
    try {
       // console.log("checking token")
        //authorization: Bearer xxxx
    const auth_string=req.headers['authorization']; 
       // console.log(auth_string)
    if(!auth_string)
        return next(new Error('Token is required'))
    
    const jwt =auth_string.split(' ')[1]
    const decoded_token=jwt_client.verify(jwt,SECRET)
    req.token=decoded_token
    
    next()
    } catch (error) {
       next(error) 
    }
}