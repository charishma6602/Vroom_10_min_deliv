//this file contains all the summary info of APIs

export const baseURL = import.meta.env.VITE_API_URL

const SummaryApi = {
    register:{
        url : '/api/user/register/',
        method : 'post'
    },
    login : {
        url:'/api/user/login',
        method : 'post'
    },
    forgot_password :{
        url : '/api/user/forgot-password',
        method : 'put'
    },
    verify_forgot_password :{
        url : '/api/user/verify-forgot-password',
        method : 'put'
    },
    reset_password : {
        url : '/api/user/reset-password',
        method : 'put'
    },
    refresh_token:{
        url : '/api/user/refresh-token',
        method : 'put'
    },
    user_profile : {
        url : '/api/user/user-profile',
        method : 'get'
    },
    logout:{
        url : '/api/user/logout',
        method : 'get'
    },
    updateUserdetails : {
        url : '/api/user/update-user',
        method : 'put'
    },
    update_avatar : {
        url : '/api/user/upload-avatar',
        method : 'put'
    },
    get_product : {
        url : '/api/user/get',
        method : 'post'
    },
    add_category : {
        url : '/api/category/add-category',
        method : 'post'
    },
    get_category : {
        url : '/api/category/get-category',
        method : 'get'
    },
    edit_category : {
        url : '/api/category/update-category',
        method : 'put'
    },
    delete_category : {
        url : '/api/category/delete-category',
        method : 'delete'
    }, 
    get_subcategory : {
        url : '/api/subcategory/get-subcategory',
        method : 'get'
    },
    upload_image : {
        url : '/api/file/upload',
        method : 'post'
    }
    ,
    add_subcategory : {
        url : '/api/subcategory/add-subcategory',   
        method : 'post'
    },
    edit_subcategory : {    
        url : '/api/subcategory/update-subcategory',
        method : 'put'
    },
    delete_subcategory : {
        url : '/api/subcategory/delete-subcategory',
        method : 'delete'
    },
    create_product : {
        url : '/api/product/create-product',
        method : 'post'
    },
    get_product : {
        url : '/api/product/get-product',
        method : 'post'
    },
    delete_product : {
        url : '/api/product/delete-product',
        method : 'delete'
    },
    update_product : {
        url : '/api/product/update-product',
        method : 'put'
    },
    getProductByCat : {
        url : '/api/product/get-product-by-category',
        method : 'post'
    },
    getProductByCatAndSubCat : {
        url : '/api/product/get-product-by-category-and-subcategory',
        method : 'post'
    },
    get_product_details : {
        url : '/api/product/get-product-details',
        method : 'post'
    },
    add_to_cart : {
        url : '/api/cart/add-to-cart',
        method : 'post'
    },
    get_cart_items : {
        url : '/api/cart/get-cart-items',
        method : 'get'
    },
    update_cart_item : {
        url : '/api/cart/update-cart-item',
        method : 'put'
    },
    delete_cart_item : {
        url : '/api/cart/delete-cart-item',
        method : 'delete'
    },
    cash_on_delivery_order : {
        url : '/api/order/cash-on-delivery',
        method : 'post'
    },
    payment_url : {
        url : '/api/order/checkout',
        method : 'post'
    },
    get_order :{
        url : 'api/order/order-list',
        method : 'get'
    },
    add_address : {
        url : '/api/address/add-address',
        method : 'post'
    },
    update_address : {
        url : '/api/address/update-address',
        method : 'put'
    },
    delete_address : {
        url : '/api/address/delete-address',
        method : 'delete'
    },
    get_address : {
        url : '/api/address/get-address',
        method : 'get'
    },
}

export default SummaryApi