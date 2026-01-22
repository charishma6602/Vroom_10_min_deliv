import {Router} from "express";
import auth from "../middleware/auth.js";
import { addAddressController, getAddressController, deleteAddressController, updateAddressController } from "../controllers/address.controller.js";

const addressRouter = Router();
addressRouter.post("/add-address",auth, addAddressController);
addressRouter.get("/get-address",auth, getAddressController);
addressRouter.delete("/delete-address",auth, deleteAddressController);
addressRouter.put("/update-address",auth, updateAddressController);

export default addressRouter;