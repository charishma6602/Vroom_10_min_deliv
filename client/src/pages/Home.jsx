import React,{ useEffect }  from 'react'
import banner from '../assets/banner.jpg'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Axios from '../utils/Axios.js'
import { validURLConvert } from '../utils/validURLConvert'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import {setAllCategories, setAllSubCategories, setloadingCategories} from '../store/productSlice'
import { useDispatch } from 'react-redux'
import SummaryApi from '../common/SummaryApi'

const Home = () => {
  const loadingCategories = useSelector((state) => state.products.loadingCategories);
  const categorydata = useSelector((state) => state.products.allCategories);
  const subcategorydata = useSelector((state) => state.products.allSubCategories);
  const navigate = useNavigate();

  console.log("loadingCategories:", loadingCategories);
  console.log("categorydata:", categorydata);
  console.log("subcategorydata:", subcategorydata);

  const dispatch = useDispatch();

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      dispatch(setloadingCategories(true));

      const categoryRes =  await Axios({
          ...SummaryApi.get_category,
        });
      const subCategoryRes = await Axios({
          ...SummaryApi.get_subcategory,
        });

      dispatch(setAllCategories(categoryRes.data.data || []));
      dispatch(setAllSubCategories(subCategoryRes.data.data || []));
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      dispatch(setloadingCategories(false));
    }
  };

  fetchCategories();
}, [dispatch]);

  const handleRedirectProductListpage = (id,cat) => {
    console.log("id:",id, "cat:",cat)
    if (!subcategorydata || subcategorydata.length === 0) return;
    const subcategory = subcategorydata.find(sub => {const filterData = sub.category.some(c => {
          return c._id == id
        })
        return filterData ? true : false
      });
    console.log(subcategory)
    if (!subcategory) return;



    const url = `/${validURLConvert(cat)}-${id}/${validURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);
    console.log(url)
  }
  return (
    <section>
    <div className='min-h-48 container mx-auto rounded my-4 px-4'>
      <div className={`w-full h-full min-h-48  bg-rose-100 rounded animate-pulse`}>
        <img
          src={banner}
          alt="banner"
          className="w-full h-48 object-cover rounded"
        />
      </div>
    </div>
    <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10  gap-2'>
      {
  loadingCategories
    ? new Array(12).fill(null).map((_, index) => (
        <div
          key={index + "loadingcategory"}
          className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse"
        >
          <div className="bg-blue-100 min-h-24 rounded"></div>
          <div className="bg-blue-100 h-8 rounded"></div>
        </div>
      ))
    : categorydata?.map((cat) => (
        <div
          key={cat._id + "displayCategory"}
          className="w-full h-full cursor-pointer"
          onClick={() =>
            handleRedirectProductListpage(cat._id, cat.name)
          }
        >
          <img
            src={cat.image}
            className="w-full h-full object-scale-down"
            alt={cat.name}
          />
        </div>
      ))
}

    </div>
    { /*** display category products */}
    {
      categorydata?.map((cat)=>{
        return (
          <CategoryWiseProductDisplay 
            key={cat?._id+"homecategorywiseproductdisplay"} 
            id={cat?._id} 
            name={cat?.name} 
          />
        )
    })
  }
    </section>   
  )
}

export default Home
