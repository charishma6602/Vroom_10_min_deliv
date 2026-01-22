import React, { useEffect,useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { validURLConvert } from "../utils/validURLConvert";
import { useSelector } from "react-redux";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import Axios from "../utils/Axios";
import  SummaryApi  from "../common/SummaryApi";
import  AxiosToastError  from "../utils/AxiosToastError";
import ProductCard from "./ProductCard";
import CardLoading from "./CardLoading";

const CategoryWiseProductDisplay = ({id, name}) => {
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);
    const subcategorydata = useSelector((state) => state.products.allSubCategories);
    const containerRef = useRef(null);
    const loadingCardNumber = new Array(8).fill(null);
    const fetchCategoryProducts = async() => {
        try{
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getProductByCat,
                data:{
                    id : id
                }
            });
            if(response.data.success)
                {
                    setData(response.data.data);
                }
        }catch(err){
            console.log("Error fetching category products", err);
            AxiosToastError(err);
        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchCategoryProducts();
    },[])
    const handleScrollRight = () => {
        containerRef.current.scrollLeft+=200
    }
    const handleScrollLeft = () => {
        containerRef.current.scrollLeft-=200
    }

    const handleRedirectProductListpage = () => {
        if (!subcategorydata?.length) return "#";

        const subcategory = subcategorydata.find(sub =>
        sub.category?.some(c => c._id === id)
        );

        if (!subcategory) return "#";

        return `/${validURLConvert(name)}-${id}/${validURLConvert(subcategory.name)}-${subcategory._id}`;
    }


        const redirectURL = handleRedirectProductListpage()
        return (
            <div>
                <div className="container mx-auto p-4 flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
                    <Link to={redirectURL} className="text-green-600 hover:text-teal-500">All</Link>
                </div> 
                <div className="relative flex items-center">
                    <div className='flex gap-4 md:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth' ref={containerRef}>
                        {
                            loading && loadingCardNumber.map((_,index)=>{
                                return (
                                    <CardLoading key = {index+"categorywiseproductloading"}/>
                                )
                            }
                                )
                            }
                        
                        {
                            data && data.map((product,index)=>{
                                return (
                                    <ProductCard product={product}
                                    key={product._id + "CategorywiseProductDisplay" + index}/>
                                )
                            })
                        }
                    </div>
                    <div className="w-full left-0 right-0 container -mx-auto px-2 absolute hidden lg:flex justify-between">
                        <button onClick={handleScrollLeft} className="bg-white p-2 rounded-full shadow hover:shadow-lg">
                            <FaAngleLeft />
                        </button>
                        <button onClick={handleScrollRight} className="bg-white p-2 rounded-full shadow hover:shadow-lg">
                            <FaAngleRight />
                        </button>

                    </div>
                </div>
            </div>
        )
    }
    

export default CategoryWiseProductDisplay;
