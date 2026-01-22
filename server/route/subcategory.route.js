import { Router } from "express";
import auth from "../middleware/auth.js";
import { addSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from "../controllers/subcategory.controller.js";

const subcategoryRouter = Router()
subcategoryRouter.post("/add-subcategory",auth,addSubCategoryController)
subcategoryRouter.get("/get-subcategory",getSubCategoryController)
subcategoryRouter.put("/update-subcategory",auth, updateSubCategoryController)
subcategoryRouter.delete("/delete-subcategory",auth, deleteSubCategoryController)

export default subcategoryRouter;