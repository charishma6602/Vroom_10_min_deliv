import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    orderId:{
        type: String,
        required: [true, "Provide orderId"],
        unique : true
    },
    productId:{
        type: mongoose.Schema.ObjectId,
        ref: "product"
    },  
    product_details: {//during payment, we just need name and images,if you add  _id also, it'll increase the payload, which in turn takes some time
        //so for optimization, we used a seperate key value pair for product_id
        name: String,
        image : Array   //here we are not directly assigning an array (using []), but a sub type is assigned as array
    },
    paymentId:{
        type: String,
        default:""
    },
    payment_status:{
        type:String,
        default :""      
    },
    delivery_address:{
        type: mongoose.Schema.ObjectId,
        ref:"address"
    },
    subTotalAmt:{
        type:Number,
        default:null
    },
    totalAmt:{
        type:Number,
        default:null
    },
    invoice_receipt:{
        type:String,
        default:""
    },


},{
    timestamps:true
})

const OrderModel = mongoose.model("order",OrderSchema)

export default OrderModel