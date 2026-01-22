import React, { useState } from "react";
import logo from '../assets/logo.png'
import Search from "./search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiUserSmileFill } from "react-icons/ri";
import useMobile from "../hooks/useMobile";
import { FaOpencart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { GoTriangleUp } from "react-icons/go";
import { GoTriangleDown } from "react-icons/go";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import  DisplayCartItems  from "./DisplayCartItems";

const Header = () => {
    const[isMobile]= useMobile()
    const location =  useLocation()

    const isSearchPage = location.pathname==="/search"
    const navigate = useNavigate()
    const user = useSelector((state)=>state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItems.cart)
    const { totalPrice, totalQty} = useGlobalContext()
     const [openCartSection,setOpenCartSection] = useState(false)

     const fullCartState = useSelector(state => state.cartItems)

    console.log("FULL cartItems state:", fullCartState)


    //console.log('user from store', user)
    console.log("cartItem in header:", cartItem);
    
    const redirectTologin = ()=>{

        navigate("/login")
    }

    const handleCloseUserMenu = ()=>{
        setOpenUserMenu(false)
    }

    const handleMobileUser = ()=>{
        if(!user._id){
            navigate("/login")
            return
        }

        navigate("/user")
    }

    return(
        <header className="h-24 lg:h-20 shadow-md sticky top-0 z-50 flex flex-col justify-center gap-1 bg-white">
            {
               
                !(isSearchPage && isMobile) && (
                    <div className="container mx-auto flex items-center h-full px-2 justify-between">
                    {/**logo */}
                                <div className="h-full">
                                    <Link to={"/"} className="h-full flex justify-center items-center">
                                        <img src={logo}
                                        width={80}
                                        height={10} alt="logo"
                                        className="hidden lg:block"/>
                                        <img src={logo}
                                        width={60}
                                        height={10} alt="logo"
                                        className="lg:hidden"/>
                                    </Link>
                                </div>
                                    <div className="hidden lg:block">
                                        <Search/>
                                    </div>
                    
                                <div className="">
                                        <button className="lg:hidden "onClick={handleMobileUser}>  {/** 'Login' word is displayed in desktop but symbol (user icon) is displayed in desktop */}
                                           <RiUserSmileFill size={20}/> 
                                        </button>
                                        <div className="hidden lg:flex items-center gap-5">  {/**lg-block displays in desktop version but keeps hidden in mobile version*/}
                                            {
                                                user?._id ? (<div className="relative">
                                                        <div onClick={()=>setOpenUserMenu (preve => !preve)} className="flex select-none items-center gap-1 cursor-pointer">
                                                            <p>
                                                                Account
                                                            </p>
                                                            {
                                                                openUserMenu ? (
                                                                    <GoTriangleUp/>
                                                                ):(<GoTriangleDown/>)
                                                            }

                                                        </div>
                                                        {
                                                            openUserMenu && (
                                                                <div className='absolute right-0 top-12'>
                                                                    <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                                                                        <UserMenu close = {handleCloseUserMenu}/>
                                                                        </div>
                                                                    </div>)
                                                            }
                                                    
                                                </div>
                                                ) : (<button onClick={redirectTologin} className="text-lg px-2">Login</button>)
                                            }
                                            
                                            <button onClick={()=>setOpenCartSection(true)} className="flex items-center gap-2 px-2 py-1 hover:bg-rose-100">

                                            <div className="">
                                                <FaOpencart size={25}/>
                                            </div>
                                            <div className='font-semibold text-sm'>
                                                {
                                                    cartItem[0] ? (
                                                        <div>
                                                            <p>{totalQty} Items</p>
                                                            <p>{DisplayPriceInRupees(totalPrice)}</p>
                                                        </div>
                                                    ) : (
                                                        <p>My Cart</p>
                                                    )
                                                }
                                            </div>
                                        </button>
                                        </div>
                                       
                                    </div>
                    
                     </div>
                )
            }
        
           <div className="container mx-auto px-2 lg:hidden">
                <Search/>
           </div>
           {
            openCartSection && (
                <div>
                    <DisplayCartItems close ={()=>setOpenCartSection(false)}/>
                </div>
            )
           }
            
        </header>
    )
}

export default Header