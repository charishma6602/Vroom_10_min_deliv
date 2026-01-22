import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';

import { GoEyeClosed } from "react-icons/go";
import { GoEye } from "react-icons/go";

import toast, {Toaster} from 'react-hot-toast'; //toaster is used to give small notifs or warnings in app

import Axios from '../utils/Axios.js'; 
import SummaryApi from '../common/SummaryApi.js';
import { Link } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError.js';


const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setdata]  = useState(
        {email : "",
        newPass: "",
        confirmPass : ""}
    )

    const [showPassword, setShowPassword] = useState(false)
    const [showconfirmPassword, setShowconfirmPassword] = useState(false)
    
    const validValue = Object.values(data).every(el => el)

    useEffect(()=>{
        if(!(location?.state?.data?.success)){
            navigate("/")
        }

        if(location?.state?.email){
            setdata((preve)=>{
                return {
                    ...preve,
                    email : location?.state?.email
                }
            })
        }
    },[])

    const handleChange = (e) => {
        const { name, value } = e.target
    
        setdata((preve) => {  //obtaining previous state values in this and updating it with user input values on top of it
          return {
            ...preve,
            [name]: value
          }
        })
      }
      console.log("data reset password",data)

      const handleSubmit = async (e) => {
        e.preventDefault()
        
        if(data.newPass !== data.confirmPass){
            toast.error("New password and confirm password must be same")
            return
        }
        
        try {
          const response = await Axios({
            ...SummaryApi.reset_password,
            data : data
            
          })
          if(response.data.error){
            toast.error(response.data.message)
          }
          
          if(response.data.success){
            toast.success(response.data.message)
            navigate("/login" )
            ////localStorage.setItem('accesstoken',response.data.data.accesstoken)
            //localStorage.setItem('refreshToken',response.data.data.refreshToken)
            setdata({
               
                email:"",
                newPass:"",
                confirmPass:""    
            })
            
          }
        } catch (error) {
          AxiosToastError(error)
        }
    
      }
  return (
    <div>
      <section className='bg-white w-full container mx-auto px-2'>
      <div className='bg-white py-4 w-full max-w-lg mx-auto rounded p-4'> {/**made it in the center with 'mx-auto' */}
        <p>Welcome to Vroom family!</p>

        <form className='grid gap-2 mt-6' onSubmit={handleSubmit}>
         
          <div className='grid gap-1 '>
            <label htmlFor='newPass'>New Password: </label>
            <div className='bg-amber-100 p-2 border rounded flex items-center focus-within:border-black'>
              <input id='newPass' type={showPassword ? "text" : "password"} autoFocus placeholder='password'
                name="newPass" value={data.newPass} onChange={handleChange}>
              </input>

              <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                {showPassword ? (<GoEye />) : (<GoEyeClosed />)}
              </div>
            </div>

          </div>
          <div className='grid gap-1 '>
            <label htmlFor='confirmPass'>confirm password: </label>
            <div className='bg-amber-100 p-2 border rounded flex items-center '>
              <input id='confirmPass' type={showconfirmPassword ? "text" : "password"} autoFocus placeholder='password'
                name="confirmPass" value={data.confirmPass} onChange={handleChange}>
              </input>

              <div onClick={() => setShowconfirmPassword(preve => !preve)} className='cursor-pointer'>
                {showconfirmPassword ? (<GoEye />) : (<GoEyeClosed />)}
              </div>
            </div>

          </div>
          <button disabled= {!validValue} className={ `${validValue ? "bg-rose-400 hover:bg-rose-300" : " bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`} >Change Password</button>
        </form>

        <p> Already have an account ? <Link to={"/login"} className='font-semibold text-rose-300 hover:text-white'>Login</Link></p>
      </div>
    </section>
    </div>
  )
}

export default ResetPassword
