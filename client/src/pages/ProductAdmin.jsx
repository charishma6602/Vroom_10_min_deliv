import React, {useEffect, useState} from "react";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "../components/Loading.jsx";

const ProductAdmin = () => {
    const [productData, setProductData] = useState([]);
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPageCount, setTotalPageCount] = useState(1)
    const [search, setSearch] = useState("")

    const fetchProductData = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.get_product,
                data: {
                    page,
                    limit: 10,
                    search
                }
            });
            if(response.data.success){
                setProductData(response.data.data);
                setTotalPageCount(response.data.totalPages);
            }
            console.log("product page", response.data);

        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchProductData();
    }, [page]);

    const handleNext = () => {
        if(page < totalPageCount){
            setPage(page + 1)
        }
    }
    const handlePrevious = () => {
        if(page > 1){
            setPage(page - 1)
        }
    }
    const handleOnChange = (e) => {
        e.preventDefault()
        setSearch(e.target.value)
        setPage(1)
    }
    useEffect(() => { // debounce search delaying the API call
        let flag = true;
        const delayDebounceFn = setTimeout(() => {
            if(flag){
                fetchProductData();
            flag = false;}
        }, 500) 
        return () => clearTimeout(delayDebounceFn)
    }, [search])

    console.log("product page:",search);
    return (
        <section className=''>
        <div className='p-2   bg-white shadow-md flex items-center justify-between'>
            
                <h2 className='font-semibold'>Product</h2>
                <div className="min-w-[220px] max-w-56 w-full ml-auto bg-blue-50 px-4 flex items-center gap-3 py-2 rounded border focus-within:border-primary-200">
                    <IoSearchOutline size={20} />
                    <input
                     type="text"
                    value={search}
                    onChange={handleOnChange}
                    placeholder="Search Products..."
                    className="bg-transparent outline-none w-full"
                />
                </div>
            
        </div>
        {loading && (<Loading/>)}

        <div className='min-h-[55vh]'>
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
        { Array.isArray(productData) && productData.map((product) => (
  <ProductCardAdmin
    key={product._id}
    data={product}
    fetchProductData={fetchProductData}/>
            ))}
        </div>
             <div className='flex justify-between my-4'>
              <button onClick={handlePrevious} className="border border-primary-200 px-4 py-1 hover:bg-primary-200">Previous</button>
              <button className='w-full bg-slate-100'>{page}/{totalPageCount}</button>
              <button onClick={handleNext} className="border border-primary-200 px-4 py-1 hover:bg-primary-200">Next</button>
            </div>
        </div>
        </section>
    )
}
export default ProductAdmin;