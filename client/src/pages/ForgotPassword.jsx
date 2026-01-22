import React, { useState } from 'react'
import { GoEyeClosed } from "react-icons/go";
import { GoEye } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import toast, {Toaster} from 'react-hot-toast'; //toaster is used to give small notifs or warnings in app

import Axios from '../utils/Axios.js'; 
import SummaryApi from '../common/SummaryApi.js';
import { Link } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError.js';



const ForgotPassword = () => {

  const [data, setdata] = useState({
    
    email: "",
    
   
  })
  
  const navigate = useNavigate()

  //when input is enetered into fields
  const handleChange = (e) => {
    const { name, value } = e.target

    setdata((preve) => {  //obtaining previous state values in this
      return {
        ...preve,
        [name]: value
      }
    })
  }

    // we are writing this because, the register button must be valid only
  //when all the fields are filled with valid values, else register button must be disabled

  const validValue = Object.values(data).every(el => el) //every(el => el) meaning, iterating thru all the values of data i.e 
  //name, email, password and confirm password 

  const handleSubmit = async (e) => {
    e.preventDefault()

    
    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data : data
        
      })
      if(response.data.error){
        toast.error(response.data.message)
      }
      
      if(response.data.success){
        toast.success(response.data.message)
        navigate("/verify-forgot-password", {
          state :data
        })
        ////localStorage.setItem('accesstoken',response.data.data.accesstoken)
        //localStorage.setItem('refreshToken',response.data.data.refreshToken)
        setdata({
           
            email:"",
           
            
        })
        
      }
    } catch (error) {
      AxiosToastError(error)
    }

  }

  
  return (
    <section className='bg-white w-full container mx-auto px-2'>
      <div className='bg-white py-4 w-full max-w-lg mx-auto rounded p-4'> {/**made it in the center with 'mx-auto' */}
        <p>Forgot Password</p>
        
        <form className='grid gap-2 mt-6' onSubmit={handleSubmit}>
          

          <div className='grid gap-1'>
            <label htmlFor='email'>email: </label>
            <input id='email' type='email' autoFocus placeholder='email' className='bg-amber-100 p-2 border rounded'
              name="email" value={data.email} onChange={handleChange}>
            </input>
          </div>
          
          
          <button disabled= {!validValue} className={ `${validValue ? "bg-rose-400 hover:bg-rose-300" : " bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`} >send otp</button>
        </form>

        <p> Already have an account ? <Link to={"/login"} className='font-semibold text-rose-300 hover:text-white'>Login</Link></p>
      </div>
    </section>
  )
}

export default ForgotPassword

