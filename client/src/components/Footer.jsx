import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { RxInstagramLogo } from "react-icons/rx";
import { FaLinkedinIn } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className='border-t '>
      <div className='container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2'>
        <p> &copy; All rights reserved 2025. </p>

        <div className='flex items-center gap-2 justify-center text-2xl'>
            <a href='' className='hover:text-rose-400'>
                <FaFacebook/>
                </a>
            <a href='' className='hover:text-rose-400'>
                <RxInstagramLogo/>
            </a>
            <a href='' className='hover:text-rose-400'>
                <FaLinkedinIn/>
            </a>
            <a href='' className='hover:text-rose-400'>
                <FaWhatsapp/>
            </a>    
        </div>
      </div>
    </footer>
  )
}

export default Footer
