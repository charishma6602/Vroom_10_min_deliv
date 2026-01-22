import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({

    name:{
        type:String,
        default:""
    },
    image:{
        type: Array,
        default: []
    },
    category:[
    {
        type: mongoose.Schema.ObjectId,
        ref:"category"
    }
    ],
    subCategory:[
        {
            type: mongoose.Schema.ObjectId,
            ref:"subCategory"
        }
        ],
    unit: {
        type: String,
        default:""
    },
    stock: {
        type: Number,
        default : null
    },
    price: {
        type: Number,
        default: null
    },
    discount: {
        type: Number,
        default: null
    },
    more_details : {
        type: Object,
        default: {}
    },
    public: {
        type: Boolean,
        default: true
    },

    
},{
    timestamps:true
})
ProductSchema.index({
    name  : "text",
    description : 'text'
},{
    name : 10,
    description : 5
})

const ProductModel = mongoose.model("Product",ProductSchema)

export default ProductModel