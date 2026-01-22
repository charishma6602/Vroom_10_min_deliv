import React from 'react'
import { useState, useEffect } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import UploadImg from '../utils/uploadImageutil'
import Loading from '../components/Loading.jsx'
import ViewImage from '../components/ViewImage.jsx'
import AddFieldComponent from '../components/AddFieldComponent.jsx'
import { IoClose } from 'react-icons/io5'
import toast from "react-hot-toast";
import Axios from '../utils/Axios.js'
import AxiosToastError from '../utils/AxiosToastError.js'
import SummaryApi from '../common/SummaryApi.js'
import { useSelector,useDispatch } from 'react-redux'
import { setAllCategories, setAllSubCategories } from "../store/productSlice.js"; 


const UploadProduct =() => {
  const [data, setdata] = useState({
    name: "",
    image: [],
    category: [], 
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {}
  })
  const dispatch = useDispatch();
  const [imageLoading, setimageLoading] = useState(false)
  const [viewImageURL, setViewImageURL] = useState("")

  const allCategories = useSelector(state => state.products.allCategories || []) 
  const [selectCategory, setSelectCategory] = useState("")

  //console.log("All categories:", allCategories);

  const allSubCategory = useSelector(state => state.products.allSubCategories || [])
  const [selectSubCategory, setSelectSubCategory] = useState("") 

  //console.log("All subcategories:", allSubCategory);

  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")


  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target;
    setdata((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const fetchCategories = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.get_category,
        });
  
        console.log("Fetched categories:", response.data);
  
        if (response.data?.data) {
          dispatch(setAllCategories(response.data.data));
        }
      } catch (error) {
        console.log("Fetch categories error:", error);
      }
    };
  
    useEffect(() => {
      fetchCategories();
    }, []);

    const fetchSubCategories = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.get_subcategory,
        });
  
        console.log("Fetched subcategories:", response.data);
  
        if (response.data?.data) {
          dispatch(setAllSubCategories(response.data.data));
        }
      } catch (error) {
        console.log("Fetch subcategories error:", error);
      }
    };
     useEffect(() => {
      fetchSubCategories();
    }, []);
  
  
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      AxiosToastError("file upload error, file not found!");
      return;
    }
    setimageLoading(true);
    const response = await UploadImg(file);
    const imageUrl = response.data.data.url;
    setdata((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl]
      }
    })
    setimageLoading(false);
  }

  const handleDeleteImage = async(index) => {
    data.image.splice(index,1)
    setdata((preve)=>{
      return{
        ...preve,
        image : [...data.image]
      }
    })

  }
  const handleRemoveCategory = async (index) => {
    data.category.splice(index,1)
    setdata((preve)=>{
      return{
        ...preve,
        //category : [...data.category]
      }
    })
  }
  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index,1)
    setdata((preve)=>{
      return{
        ...preve,
        //subCategory : [...data.subCategory]
      }
    })

  }
  const handleAddField = () => {
    setdata((preve)=>{
      return{
        ...preve,
        more_details : {
          ...preve.more_details,
          [fieldName] : ""
        }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT DATA:", data)
    try{
      const response = await Axios({
        ...SummaryApi.create_product,
        data:data
    }
      )
      if(response.data.success){
        toast.success(response.data.message)
        //reset form  
        setdata({
          name: "",
          image: [],
          category: [], 
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {}
        })
      }
    } catch (error) {
  console.log("SUBMIT ERROR FULL:", error)

  if (error.response) {
    console.log("STATUS:", error.response.status)
    console.log("RESPONSE DATA:", error.response.data)

    AxiosToastError(error.response.data?.message || "Something went wrong")
  } else {
    console.log("NO RESPONSE ERROR:", error.message)
    AxiosToastError(error.message)
  }
}
  }
  return (
     <section className=''>
        <div className='p-2   bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Upload Product</h2>
        </div>
        <div className='grid p-3'>
            <form className='grid gap-4' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                  <label htmlFor='name' className='font-medium'>Name</label>
                  <input 
                    id='name'
                    type='text'
                    placeholder='Enter product name'
                    name='name'
                    value={data.name}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                  />
                
            </div>
            <div className='grid gap-1'>
                  <label htmlFor='Description' className='font-medium'>Description</label>
                  <textarea 
                    id='Description'
                    type='text'
                    placeholder='Enter product description'
                    name='description'
                    value={data.description}
                    onChange={handleChange}
                    required
                    multiple
                    rows={3}
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none '
                  />
            </div>
            <div>
              <p className='font-medium'>Image</p>
                    <div>
                      <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                          <div className='text-center flex justify-center items-center flex-col'>
                            {
                              imageLoading ?  <Loading/> : (
                                <>
                                   <FaCloudUploadAlt size={35}/>
                                   <p>Upload Image</p>
                                </>
                              )
                            }
                          </div>
                          <input 
                            type='file'
                            id='productImage'
                            className='hidden'
                            accept='image/*'
                            onChange={handleUploadImage}
                          />
                      </label>
                      {/**display uploded image*/}
                      <div className='flex flex-wrap gap-4'>
                        {
                          data.image.map((img,index) =>{
                              return(
                                <div key={img+index} className='h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group'>
                                  <img
                                    src={img}
                                    alt={img}
                                    className='w-full h-full object-scale-down cursor-pointer' 
                                    onClick={()=>setViewImageURL(img)}
                                  />
                                  <div onClick={()=>handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'>
                                    <MdDelete/>
                                  </div>
                                </div>
                              )
                          })
                        }
                      </div>
                    </div>
            </div>
                <div className='grid gap-1'>
                  <label className='font-medium'>Category</label>
                  <div>
                    <select
                      className='bg-blue-50 border w-full p-2 rounded'
                      value={selectCategory}
                      onChange={(e)=>{
                        const value = e.target.value 
                        const category = allCategories.find(el => el._id === value )
                        
                        setdata((preve)=>{
                          return{
                            ...preve,
                            category : [...preve.category,category],
                          }
                        })
                        setSelectCategory("")
                      }}
                    >
                      <option value={""}>Select Category</option>
                      {
                        allCategories.map((c) => {
  return (
    <option key={c._id} value={c._id}>
      {c.name}
    </option>
  )
})

                      }
                    </select>
                    <div className='flex flex-wrap gap-3'>
                      {
                        data.category.map((c,index)=>{
                          return(
                            <div key={c._id+index+"productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                              <p>{c.name}</p>
                              <div className='hover:text-red-500 cursor-pointer' onClick={()=>handleRemoveCategory(index)}>
                                <IoClose size={20}/>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className='grid gap-1'>
                  <label className='font-medium'>Sub Category</label>
                  <div>
                    <select
                      className='bg-blue-50 border w-full p-2 rounded'
                      value={selectSubCategory}
                      onChange={(e)=>{
                        const value = e.target.value 
                        const subCategory = allSubCategory.find(el => el._id === value )

                        setdata((preve)=>{
                          return{
                            ...preve,
                            subCategory : [...preve.subCategory,subCategory]
                          }
                        })
                        setSelectSubCategory("")
                      }}
                    >
                      <option value={""} className='text-neutral-600'>Select Sub Category</option>
                      {
                        allSubCategory.map((c) => {
              return (
                <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                  )
            })

                      }
                    </select>
                    <div className='flex flex-wrap gap-3'>
                      {
                        data.subCategory.map((c,index)=>{
                          return(
                            <div key={c._id+index+"productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                              <p>{c.name}</p>
                              <div className='hover:text-red-500 cursor-pointer' onClick={()=>handleRemoveSubCategory(index)}>
                                <IoClose size={20}/>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className='grid gap-1'>
                  <label htmlFor='unit' className='font-medium'>Unit</label>
                  <input 
                    id='unit'
                    type='text'
                    placeholder='Enter product unit'
                    name='unit'
                    value={data.unit}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='stock' className='font-medium'>Number of Stock</label>
                  <input 
                    id='stock'
                    type='number'
                    placeholder='Enter product stock'
                    name='stock'
                    value={data.stock}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='price' className='font-medium'>Price</label>
                  <input 
                    id='price'
                    type='number'
                    placeholder='Enter product price'
                    name='price'
                    value={data.price}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='discount' className='font-medium'>Discount</label>
                  <input 
                    id='discount'
                    type='number'
                    placeholder='Enter product discount'
                    name='discount'
                    value={data.discount}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                  />
                </div>
                 
                {
                    Object?.keys(data?.more_details)?.map((k,index)=>{
                        return(
                          <div className='grid gap-1'>
                            <label htmlFor={k} className='font-medium'>{k}</label>
                            <input 
                              id={k}
                              type='text'
                              value={data?.more_details[k]}
                              onChange={(e)=>{
                                  const value = e.target.value 
                                  setdata((preve)=>{
                                    return{
                                        ...preve,
                                        more_details : {
                                          ...preve.more_details,
                                          [k] : value
                                        }
                                    }
                                  })
                              }}
                              required
                              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                            />
                          </div>
                        )
                    })
                  }

                <div onClick={()=>setOpenAddField(true)} className=' hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
                  Add Fields
                </div>

                <button
                  className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'
                >
                  Submit
                </button>
                </form>
        </div>
           
        {
          viewImageURL && (
            <ViewImage url={viewImageURL} close={()=>setViewImageURL("")}/>
          )
        }
         {
          openAddField && (
            <AddFieldComponent 
              value={fieldName}
              onChange={(e)=>setFieldName(e.target.value)}
              submit={handleAddField}
              close={()=>setOpenAddField(false)} 
            />
          )
        }

      </section>
  )
}

export default UploadProduct
