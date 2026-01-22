import React from 'react'
import { IoIosClose } from "react-icons/io";
import UserMenu from '../components/UserMenu';


const UserMenuMobile = () => {
  return (
    <section className='bg-white h-full w-full py-2'>
        <button onClick={()=>window.history.back()} className='text-neutral-700 block w-fit ml-auto'>
        <IoIosClose size={20}/>
        </button>
        <div className='container mx-auto px-3 pb-8'>*/
        <UserMenu/>
        </div>
      
    </section>
  )
}

export default UserMenuMobile
