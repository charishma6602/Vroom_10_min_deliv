import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Divider from './Divider'
import { useNavigate, Link } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import {logout} from '../store/userSlice'
import toast, {Toaster} from 'react-hot-toast';
import Axios from '../utils/Axios'
import {HiOutlineExternalLink} from "react-icons/hi"

const UserMenu = ({close}) => {
    const user = useSelector((state)=> state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async()=>{
        try{
            const response = await Axios({
                ...SummaryApi.logout
            })
            console.log("logout", response)
            if(response.data.success){
                if(close){
                    close()
                }
            }
            dispatch(logout())
            localStorage.clear()
            toast.success(response.data.message)
            navigate("/")
        }catch(error){
            console.log(error)
            AxiosToastError(error)
        }
    }

    const handleClose =()=>{
      if(close){
        close()
      }
    }

  return (
    <div>
      <div className='font-semibold'>My Account</div>
      <div className='text-sm flex items-center gap-2'>
        <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile}<span className='text-medium text-red-300'> {user.role === "ADMIN"? "(Admin)" : ""}</span></span>
        <Link onClick={handleClose} to= {"/dashboard/profile"} className='hover:text-shadow-rose-300'>
          <HiOutlineExternalLink size={10} />
        </Link>
          
        </div>

      <Divider/>

      <div className='text-sm grid gap-2'>
        <Link onClick={handleClose} to={"/dashboard/myorders"} className=' hover:bg-pink-300'>My Orders</Link>
        <Link onClick={handleClose} to={"/dashboard/addresses"}className=' hover:bg-pink-300'>Saved Addresses</Link>
        { user.role === "ADMIN" && (<Link onClick={handleClose} to={"/dashboard/product"}className=' hover:bg-pink-300'>Product</Link>)}
        { user.role === "ADMIN" &&
        (<Link onClick={handleClose} to={"/dashboard/upload-product"}className=' hover:bg-pink-300'>Upload Product</Link>)}
       {
          user.role === "ADMIN" && (
            <Link onClick={handleClose} to={"/dashboard/category"}className=' hover:bg-pink-300'>Category</Link>
          )
        }
        {
          user.role === "ADMIN" && (
                    <Link onClick={handleClose} to={"/dashboard/subcategory"}className=' hover:bg-pink-300'>subCategory</Link>

          )
        }
        
        <button onClick={handleLogout} className='text-left cursor-pointer'>Log out</button>
      </div>
    </div>
  )
}

export default UserMenu
