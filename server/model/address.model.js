import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    address_line:{
        type: "String",
        default:""
    },
    city:{
        type: "String",
        default: ""
    },
    state:{
        type: "String",
        default: ""
    },
    pincode:{
        type: "String",
        default: ""
    },
    country:{
        type: "String",
        default: ""
    },
    mobile:{
        type: "Number",
        default: 0
    },
    status:{ //we add this too, because when an address is deleted, it won't be deleted permanently
        //we just need to disable that, for that we add 'status' key separately
        type: Boolean,
        default: true
    },
    
        userId:{
            type: mongoose.Schema.ObjectId,
            default: ""
        }
    
    

},{
    timestamps:true
})

const addressModel = mongoose.model("address",addressSchema)

export default addressModel