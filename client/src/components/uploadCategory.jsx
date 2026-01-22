import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/SummaryApi'
import UploadImg from '../utils/uploadImageutil'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'

const UploadCategory = ({close, fetchData}) => {
  const [data,setdata] = useState({
    name : "",
    image : ""
  })
  const [loading, setloading] = useState(false)
  const handleChange = (e)=>{
    const {name, value} = e.target

    setdata((preve)=>{
      return{
        ...preve,
        [name] : value
      }
    })
  }
  const handleSubmit = async(e) =>{
    e.preventDefault()

    try{
      setloading(true)
      const response = await Axios({
        ...SummaryApi.add_category,
        data : data
      })
      console.log("RESPONSE SUCCESS:", response)
      if(response.data.success){
        toast.success(response.data.message)
        fetchData()
        close()
        
      }
    }catch(error){
      console.log("CAUGHT ERROR:", error)
      AxiosToastError(error)
    }finally {
      setloading(false)
    }
  }

  const handleuploadCategoryImage = async(e)=>{
    const file = e.target.files[0]

    if(!file){
      
        AxiosToastError('file upload error, file not found!')
        return;
    }

    const uploadImage = await UploadImg(file)
    const imageUrl = uploadImage.data.data.url

    setdata((preve)=>{
      return {
        ...preve,
        image: imageUrl
      }
    })
    //console.log("Category image uploaded:", imageUrl)
    
  }
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center'>
      <div className='bg-white max-w-2xl'>
        <div className='flex items-center justify-between'>
          <h1 className='font-semibold'>Category</h1>
          <button onClick={close} className='w-fit block ml-auto'>
          <IoMdClose size={20}/>
          </button> 
        </div>
       <form className='my-3 grid gap-2' onSubmit={handleSubmit}>
        <div className='grid gap-1'>
          <label>Name</label>
          <input type='text'
          id='category_name'
          placeholder='Enter category name'
          value={data.name}
          name='name'
          onChange={handleChange}
          className='bg-blue-100 p-2 border border-blue-200 focus-within:border-rose-300 outline-none rounded'></input>
        </div>
        <div>
          <p>Image</p>
          <div className='flex gap-4 flex-col lg:flex-row items-center'>
            <div className='border bg-blue-100 h-36 w-full lg:w-36 flex items-center justify-center rounded'>
              {
                data.image ? (
                  <img
                    alt='category'
                    src={data.image}
                    className='w-full h-full object-scale-down'
                  />
                ) : (
                  <p className='text-sm text-neutral-500'>No Image</p>
                )
              }
            </div>
            <label htmlFor='uploadCategoryImage'>
              <div className={`${!data.name ? "bg-gray-300" : "border-rose-300 hover:bg-rose-400"} px-4 py-2 rounded cursor-pointer border font-medium`}>
                Upload Image
              </div>

              <input disabled={!data.name} onChange={handleuploadCategoryImage} type='file' id='uploadCategoryImage' className='hidden'></input>
            </label>
          </div>
        </div>

        <button
        className={`
                    ${data.name && data.image ? "bg-primary-200 hover:bg-primary-100" : "bg-gray-300 "}
                    py-2    
                    font-semibold 
                    `}>
                      Add Category
                    </button>
       </form>
      </div>
    </section>
  )
}

export default UploadCategory
