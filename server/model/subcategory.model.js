import mongoose from 'mongoose';

const subCatergory = new mongoose.Schema({
    name:{
        type: String,
        default: ""
    },
    image:{
        type: String,
        default : ""
    },
    category:[
        {
            type: mongoose.Schema.ObjectId,
            ref : "category"
        }
    ]
    
},{
    timestamps:true
})

const SubCategoryModel = mongoose.model('subCategory',subCatergory) //same name as 'SubCategory' in product.model.js file under category section

export default SubCategoryModel