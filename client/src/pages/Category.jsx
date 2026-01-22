import React, { useEffect, useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import UploadCategory from '../components/uploadCategory'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'
import NoData from '../components/NoData'
import EditCategory from '../components/EditCategory'
import Confirmbox from '../components/Confirmbox'

const Category = () => {

    const [OpenuploadCategory, setuploadCategory] = useState(false)
    const [category, setcategory] =  useState([])
    const [loading, setloading] = useState(false)
    const [openEdit, setopenEdit] = useState(false)
    const [editData, seteditData] = useState({
        name:"",
        image : ""
    })
    const [openConfirmBoxDelete, setopenConfirmBoxDelete] = useState(false)
    const [deleteCategory, setdeleteCategory] = useState({
        _id: ""
    })


    const fetchCategory = async()=>{
        try{
            setloading(true)
            const response = await Axios ({
                ...SummaryApi.get_category
            })

            const {data : responseData}=  response
            console.log("Fetch is successful:", responseData);

            if(responseData.success){
                setcategory(responseData.data)
                console.log("CATEGORY DATA:", responseData.data);
            }
        } catch(error){
            AxiosToastError(error)
        }finally{
            setloading(false)
        }
    }
    useEffect(()=>{
        fetchCategory()
    },[])

    const handleDeleteCategory= async()=>{
        try{
            const response = await Axios({
                ...SummaryApi.delete_category,
                data : deleteCategory
            })

            const {data: responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCategory()
                setopenConfirmBoxDelete(false)
            }

        }catch(error){
            AxiosToastError(error)
        }
    }
  return (
    <section>
        <div className='p-5 bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Category</h2>
            <button onClick={()=>{setuploadCategory(true)}} className='text-sm border border-red-300 hover:bg-rose-400 px-3 py-1 rounded'>Add Category</button>
        </div>
        {
            !category[0] && !loading && (
            <NoData/>
        )
        }

        <div className='p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4'>
            {
                category.map((category,index)=>{
                    return(
                        <div className='w-32 h-56 rounded shadow-md' key={category._id}>
                            <img
                            alt={category.name}
                            src={category.image}
                            className='w-full object-scale-down'
                            />

                        <div className='items-center h-9 flex gap-2'>
                            <button onClick={() => {
                                setopenEdit(true)
                                seteditData(category)
                            }} className='flex-1 bg-slate-600 text-white hover:bg-pink-400 font-medium py-1 rounded'>
                                Edit
                                     </button>

                            <button onClick={() => {
                                        setopenConfirmBoxDelete(true)
                                        setdeleteCategory(category)
                                }} className='flex-1 bg-red-500 text-white hover:bg-pink-400 font-medium py-1 rounded'>
                                    Delete
                                    </button>
                            </div>

                        </div>
                    )
                })
            }

        </div>
        {
            loading && (
                <Loading/>
            )
        }
        {
            OpenuploadCategory && ( <UploadCategory fetchData={fetchCategory} close ={()=>setuploadCategory(false)}/>)
        }
        {
            openEdit && ( <EditCategory editData={editData} fetchData={fetchCategory} close ={()=>setopenEdit(false)}/>)
        }
        {
            openConfirmBoxDelete && ( <Confirmbox
                close ={()=>setopenConfirmBoxDelete(false)}
                cancel ={()=>setopenConfirmBoxDelete(false)}
                confirm ={handleDeleteCategory}
            />)
        }
    </section>
  )
}

export default Category
