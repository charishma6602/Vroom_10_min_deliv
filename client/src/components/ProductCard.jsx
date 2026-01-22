import React, {useState} from "react";
import { Link } from "react-router-dom";
import { validURLConvert } from "../utils/validURLConvert";
import { DisplayPriceInRupees} from "../utils/DisplayPriceInRupees";
import { pricewithDiscount } from "../utils/pricewithDiscount";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product }) => {
    const url = `/product/${validURLConvert(product.name)}-${product._id}`
    const [loading,setLoading] = useState(false);

    return (
        <Link to={url} className="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white">
            <div className="flex justify-center">
                <img src={product.image} alt={product.name} className="w-24 h-24 object-contain" />
            </div>
            <div className='flex items-center gap-1'>
        <div className='rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50'>
              10 min 
        </div>
        <div>
            {
              Boolean(product.discount) && (
                <p className='text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full'>{product.discount}% discount</p>
              )
            }
        </div>
      </div>
      <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2'>
        {product.name}
      </div>
      <div className='w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base'>
        {product.unit} 
        
      </div>

      <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
        <div className='flex items-center gap-1'>
          <div className='font-semibold'>
              {DisplayPriceInRupees(pricewithDiscount(product.price,product.discount))} 
          </div>
          
          
        </div>
        <div className=''>
          {
            product.stock == 0 ? (
              <p className='text-red-500 text-sm text-center'>Out of stock</p>
            ) : (
              <AddToCartButton data={product} />
            )
          }
            
        </div>
      </div>
        </Link>
    )
}
export default ProductCard;