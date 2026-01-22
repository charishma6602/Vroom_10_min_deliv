import addressModel from "../model/address.model.js";
import UserModel from "../model/user.model.js";

export const addAddressController = async (req,res) => {
    try {
        const userId = req.userId;
        const {address_line, city, state, pincode, country, mobile} = req.body;
        const newAddress = new addressModel({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId : userId,
            status: true
     
        });
        const savedAddress = await newAddress.save();

        const addUserAddressId = await UserModel.findByIdAndUpdate(userId, {
            $push : { address_details : savedAddress._id },
        });

        return res.status(201).send({message:"Address added successfully", success:true, error:false, data:savedAddress});
    } catch (error) {
        console.log("Error in addAddressController:", error);
        return res.status(500).send({message:"Error adding address", success:false, error:true});
    }
}

export const getAddressController = async (req,res) => {
    try {
        const userId = req.userId;
        const addresses = await addressModel.find({userId : userId}).sort({createdAt : -1});
        return res.status(200).send({message:"Addresses fetched successfully", success:true, error:false, data:addresses});
    } catch (error) {
        console.log("Error in getAddressController:", error);
        return res.status(500).send({message:"Error fetching addresses", success:false, error:true});
    }
}

export const deleteAddressController = async (req,res) => {
    try {
        const userId = req.userId;
        const { _id } = req.body;
        const deletedAddress = await addressModel.updateOne({ _id : _id, userId : userId }, { status: false });
        return res.status(200).send({message:"Address deleted successfully", success:true, error:false, data:deletedAddress});
    } catch (error) {
        console.log("Error in deleteAddressController:", error);
        return res.status(500).send({message:"Error deleting address", success:false, error:true});
    }
}

export const updateAddressController = async (req,res) => {
    try {
        const userId = req.userId;
        const { _id, address_line, city, state, pincode, country, mobile } = req.body;
        const updatedAddress = await addressModel.updateOne(
            { _id : _id, userId : userId }, 
            { 
                address_line,
                city,
                state,
                pincode,
                country,
                mobile
            }
        );
        return res.status(200).send({message:"Address updated successfully", success:true, error:false, data:updatedAddress});
    } catch (error) {
        console.log("Error in updateAddressController:", error);
        return res.status(500).send({message:"Error updating address", success:false, error:true});
    }   
}