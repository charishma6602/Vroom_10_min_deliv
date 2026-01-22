//product, users all routes are in route folders

import {Router} from 'express'
import { forgotPassword, loginController, logoutController, refreshToken, registerUserController, resetPassword, updateuserDetails, uploadAvatar, userDetails, verifyOtp } from '../controllers/user.controller.js'
import { verifyemailcontroller } from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'
import multer from 'multer'

const userRouter = Router()

userRouter.post('/register',registerUserController)
userRouter.post('/verify-email', verifyemailcontroller)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutController)
userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatar)
userRouter.put('/update-user',auth, updateuserDetails)
userRouter.put('/forgot-password',forgotPassword)
userRouter.put('/verify-forgot-password',verifyOtp)
userRouter.put('/reset-password',resetPassword)
userRouter.post('/refresh-token',refreshToken)
userRouter.get('/user-profile',auth, userDetails)
export default userRouter