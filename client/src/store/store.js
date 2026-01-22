import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import productReducer from './productSlice'
import cartReducer from './cardProduct'
import addressReducer from './addressSlice'
import orderReducer from './orderSlice'

export const store = configureStore({
  reducer: {
    user : userReducer,
    products : productReducer,
    cartItems : cartReducer,
    address : addressReducer,
    order : orderReducer
  }
});