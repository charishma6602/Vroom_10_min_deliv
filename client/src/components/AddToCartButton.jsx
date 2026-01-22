import React, { useEffect, useState } from 'react'
import GlobalProvider, { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useDispatch } from 'react-redux'
import { handleAddItemCart } from '../store/cardProduct'

const AddToCartButton = ({data}) => {
    const {fetchCartItem, updateCartItem, deleteCartItem} = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const cartItems = useSelector((state) => state?.cartItems?.cart );
    const [isAvailableCart, setIsAvailableCart] = useState(false);
    const [qty, setQty] = useState(0);
    const [cartItemDetails, setCartItemDetails] = useState(null);
    //const dispatch = useDispatch()

    const handleAddtoCart = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        //dispatch(handleAddItemCart(data))
        console.log("DISPATCHED PRODUCT:", data)
        try{
             
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.add_to_cart,
                data : {
                    productId : data._id,
                    qty : 1
                }
            });
            const {data : responseData} = response;
            if(responseData.success){
                toast.success("Item added to cart successfully");
                if(fetchCartItem){
                    fetchCartItem();
                }
        }
    } catch (error){
        AxiosToastError(error);
    } finally {
        setLoading(false);
    }

    }  
    
    useEffect (()=>{
        const checkingItem = cartItems.some(item => item.productId._id === data._id);
        setIsAvailableCart(checkingItem);

        const product = cartItems.find(item => item.productId._id === data._id);
        setQty(product?.quantity || 0);
        setCartItemDetails(product || null);
    }, [cartItems])


    const increaseQty = async(e) => {
        e.preventDefault();
        e.stopPropagation();

        const response = await updateCartItem(cartItemDetails?._id, qty + 1);
        console.log("INCREASE RESPONSE:", response)
        if(response.success){
            toast.success("Quantity increased");
        }
    }

    const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (qty === 1) {
        console.log("Deleting item from cart, details:", cartItemDetails);

        const response = await deleteCartItem(cartItemDetails?._id);

        console.log("Delete response:", response);

        if (response?.success) {
            await fetchCartItem();   // 🔥 THIS IS THE KEY
            toast.success("Item removed from cart");
        }
    } else {
        const response = await updateCartItem(cartItemDetails?._id, qty - 1);
        if (response.success) {
            toast.success("Quantity decreased");
        }
    }
};

    return (
        <div className='w-full max-w-[150px]'>
            {
                isAvailableCart ? (
                    <div className='flex w-full h-full'>
                        <button onClick={decreaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaMinus /></button>

                        <p className='flex-1 w-full font-semibold px-1 flex items-center justify-center'>{qty}</p>

                        <button onClick={increaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaPlus /></button>
                    </div>
                ) : (
                    <button onClick={handleAddtoCart} className='bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded'>
                        {loading ? <Loading /> : "Add"}
                    </button>
                )
            }

        </div>
    )
}
export default AddToCartButton

