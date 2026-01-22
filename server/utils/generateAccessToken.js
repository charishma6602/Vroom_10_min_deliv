import jwt from 'jsonwebtoken'

//jwt cookies can only be manipulated from server side
// jwt token is comprised on 3 things, (header=hash algo + type:jwt both in base64 encoding)+payload(user data in base64 encoding)+hash of (base64 encoding of (header+payload)+secret_key)
const generateaccesstoken = async (userId)=>{
    const token = await jwt.sign({id :userId}, 
        process.env.SECRET_KEY_ACCESS_TOKEN, 
        {expiresIn:'5h'})

    return token
}

export default generateaccesstoken
