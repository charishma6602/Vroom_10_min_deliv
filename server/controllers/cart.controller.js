import cartProductModel from "../model/cartProduct.model.js";
import UserModel from "../model/user.model.js";

export const addToCartController = async (req,res) => {
    try {
        const userId = req.userId;
        const {productId} = req.body;

        if(!productId){
            return res.status(400).send({message:"Product ID is required", error:true, success:false});
        }
        const checkItemCart = await cartProductModel.findOne({
            productId : productId,
            userId : userId
        })

        if(checkItemCart){
            return res.status(400).send({message:"Product already in cart", success:true, error:false, data:checkItemCart});
        }
    
    const cartItem = new cartProductModel({
        userId : userId,
        productId : productId,
        quantity : 1,
    })
    const save = await cartItem.save()
    
    const updateCartUser = await UserModel.updateOne({_id : userId}, {
        $push : { shopping_cart : save._id }
    })
    return res.status(201).send({message:"Product added to cart successfully", success:true, error:false, data:save});

    }
    catch (error) {
        console.log("Error in add to cart controller", error);
        return res.status(500).send({message:"Error adding product to cart", success:false, error:true});
    }

}

export const getCartItemsController = async (req,res) => {
    try {
        console.log("UserId from token:", req.userId);
        const userId = req.userId;
        const cartItems = await cartProductModel.find({userId : userId}).populate('productId');
        console.log("Cart Items fetched:", cartItems);
        return res.status(200).send({message:"Cart items fetched successfully", success:true, error:false, data:cartItems});
    } catch (error) {
        console.log("Error in getCartItemsController:", error);
        return res.status(500).send({message:"Error fetching cart items", success:false, error:true});
    }
}


export const updateCartItemController = async (req,res) => {
    try {
        const userId = req.userId;
        const { _id, qty } = req.body;

        if(!_id || !qty){
            return res.status(400).send({message:"Cart item ID and quantity are required", success:false, error:true});
        }
        const updateCartItem = await cartProductModel.updateOne({
            _id : _id,
            userId : userId
        },{
            quantity : qty
        })

        return res.status(200).send({message:"Cart item updated successfully", success:true, error:false, data:updateCartItem});
    } catch (error) {
        return res.status(500).send({message:"Error updating cart item", success:false, error:true});
    }
}

export const deleteCartItemController = async (req,res) => {
    try {
        const userId = req.userId;
        const { _id } = req.body;

        if(!_id){
            return res.status(400).send({message:"Cart item ID is required", success:false, error:true});
        }
        const deleteCartItem = await cartProductModel.deleteOne({
            _id : _id,
            userId : userId
        })
        return res.status(200).send({message:"Cart item deleted successfully", success:true, error:false, data:deleteCartItem});
    } catch (error) {
        return res.status(500).send({message:"Error deleting cart item", success:false, error:true});
    }

}