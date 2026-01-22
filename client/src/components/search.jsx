import React, { useEffect, useState } from 'react'
import { BsSearchHeart } from "react-icons/bs";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { IoIosArrowDropleftCircle } from "react-icons/io";
import useMobile from '../hooks/useMobile';

const Search = () => {

    const navigate = useNavigate()
    const location = useLocation()
    
    const [isSearchPage, setIsSearchPage] = useState(false)
    const [isMobile]=useMobile()

    

    useEffect(()=>{
    const isSearch = location.pathname === "/search"
    setIsSearchPage(isSearch)},[location])

     const redirectTosearchPage = ()=>{
        navigate("/search")
    }
    //console.log("search",isSearchPage)
    
  return (
    <div className='w-full bg-rose-100 min-w-[300px] lg:min-w-[420px]  h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center group focus-within:border-rose-500 '>
        

        {
            (isSearchPage && isMobile)?(<Link to= {"/"} className='flex justify-center items-center h-full p-3 text-neutral-500 group-focus-within:text-slate-600'>
                                        <IoIosArrowDropleftCircle/>
                                            </Link>):
            (<button className='flex justify-center items-center h-full p-3 text-neutral-500 group-focu-within:text-slate-600'>
                    <BsSearchHeart size={20}/>
                </button>)
        }
        
        <div className='w-full h-full'>
            {
                !isSearchPage ? (
                    //not in search page
                    <div onClick={redirectTosearchPage} className='w-full h-full flex items-center'>
        <TypeAnimation
            sequence={[
                // Same substring at the start will only be typed out once, initially
                'Search "milk"',
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                'Search "bread"',
                1000,
                'Search "chicken"',
                1000,
                'Search "onions"',
                1000
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
        />
        </div>

                ):( //when I'm in search page
                    <div className='w-full h-full'>
                         <input
                            type='text'
                            placeholder='Search for atta,dal and more...'
                            autoFocus
                            className='bg-transparent w-full h-full outline-none'
                         />
                    </div>
                )
        }
        </div>
        <div>

        </div>
        
      </div>
    
  )
}

export default Search
