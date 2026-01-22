import React, { useEffect, useRef, useState } from 'react'
import { GoEyeClosed } from "react-icons/go";
import { GoEye } from "react-icons/go";
import { useLocation, useNavigate } from 'react-router-dom';
import toast, {Toaster} from 'react-hot-toast'; //toaster is used to give small notifs or warnings in app

import Axios from '../utils/Axios.js'; 
import SummaryApi from '../common/SummaryApi.js';
import { Link } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError.js';


const OtpVerify = () => {

  const [data, setdata] = useState(["","","","","",""])  // empty string array which is used to store later the 6 digit otp
  const navigate = useNavigate()
  const inputRef = useRef([])
  const location =  useLocation()

  console.log("location",location)

  useEffect(()=>{       //when user directly tries to access verify-forgot-password page, it shouldn't be valid. so we are using
    //useEffect to prevent that from happening, when there's no location state of email
    if(!location?.state?.email){
        navigate("/forgot-password")
    }
  }, [])

  
    // we are writing this because, the register button must be valid only
  //when all the fields are filled with valid values, else register button must be disabled

  const validValue = data.every(el => el) //every(el => el) meaning, iterating thru all the values of 'data' i.e 
  //name, email, password and confirm password 

  const handleSubmit = async (e) => {
    e.preventDefault()

    
    try {
      const response = await Axios({
        ...SummaryApi.verify_forgot_password,
        data : {
            otp : data.join(""),
            email : location?.state?.email
        }
        
      })
      if(response.data.error){
        toast.error(response.data.message)
      }
      
      if(response.data.success){
        toast.success(response.data.message) 
        setdata(["","","","","",""])
        navigate("/reset-password",{
          state : {
            data : response.data,
            email : location?.state?.email
          }
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
            <label htmlFor='otp'>Enter your OTP </label>
            <div className='flex items-center gap-2 justify-between mt-3'>
                {
                    data.map((element,index)=>{   //loop map to iterate through the element' indexes
                        return (
                            <input key={"otp"+index}  
                             id='otp' type='text'  
                             ref = {(ref)=>{
                                inputRef.current[index] = ref  //moving the cursor to the refernce point
                                return ref
                             }}

                            value={data[index]}    
                            onChange={(e)=>{
                                const value = e.target.value
                                console.log("value",value)

                                const newData = [...data] //storing data value in duplicate variable and setting the index with value
                                newData[index]=value
                                setdata(newData)

                                if(value && index<5){
                                    inputRef.current[index+1].focus() //as long as there is value and index is less than 5
                                    //focus the current index of the reference 
                                }

                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Backspace") {
                                if (data[index] === "") {
                                  if (index > 0) {
                                    inputRef.current[index - 1].focus();  //this is the line that moves the cursor
                                    const newData = [...data];
                                    newData[index - 1] = "";
                                    setdata(newData);
                                  }
                                }
                              }
                            }}
                            maxLength={1}   //only one character(or digit) in each box
                            className='bg-amber-100 w-full max-w-15 p-2 border rounded outline-none focus:border-rose-300 text center font-semibold'
                            >
                          </input>
                        )
                    })
                }
            </div>
           
          </div>
          
          
          <button disabled= {!validValue} className={ `${validValue ? "bg-rose-400 hover:bg-rose-300" : " bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`} >Verify</button>
        </form>

        <p> Already have an account ? <Link to={"/login"} className='font-semibold text-rose-300 hover:text-white'>Login</Link></p>
      </div>
    </section>
  )
}

export default OtpVerify

