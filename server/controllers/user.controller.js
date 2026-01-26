//controllers are used to registeration, authentications etc
import sendEmail from '../config/sendEmail.js'
import UserModel from '../model/user.model.js'
import bcryptjs from 'bcryptjs'
import verifytemp from '../utils/verifytemp.js'
import generateaccesstoken from '../utils/generateAccessToken.js'
import generaterefreshtoken from '../utils/refreshToken.js'
import uploadImage from '../utils/uploadImageCloudinary.js'
import upload from '../middleware/multer.js'
import generateotp from '../utils/generateotp.js'
import otpmailtemp from '../utils/otpmailtemp.js'
import jwt from 'jsonwebtoken'

export async function registerUserController(request, response){
    try{
         console.log("DEBUG: request.body =", request.body)
         const {name, email, password} = request.body  //for user registration
         

         if (!name|| !email || !password){
                return response.status(400).json({
                    message: "Provide email , name and password",
                    error :true,
                    success : false
                })
         }
        

         const user = await UserModel.findOne({email})
          //if return non-null value, email exists

          if(user){
            return response.json({
                message: "Email already registered",
                error:true,
                success:false
            })
          }

          //registering a new usr and storing the password using bcrypt
          const salt = await bcryptjs.genSalt(10)
          const hashPassword = await bcryptjs.hash(password,salt)
        //payload that we send to the DB while creating a new User collection(table) model
          const payload = {
            name, email, password:hashPassword
          }

          const newUser = new UserModel(payload)
          const save = await newUser.save()  //saving user info

        //email verification - resend package
         const verifyurl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`
         const verifyEmail = await sendEmail({
            sendTo : email,
            subject : "Verify email from Vroom",
            html : verifytemp({
                name, url: verifyurl
            })
         })

         return response.json({
            message: "User registered successfully",
            error:false,
            success: true,
            data: save
         })
         
    } catch(error){
        return response.status(500).json({
            message: error.message || error,
            error : true,
            success : false
        })
    }
}

export async function verifyemailcontroller(request,response) {
    try{
        const { code } = request.body
        const verifyuser = await UserModel.findOne({_id: code})

        if(!verifyuser){
            return response.status(400).json({
                message: "Invalid code" || error.message,
                error: true,
                success: false
            })
        }
        
        const updateuser = await UserModel.updateOne({_id: code},{verify_email:true}) //add await here and see, if error comes here, i purposefully removed await to see what happens
        return response.json({
            message:"Verification of email is done!",
            error: false,
            success:true
        })

    }catch(error){
        return response.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
    
}
 
//login controller


export async function loginController(request, response) {
    try{
        const {email, password} = request.body
        
        if(!email || !password){
            return response.status(400).json({
                message: "please provide valid email or password",
                error:true,
                success:false

            })
        }

        const user = await UserModel.findOne({email}) //here, user itself is not an object.
        //the 'await' infront of UserModel makes it a promise first and then it resolves into an object
        //because javascript is asyncrhronous, async-await helps in executing desired statements and continue with async operations
        if(!user){
            return response.status(400).json({
                message: "User not found" || error.message,
                error:true,
                success: false
            })
        }
        if(user.status!=='Active'){          //this can also be written as UserModel.findOne({email}).then(user=>{
            //                                                                                  if(user.status!=='Active'){...}  });           })
            return response.status(400).json({
                message:"Contact Admin, user is not active anymore!",
                error:true,
                success:false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password)

        if(!checkPassword){
            return response.status(400).json({
                message:"check your password!",
                error:true,
                success:false
            })
        }
        //after logging in, user will be assigned with access token - login purpose token (3hrs-1day) or 
        // refresh token- related to life span of the session (upto 30 days)
        const accesstoken = await generateaccesstoken(user._id)
        const refreshtoken = await generaterefreshtoken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login : new Date()

        })

        const cookieOption = {
            httpOnly : true,
            secure: true,
            sameSite:"None",
            path:"/"
        }
        response.cookie('accessToken',accesstoken, cookieOption)
        response.cookie('refreshToken',refreshtoken, cookieOption)
        
        return response.json({
            message:"login successful!",
            error:false,
            success:true,
            data:{
                accesstoken, refreshtoken
            }
        })

    }catch(error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function logoutController(request, response) {
    try{
        const userid = request.userId //coming from middleware/auth.js
        const cookieOption = {
            httpOnly : true,
            secure: true,
            sameSite:"None",
        }
        response.clearCookie("accessToken",cookieOption)
        response.clearCookie("refreshToken",cookieOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token:""
        })
        return response.json({
            message:"Logout is successful",
            error:false,
            success:true
        })
    }catch(error){
        response.status(500).json({
            message: error.message || error,
            error: true,
            success:false
        })
    }
}

export async function uploadAvatar(request, response) {
 try{
    const image = request.file   //from multer middleware
    const userid = request.userId //from auth middle ware

    const upload = await uploadImage(image)

    const updateuser = await UserModel.findByIdAndUpdate(userid,{
        avatar:upload.url
    })
    
    console.log("Upload response:", response);

    return response.json({
        message:"Uploaded profile",
        success:true,
        error:false,
        data: {
            _id : userid,
            avatar : upload.url}
    })
    
 }  catch(error){
        response.status(500).json({
            message: error.message || error,
            error: true,
            success:false
        })
    } 
}

export async function updateuserDetails(request,response){ //we are updating 3 fields, name, password, and mobile number
    try{
        const userid =  request.userId
        const {name, email, mobile, password } = request.body

        let hashPassword = ""

        if(password){
            const salt =  await bcryptjs.genSalt(10)
            hashPassword =  await bcryptjs.hash(password,salt)
        }

        const updateuser = await UserModel.updateOne({_id : userid}, { //update One shows the current updated info, whereas
            //findOneByIdandUpdate shows the previous info to the updated ones
            ...(name && {name:name}),
            ...(email && {email:email}),
            ...(mobile && {mobile:mobile}),
            ...(password && {password:hashPassword}), // if name or email or mobile is given,then only update them, this is the syntax

        })

        return response.json({
            message: "User info updated successfully",
            error:false,
            success:true,
            data:updateuser
        })

    }catch(error){
        return response.status(500).json({
            message: error.message || error,
            error:true,
            success:false
        })
    }
}
//forgot password controller-> send otp to email -> verify otp controller -> reset password controller
export async function forgotPassword(request, response){ //in this controller, not logged in yet
    try{
        const {email } = request.body
        const user = await UserModel.findOne({email})

        if(!user){ 
            return response.status(400).json({
                message:"User not found",
                error:true,
                success:false
            })
        }
       const otp = generateotp()

       const expireIn =  new Date(Date.now() + 60 * 60 * 1000);  // otp expires in 30 mins
       const update = await UserModel.findByIdAndUpdate(user._id,{
        forgot_password_otp : otp,
        forgot_password_expiry: expireIn.toISOString()
       })
       await sendEmail({
        sendTo : email,
        subject: "FORGOT PASSWORD EMAIL",
        html: otpmailtemp({name : user.name, otp : otp})
    })
       return response.json({
        message:"check your email",
        error:false,
        success:true
       })
    

    }catch(error){
        response.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}

export async function verifyOtp(request,response) {
    try{
        const {email , otp } = request.body
         //we are validating the otp to the email
         if(!email || !otp){
            return response.status(400).json({
                message:"please provide otp",
                error:true,
                success:false
            })
         }
         const user = await UserModel.findOne({email})

         if(!user){ 
             return response.status(400).json({
                 message:"User not found",
                 error:true,
                 success:false
             })
            }
         const currentTime = new Date().toISOString()

         if(user.forgot_password_expiry < currentTime){ //current time should be within expiry time
            return response.status(400).json({
                message:"OTP is expired",
                error:true,
                success:false
            })
         }
         if(otp.trim() !== user.forgot_password_otp.trim()){
            return response.status(400).json({
                message:"Invalid OTP",
                error:true,
                success:false
            })
         }

         const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp :"",
            forgot_password_expiry : ""
         })
         return response.json({
            message:"OTP is correct and successfully logged in",
            error:false,
            success:true
         })
    }
    catch(error){
        return response.status(500).json*{
            message:error.message||error,
            error:true,
            success:false
        }
    }
}
export async function resetPassword(request, response) {
    try{
        const {email, newPass, confirmPass} = request.body
        if(!email || !newPass || !confirmPass){
            return response.status(400).json({
                message:"Provide required fields - email, password or confirm password",
                error:true,
                success:false
            })
        }
        const user = await UserModel.findOne({email})
        if(!user){ 
            return response.status(400).json({
                message:"User/Email not found",
                error:true,
                success:false
            })
        }

        if(newPass!== confirmPass){
            return response.status(400).json({
                message:"New Password and confirm Password are not same",
                error:true,
                success:false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPass,salt)
        
        const update= await UserModel.findOneAndUpdate(user._id,{password:hashPassword})

        return response.json({
            message:"Password Updated successfully",
            error:false,
            success:true
        })
    }catch(error){
        return response.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}
//after resetting the password, new access and Refresh tokens must be issued for security purposes
export async function refreshToken(request,response) {
    try{
        const refreshToken = request.cookies.refreshToken || request.header?.authorization?.split(" ")[1]
         ///

        if(!refreshToken){
            return response.status(401).json({
                message:"Invalid Token",
                error:true,
                success:false
            })
        }

        //since refresh token is not expired from the previous session to password resetting

        const verifyToken  =  jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return response.status(401).json({
                message:"Token is expired",
                error:true,
                success:false
            })
        }
        console.log("verifyToken : ", verifyToken)
        const userid = verifyToken._id

        const newAccesstoken = await generateaccesstoken(userid)

        const cookieOption = {
            httpOnly : true,
            secure: true,
            sameSite:"None"
        }

        response.cookie('accessToken',newAccesstoken,cookieOption)

        return response.json({
            message:"New access token is generated",
            error:false,
            success:true,
            data:{
                accesstoken:newAccesstoken
            }
        })
        
    }catch(error){
        return response.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}

//------------------------------------>
//till here, register, verify, login, logout, upload avatar, upload user details, forgot password, reset password
//refresh token - all these controllers were taken care of

export async function userDetails(request, response){
    try{

        const userId = request.userId
        console.log(userId)
        const user = await UserModel.findById(userId).select('-password -refresh_token')  //i dont need password
        //and refresh token to be displayed in user profile details, so we are using select here

        return response.json({
            message : 'user details',
            data : user,
            error: false,
            success: true
        })

    }catch(error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
          });
    }
}