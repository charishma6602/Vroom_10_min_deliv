import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateAvatar } from '../store/userSlice'
import { FaUser } from "react-icons/fa";
import { IoMdClose } from 'react-icons/io'

const UserProfileAvatar = ({close}) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [loading, setloading] =useState(false)  //loading is false, meaning profile yet to be uploaded, old or new
    //loading is true, meaning, profile is in the process of uploading

    const handleSubmit = (e)=>{
        e.preventDefault() //prevent default reload of the page during form submissions
    }
    const handleuploadAvatar = async(e) => {
        const file = e.target.files[0]

        if(!file){
            return
        }

        const formData = new FormData()
        formData.append('avatar',file)

        try{
            setloading(true)
            const response = await Axios({
                ...SummaryApi.update_avatar,
                data: formData
            })

            dispatch(updateAvatar(response.data.data.avatar))
            console.log("Avatar updated to:", response.data.data.avatar)
        }catch(error){
            AxiosToastError(error)
        }finally{
            setloading(false)
        }

    }

  return (
     <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center'>
        <div className='bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center'>
            <button onClick={close} className='text-neutral-800 w-fit block ml-auto'>
                <IoMdClose size={20}/>
            </button>
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
            <form onSubmit={handleSubmit}>
                <label htmlFor='uploadProfile'>
                    <div className='border border-primary-200 cursor-pointer hover:bg-primary-200 px-4 py-1 rounded text-sm my-3'>
                        {
                            loading ? "Loading..." : "Upload"
                        }
                    </div>
                    <input onChange={handleuploadAvatar} type='file' id='uploadProfile' className='hidden'/>
                </label>
            </form>
            
        </div>
    </section>
  )
}

export default UserProfileAvatar
