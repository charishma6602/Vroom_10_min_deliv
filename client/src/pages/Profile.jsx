import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import { useDispatch, useSelector } from 'react-redux'
import fetchUserDetails from '../utils/fetchUserDetails'
import { setUserDetails } from '../store/userSlice'
import SummaryApi from '../common/SummaryApi'
import { FaUser } from "react-icons/fa";
import UserProfileAvatar from '../components/userProfileAvatar'
import AxiosToastError from '../utils/AxiosToastError'
import toast, {Toaster} from 'react-hot-toast';

const Profile = () => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [profileAvatar, setProfileAvatarEdit] = useState(false)
    const [userData, setuserData] = useState({  // we assign it like this using useState, is to track the changes in the data (state of data)
        //and re-renders the page accordingly. if you normally assign, re-rendering is not possible
        name : user.name,  //tracks change - useState
        email : user.email,
        mobile : user.mobile
    })

    const [loading,setloading] = useState(false)
    

    useEffect(()=>{
        setuserData({  //setuserData is used to set the value of the variable to update it when the state (of data) changes
        name : user.name,  //i.e, whenever user change the input, update the local state or data to match the change
        email : user.email,  //useEffect - update change
        mobile : user.mobile
        })
    },[user])

    const handleChange = (e) => {
    const { name, value } = e.target

    setuserData((preve) => {  //obtaining previous state values in this
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    
    try {
      const response = await Axios({
        ...SummaryApi.updateUserdetails,  //... - is spread operator, it basically spreads the details of updateUserdetail
        //from summaryApi object in summaryApi.js code while sending userDara in the request body
        data : userData
        
      })
      if(response.data.error){
        toast.error(response.data.message)
      }
      
      if(response.data.success){
        toast.success(response.data.message)
        const userdata =  await fetchUserDetails()
        dispatch(setUserDetails(userdata.data))   //to update details immediately after submission
      }
        ////localStorage.setItem('accesstoken',response.data.data.accesstoken)
        //localStorage.setItem('refreshToken',response.data.data.refreshToken)
        
        
      
    } catch (error) {
      AxiosToastError(error)
    }

  }


  return (
    <div className='p-4'>

        {/**profile upload and display image */}
        <div className='w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
            {
                user.avatar ? (
                    <img 
                      alt={user.name}
                      src={user.avatar}
                      className='w-full h-full'
                    />
                ) : (
                    <FaUser size={50}/>
                )
            }
        </div>
        <button onClick={()=>setProfileAvatarEdit(true)} className='text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-3'>Edit</button>
        
        {
            profileAvatar && (
                <UserProfileAvatar close={()=>setProfileAvatarEdit(false)}/>
            )
        }
        
        {/**name, mobile , email, change password */}
        <form className='my-4 grid gap-4' onSubmit={handleSubmit}>
            <div className='grid'>
                <label>Name</label>
                <input
                    type='text'
                    placeholder='Enter your name' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    value={userData.name}
                    name='name'
                    onChange={handleChange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='email'>Email</label>
                <input
                    type='email'
                    id='email'
                    placeholder='Enter your email' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    value={userData.email}
                    name='email'
                    onChange={handleChange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='mobile'>Mobile</label>
                <input
                    type='text'
                    id='mobile'
                    placeholder='Enter your mobile' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    value={userData.mobile}
                    name='mobile'
                    onChange={handleChange}
                    required
                />
            </div>

            <button className='border px-4 py-2 font-semibold hover:bg-rose-300 border-pink-500 text-black hover:text-neutral-800 rounded'>
                {loading ? "loading..." : "submit"}
            </button>
        </form>
    </div>
  )
}

export default Profile
