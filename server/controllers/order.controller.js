import Stripe from "../config/stripe.js";
import OrderModel from "../model/order.model.js";
import UserModel from "../model/user.model.js";
import cartProductModel from "../model/cartProduct.model.js";
import mongoose from "mongoose";

export async function CashOnDeliveryController(req, res) {
  try {
    const userId = req.userId // auth middleware 
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body
    const payload = list_items.map((item) => {
        return ({
            userId : userId,
            orderId : `ORD-${new mongoose.Types.ObjectId()}`,
            productId : item.productId._id,
            product_details : {
                name : item.productId.name,
                image : item.productId.image,

            },
            paymentId : "",
            payment_status : "Cash On Delivery",
            delivery_address : addressId,
            totalAmt : totalAmt,
            subTotalAmt : subTotalAmt,
            
        })
    
        }) 
        const generateOrder = await OrderModel.insertMany(payload)  //inertMany??

        const removeCartItems = await cartProductModel.deleteMany({ userId: userId });

        const updateUser = await UserModel.updateOne({ _id: userId }, {shopping_cart : []});

        return res.status(200).json({
            success: true,
            message: "Order placed successfully with Cash On Delivery",
            error : false,
            data: generateOrder,
        });

    }catch (error) {
    console.error("Error in CashOnDeliveryController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: true,
      data: null,
    });
  }
}

export const priceWithDiscount = (originalPrice, discountPercentage = 1) => {
    const discountAmount = Math.ceil((Number(originalPrice) * Number(discountPercentage)) / 100);
    return Number(originalPrice) - Number(discountAmount);
}

export async function paymentController(req,res){
    try{
        const userId = req.userId
        const { list_items, totalAmt, addressId, subTotalAmt} = req.body

        const user = await UserModel.findById(userId)

        const line_items = list_items.map(item => {
            return {
                price_data : {
                    currency : 'inr',
                    product_data : {
                        name : item.productId.name,
                        images : item.productId.image,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount :priceWithDiscount (item.productId.price,item.productId.discount)*100

                },
                adjustable_quantity : {
                    enabled : true,
                    minimum : 1
                },
                quantity : item.quantity
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)
        //const updateUser = await UserModel.updateOne({ _id: userId }, {shopping_cart : []});

        return res.status(200).json(session)

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

const getOrderProductItems = async({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,

})=>{
    const productList = []

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await Stripe.products.retrieve(item.price.product)

            const payload = {
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : product.metadata.productId, 
                product_details : {
                    name : product.name,
                    image : product.images
                } ,
                paymentId : paymentId,
                payment_status : payment_status,
                delivery_address : addressId,
                subTotalAmt  : Number(item.amount_total / 100),
                totalAmt  :  Number(item.amount_total / 100),
            }

            productList.push(payload)


            
        }
    }
    return productList
}


//localhost:8080/api/order/webhook
export async function webhookStripe(request,response){
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY

    console.log("event", event)

    switch(event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
            const userId = session.metadata.userId
            const orderProduct = await getOrderProductItems({
            lineItems : lineItems,
            userId : userId,
            addressId : session.metadata.addressId,
            paymentId  : session.payment_intent,
            payment_status : session.payment_status,
        })
            console.log(lineItems)
            const order = await OrderModel.insertMany(orderProduct)

        console.log(order)
        if(Boolean(order[0])){
            const removeCartItems = await  UserModel.findByIdAndUpdate(userId,{
                shopping_cart : []
            })
            const removeCartProductDB = await cartProductModel.deleteMany({ userId : userId})
        }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
}

export async function getOrderDetailsController(request,response){
    try {
        const userId = request.userId // order id

        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('delivery_address')

        return response.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}