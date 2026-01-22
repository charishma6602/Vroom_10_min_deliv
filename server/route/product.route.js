import { Router } from "express";
import auth from "../middleware/auth.js";
import { createProductController, getProductController, deleteProductController,updateProductController, getProductByCatController, getProductByCatAndSubCatController, getProductDetailsController} from "../controllers/product.controller.js";
 const productRouter = Router()

productRouter.post("/create-product",auth,createProductController)
productRouter.post("/get-product",getProductController)
productRouter.delete("/delete-product",auth, deleteProductController)
productRouter.put("/update-product",auth, updateProductController)
productRouter.post("/get-product-by-category", getProductByCatController);
productRouter.post("/get-product-by-category-and-subcategory", getProductByCatAndSubCatController);
productRouter.post("/get-product-details", getProductDetailsController);
export default productRouter