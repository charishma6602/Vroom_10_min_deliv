import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Searchpage from "../pages/Searchpage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerify from "../pages/OtpVerify";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import Myorders from "../pages/Myorders";
import Address from "../pages/Address";
import ProductAdmin from "../pages/ProductAdmin";
import Category from "../pages/Category";
import SubCategory from "../pages/SubCategory";
import UploadProduct from "../pages/UploadProduct";
import AdminPerm from "../layouts/AdminPerm";
import ProductList from "../pages/ProductList";
import ProductDisplay from "../pages/ProductDisplay";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";


//router handles all the routes without reloading the page for the website.
//here you are firstly handling the route to '/' creating path and corresponding element to 'App'
const router = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children :[
            {
                path:"",
                element:<Home/>
            },
            {
                path:"search",
                element:<Searchpage/>
            },
            {
                path:"login",
                element:<Login/>
            },
            {
                path:"register",
                element:<Register/>
            },
            {
                path:"forgot-password",
                element:<ForgotPassword/>
            },
            {
                path : "verify-forgot-password",
                element:<OtpVerify/>
            },
           {
                path : "reset-password",
                element:<ResetPassword/>
            },
            {
                path : "user",         //this path is only for mobile versions
                element : <UserMenuMobile/>     
            },
            {
                path: "dashboard",
                element :  <Dashboard/>,
                children : [
                    {
                        path : "profile",
                        element : <Profile/>
                    },
                    {
                        path : "myorders",
                        element : <Myorders/>
                    },
                    {
                        path : "addresses",
                        element : <Address/>
                    },
                    {
                        path : "product",
                        element : <AdminPerm><ProductAdmin/></AdminPerm>
                    },
                    {
                        path : "category",
                        element : <AdminPerm><Category/></AdminPerm>
                    },
                    {
                        path : "subcategory",
                        element : <AdminPerm><SubCategory/></AdminPerm>
                    },
                    {
                        path : "upload-product",
                        element : <AdminPerm><UploadProduct/></AdminPerm>
                    },
                    

                ]

            },
            {
                        path : ":category",
                        children : [
                            {
                                path : ":subcategory",
                                element : <ProductList/>
                            }
                            
                        ]
                    },
                    {
                        path : "product/:product",
                        element : <ProductDisplay/>
                     },
                     {
                        path : "cart",
                        element : <CartPage/>
                     },
                     {
                        path : "checkout",
                        element : <CheckoutPage/>
                     },
                     {
                        path : "success",
                        element : <Success/>
                     },
                     {
                        path : "cancel",
                        element : <Cancel/>
                     }


        ]
    }
])

export default router