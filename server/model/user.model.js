//this is the file the users collection (table) in mongodb



import mongoose from "mongoose";

const userSchema = new mongoose.Schema({   //which type of data you want to store in table/collection is represented by schema
    name : {
        type: String,
        require: [true, "Provide name"]
    },
    email :{
        type: String,
        require:[true, "Provide email"]
    },
    password: {
        type: String,
        require:[true, "Provide password"]
    },
    avatar: {
        type : String,
        default : ""
    },
    mobile: {
        type: Number,
        default: null
    },
    refresh_token: {
        type : String,
        default : ""
    },
    verify_email: {
        type : Boolean,
        default : false 
    },
    last_login:{
        type: Date,
        default : ""
    },
    status :{
        type: String,
        enum : ["Active","Inactive", "Suspended"],
        default: "Active"
    },
    address_details:[
        {type:mongoose.Schema.ObjectId,  //array of objects are stored
         ref : 'address',
        }
    ] ,  
    shopping_cart:[
        {type:mongoose.Schema.ObjectId,  //array of objects are stored
         ref : 'cartProduct',
        }
    ] ,  
    orderHistory:[
        {type:mongoose.Schema.ObjectId,  //array of objects are stored
         ref : 'order',
        }
    ] ,  
    forgot_password_otp:{
        type:String,
        default: null
    },
    forgot_password_expiry:{
        type:Date,
        default: ""
    },
    role:{
        type: String,
        enum : ['ADMIN','USER'],
        default:'USER'
    },

    

},{
    timestamps:true   //this line gives the output of createdAt and updatedAt fields of the user profile
}) 

const UserModel = mongoose.model("User", userSchema)  // in c++, how we create object of a class, here we created object (UserModel) of a schema (userSchema)

export default UserModel