import { Router } from "express";
import auth from "../middleware/auth.js";
import { addCategoryController, getCategoryController, deleteCategoryController, updateCategoryController} from "../controllers/category.controller.js";
import { get } from "mongoose";

const categoryRouter = Router()

categoryRouter.post("/add-category",auth,addCategoryController)
categoryRouter.get("/get-category",getCategoryController)
categoryRouter.delete("/delete-category",auth, deleteCategoryController)
categoryRouter.put("/update-category",auth, updateCategoryController)

export default categoryRouter