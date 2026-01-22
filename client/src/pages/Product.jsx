import React, { useEffect, useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
const Product = () => {
    const [productData, setproductData] = useState([])
    const [page, setPage] = useState(1)

    const fetchProductData = async()=>{
        try{
            const response = await Axios({
                ...SummaryApi.get_product,
                data : {
                    page : page  //send a body in the request with changable data of JSON called "page" as a key
                }
            })

        console.log("product page", response.data)

        if(response.data.success){
        setproductData(response.data.data)
    }
        }catch(error){
            AxiosToastError(error)
        }
    }
    
    console.log("product page")
    useEffect(()=>{
        fetchProductData()
    },[])

  return (
    <div>
      Product
    </div>
  )
}

export default Product
