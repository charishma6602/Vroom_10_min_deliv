import jwt from "jsonwebtoken"
import UserModel from "../model/user.model.js"

const generaterefreshtoken = async(userId)=>{
    const token = await jwt.sign ({id: userId},
        process.env.SECRET_KEY_REFRESH_TOKEN,
        {expiresIn : '7d'})

    //updating refresh_token value from usrModel
    const updaterefresh = await UserModel.updateOne(
        {_id:userId},
    {
        refresh_token : token
    })

    return token
}

export default generaterefreshtoken