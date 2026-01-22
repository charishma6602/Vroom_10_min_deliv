import React, { useState } from 'react'
import { GoEyeClosed } from "react-icons/go";
import { GoEye } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import toast, {Toaster} from 'react-hot-toast'; //toaster is used to give small notifs or warnings in app

import Axios from '../utils/Axios.js'; 
import SummaryApi from '../common/SummaryApi.js';
import { Link } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError.js';
import fetchUserDetails from '../utils/fetchUserDetails.js';
import { setUserDetails } from '../store/userSlice.js';
import { useDispatch } from 'react-redux';



const Login = () => {

  const [data, setdata] = useState({
    
    email: "",
    password: "",
   
  })

  const [showPassword, setShowPassword] = useState(false)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
        ...SummaryApi.login,
        data : data
        
      })
      if(response.data.error){
        toast.error(response.data.message)
      }
      
      if(response.data.success){
        toast.success(response.data.message)
        localStorage.setItem('accesstoken',response.data.data.accesstoken)
        localStorage.setItem('refreshToken',response.data.data.refreshToken)

        const userDetails = await fetchUserDetails()
        dispatch (setUserDetails(userDetails.data))
        setdata({
           
            email:"",
            password:"",
            
        })
        navigate("/")
      }
    } catch (error) {
      AxiosToastError(error)
    }

  }

  
  return (
    <section className='bg-white w-full container mx-auto px-2'>
      <div className='bg-white py-4 w-full max-w-lg mx-auto rounded p-4'> {/**made it in the center with 'mx-auto' */}
        <p>Welcome to Vroom family!</p>
        <p>Login</p>

        <form className='grid gap-2 mt-6' onSubmit={handleSubmit}>
          

          <div className='grid gap-1'>
            <label htmlFor='email'>email: </label>
            <input id='email' type='email' autoFocus placeholder='email' className='bg-amber-100 p-2 border rounded'
              name="email" value={data.email} onChange={handleChange}>
            </input>
          </div>
          <div className='grid gap-1 '>
            <label htmlFor='password'>password: </label>
            <div className='bg-amber-100 p-2 border rounded flex items-center'>
              <input id='password' type={showPassword ? "text" : "password"} autoFocus placeholder='password'
                name="password" value={data.password} onChange={handleChange}
                className='bg-transparent outline-none w-full flex-1'
                >
              </input>

              <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                {showPassword ? (<GoEye />) : (<GoEyeClosed />)}
              </div>
            </div>
            <Link to={"/forgot-password"} className='block ml-auto hover:text-gray-400'>Forgot Password ?</Link>
          </div>
          
          <button disabled= {!validValue} className={ `${validValue ? "bg-rose-400 hover:bg-rose-300" : " bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`} >Login</button>
        </form>

        <p> Don't have an account ? <Link to={"/register"} className='font-semibold text-rose-300 hover:text-white'>Register</Link></p>
      </div>
    </section>
  )
}

export default Login
