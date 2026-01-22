import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, {Toaster} from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from '../src/utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { useDispatch } from 'react-redux';
import GlobalProvider from './provider/GlobalProvider';
import { setAllCategories, setAllSubCategories, setloadingCategories } from './store/productSlice';
import { handleAddItemCart } from './store/cardProduct';
import CartMobileLink from './components/CartMobile';


function App() {
  const dispatch = useDispatch()
  const location = useLocation();
  
  const fetchUser = async()=>{
    const userData = await fetchUserDetails()
    console.log("User Data", userData.data) //we are fetching user details coming thru the app's state
    dispatch(setUserDetails(userData.data))
    
  }
  
  useEffect(()=>{
    fetchUser()
    //fetchCartItem()
  },[])
  return (
  
  <GlobalProvider>
    <Header/>
   <main className='min-h-[78vh]'>
    <Outlet/>
   </main>
   <Footer/>
   <Toaster/>
   {
        location.pathname !== '/checkout' && (
          <CartMobileLink/>
        )
      }
   </GlobalProvider>
   
  )
}

export default App
