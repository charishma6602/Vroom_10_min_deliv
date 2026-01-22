import { createContext,useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cardProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/pricewithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);


const GlobalProvider = ({children}) => {
    const dispatch = useDispatch();
    const [totalPrice, setTotalPrice] = useState(0);
    const [notDiscountedPrice, setNotDiscountedPrice] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
    const cartItems = useSelector((state) => state.cartItems.cart);
    const user = useSelector(state => state?.user)

    const fetchCartItem = async () => {
  try {
    console.log("🔥 fetchCartItem called");

    const response = await Axios({
      ...SummaryApi.get_cart_items,
    });

    console.log("🔥 RAW response.data:", response.data);

    if (response.data.success) {
      console.log("🔥 Dispatching cart:", response.data.data);
      dispatch(handleAddItemCart(response.data.data));
    }

  } catch (err) {
    console.log("❌ Error fetching cart items:", err);
  }
};

    const updateCartItem = async (productId, qty) => {
    try {
        const response = await Axios({
            ...SummaryApi.update_cart_item,
            data: {
                _id: productId,
                qty: qty
            }
        });

        const responseData = response.data; // 👈 FIX

        if (responseData.success) {
            fetchCartItem();
        }

        return responseData; // ✅ ALWAYS return

    } catch (err) {
        AxiosToastError(err);
        return { success: false };
    }
};



    const deleteCartItem = async (cartItemId) => {
  try {
    const response = await Axios.delete(
      SummaryApi.delete_cart_item.url,
      {
        data: { _id: cartItemId }
      }
    );

    const responseData = response.data;
    if (responseData.success) {
      fetchCartItem(); // refresh cart
      toast.success("Item removed from cart");
      return responseData;
    }
  } catch (err) {
    AxiosToastError(err);
    return err;
  }
};




    useEffect(()=>{
        const qty = cartItems.reduce((preve,curr)=>{  //???
            return preve + curr.quantity
        },0)
        setTotalQty(qty)
    

    const tPrice = cartItems.reduce((preve,curr)=>{
        return preve + (pricewithDiscount(curr?.productId?.price, curr?.productId?.discount) * curr.quantity)
    },0);
    setTotalPrice(tPrice);
    const ndPrice = cartItems.reduce((preve,curr)=>{
        return preve + ((curr?.productId?.price || 0) * (curr.quantity || 0));
    },0);
    setNotDiscountedPrice(ndPrice)},[cartItems])

    const handleLogout = () => {
        localStorage.clear()
        dispatch(handleAddItemCart([]))
    }
   const fetchAddress = async () => {
  try {
    const response = await Axios.get(SummaryApi.get_address.url)

console.log("FULL RESPONSE:", response)
console.log("response.data:", response.data)
console.log("ACTUAL ARRAY:", response.data.data)

    /console.log("🔥 ADDRESS API DATA:", response.data.data);

    if (response.data.success) {
      dispatch(handleAddAddress(response.data.data));
    }
  } catch (err) {
    AxiosToastError(err);
  }
};

    const fetchOrder = async() => {
        try{
            const response = await Axios({
                ...SummaryApi.get_order,
            });
            const {data : responseData} = response;

            console.log("🔥 fetchOrder API response:", response.data);
            if(response.data.success){
                dispatch(setOrder(response.data.data));
            }

    }catch(err){
        AxiosToastError(err);
        console.log(err)
    }
    }
    useEffect(()=>{
        fetchCartItem();
        //handleLogout();
        fetchAddress();
        fetchOrder();
    },[user])

    return (
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            fetchAddress,
            fetchOrder,
            totalPrice,
            notDiscountedPrice,
            totalQty
        }}
    >
        {children}
    </GlobalContext.Provider>
    )
}

export default GlobalProvider;
