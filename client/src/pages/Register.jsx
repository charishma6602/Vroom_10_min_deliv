import React, { useState } from 'react'
import { GoEyeClosed } from "react-icons/go";
import { GoEye } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import toast, {Toaster} from 'react-hot-toast'; //toaster is used to give small notifs or warnings in app

import Axios from '../utils/Axios.js'; 
import SummaryApi from '../common/SummaryApi.js';
import { Link } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError.js';



const Register = () => {

  const [data, setdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmpass: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showconfirmPassword, setShowconfirmPassword] = useState(false)
  const navigate = useNavigate()
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

    if (data.password !== data.confirmpass) {
      toast.error("password and confirm password should be same")
      return
    }
    try {
      const response = await Axios({
        ...SummaryApi.register,
        data : data
        
      })
      if(response.data.error){
        toast.error(response.data.message)
      }
      
      if(response.data.success){
        toast.success(response.data.message)
        setdata({
            name:"",
            email:"",
            password:"",
            confirmpass:""
        })
        navigate("/login")
      }
    } catch (error) {
      AxiosToastError(error)
    }

  }

  
  return (
    <section className='bg-white w-full container mx-auto px-2'>
      <div className='bg-white py-4 w-full max-w-lg mx-auto rounded p-4'> {/**made it in the center with 'mx-auto' */}
        <p>Welcome to Vroom family!</p>

        <form className='grid gap-2 mt-6' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor='name'>Name: </label>
            <input id='name' type='text' autoFocus placeholder='Name' className='bg-amber-100 p-2 border rounded'
              name="name" value={data.name} onChange={handleChange}>
            </input>
          </div>

          <div className='grid gap-1'>
            <label htmlFor='email'>email: </label>
            <input id='email' type='email' autoFocus placeholder='email' className='bg-amber-100 p-2 border rounded'
              name="email" value={data.email} onChange={handleChange}>
            </input>
          </div>
          <div className='grid gap-1 '>
            <label htmlFor='password'>Password: </label>
            <div className='bg-amber-100 p-2 border rounded flex items-center focus-within:border-black'>
              <input id='password' type={showPassword ? "text" : "password"} autoFocus placeholder='password'
                name="password" value={data.password} onChange={handleChange}
                className='bg-transparent outline-none w-full flex-1'>
              </input>

              <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                {showPassword ? (<GoEye />) : (<GoEyeClosed />)}
              </div>
            </div>

          </div>
          <div className='grid gap-1 '>
            <label htmlFor='confirmpassword'>confirm password: </label>
            <div className='bg-amber-100 p-2 border rounded flex items-center '>
              <input id='confirmpassword' type={showconfirmPassword ? "text" : "password"} autoFocus placeholder='password'
                name="confirmpass" value={data.confirmpass} onChange={handleChange}
                className='bg-transparent outline-none w-full flex-1'>
              </input>

              <div onClick={() => setShowconfirmPassword(preve => !preve)} className='cursor-pointer'>
                {showconfirmPassword ? (<GoEye />) : (<GoEyeClosed />)}
              </div>
            </div>

          </div>
          <button disabled= {!validValue} className={ `${validValue ? "bg-rose-400 hover:bg-rose-300" : " bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`} >Register</button>
        </form>

        <p> Already have an account ? <Link to={"/login"} className='font-semibold text-rose-300 hover:text-white'>Login</Link></p>
      </div>
    </section>
  )
}

export default Register
