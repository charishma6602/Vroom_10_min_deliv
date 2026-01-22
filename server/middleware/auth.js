import jwt from 'jsonwebtoken'
//this auth.js in middleware function,is basically a check point in the user route where we are checking for the token
// sees if the token is expired and validating the token (all the functions in the middleware folder are checkpoints like this)
const auth = async (request,response,next)=>{

    try{
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]     ///["Bearer" "token"]
        if(!token){
            return response.status(401).json({  //checking if token is invalid(expired)
                message:"Token is invalid or empty",

            })
            
        }
        const decodeverify = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)
        if(!decodeverify){//decoding token using the secret key in the above statement, we are validating the token of user
            return response.status(401).json({
                message:"Unauthorised Access, contact admin",
                error:true,
                success:false
            })
        }
            request.userId=decodeverify.id
            next()
    }catch(error){
        response.status(500).json({
            message:"You need to login to proceed",//error.message|| error,
            error:true,
            success:false
        })
    }
}
export default auth