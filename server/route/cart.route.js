import {Router} from "express";
import auth from "../middleware/auth.js";
import { addToCartController, getCartItemsController, updateCartItemController, deleteCartItemController } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add-to-cart",auth, addToCartController);
cartRouter.get("/get-cart-items",auth, getCartItemsController);
cartRouter.put("/update-cart-item",auth, updateCartItemController);
cartRouter.delete("/delete-cart-item",auth, deleteCartItemController);

export default cartRouter;