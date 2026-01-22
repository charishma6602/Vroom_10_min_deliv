import React, {useEffect, useState} from "react";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { validURLConvert } from "../utils/validURLConvert";

const ProductList = () => {
    
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const params = useParams();
    const AllSubCategory = useSelector((state) => state.products.allSubCategories);
    const [DisplaySubCategory, setDisplaySubCategory] = useState([]);
    const { category, subCategory } = useParams();

    console.log(AllSubCategory);

    const categoryId = category?.split("-")?.pop();
    const subCategoryId = subCategory?.split("-")?.pop();

    const subCategoryName = subCategory
        ?.split("-")
        ?.slice(0, -1)
        ?.join(" ");  //???

    const fetchProductData = async()=>{
        try{
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getProductByCatAndSubCat,
                data : {
                    categoryId: categoryId,
                    subCategoryId: subCategoryId,
                    page: page,
                    limit: 8,
                }
            });
        console.log("product page", response.data);

        if(response.data.success){
        if (response.data.page == 1) {
          setData(response.data.data)
        } else {
          setData([...data, ...response.data.data])
        }
        setTotalPages(response.data.totalCount)
    }
        }
        catch(error){
            AxiosToastError(error)
        } finally {
        setLoading(false);
        }
    }
    useEffect(()=>{
        fetchProductData()
    }, [params])

    useEffect(() => {
    if (!AllSubCategory || AllSubCategory.length === 0) return;
    const sub = AllSubCategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id == categoryId
      })

      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory])
    console.log("DisplaySubCategory:", DisplaySubCategory);

    return (
        <section className='sticky top-24 lg:top-20'>
      <div className='container sticky top-24  mx-auto grid grid-cols-[90px,1fr]  md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]'>
        {/**sub category **/}
        <div className=' min-h-[88vh] max-h-[88vh] overflow-y-scroll  grid gap-1 shadow-md scrollbarCustom bg-white py-2'>
          {
            DisplaySubCategory.map((s, index) => {
               const link = `/${validURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${validURLConvert(s.name)}-${s._id}`
              return (
                <Link to={link} className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b 
                  hover:bg-green-100 cursor-pointer
                  ${subCategoryId === s._id ? "bg-green-100" : ""}
                `}
                >
                  <div className='w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded  box-border' >
                    <img
                      src={s.image}
                      alt='subCategory'
                      className=' w-14 lg:h-14 lg:w-12 h-full object-scale-down'
                    />
                  </div>
                  <p className='-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base'>{s.name}</p>
                </Link>
              )
            })
          }
        </div>


        {/**Product **/}
        <div className='sticky top-20'>
          <div className='bg-white shadow-md p-4 z-10'>
            <h3 className='font-semibold'>{subCategoryName}</h3>
          </div>
          <div>

           <div className='min-h-[80vh] max-h-[80vh] overflow-y-auto relative'>
            <div className=' grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4 '>
                {
                  data.map((p, index) => {
                    return (
                      <ProductCard
                        product={p}
                        key={p._id + "productSubCategory" + index}
                      />
                    )
                  })
                }
              </div>
           </div>

            {
              loading && (
                <Loading />
              )
            }

          </div>
        </div>
      </div>
    </section>
  )
}
export default ProductList;