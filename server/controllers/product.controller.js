import e, { text } from "express";
import ProductModel from "../model/product.model.js";

export const createProductController = async (req,res) => {
    try {
        const {
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        } = req.body;
        if(!name){
            return res.status(400).send({message:"Product name is required"});
        }
        if(!image || image.length === 0){
            return res.status(400).send({message:"Product image is required"});
        }
        if(!category || category.length === 0){
            return res.status(400).send({message:"Product category is required"});
        }
        if(!subCategory || subCategory.length === 0){
            return res.status(400).send({message:"Product subcategory is required"});
        }
        if(!unit){
            return res.status(400).send({message:"Product unit is required"});
        }
        if(!stock){
            return res.status(400).send({message:"Product stock is required"});
        }
        if(!price){
            return res.status(400).send({message:"Product price is required"});
        }
        if(!discount){
            return res.status(400).send({message:"Product discount is required"});
        }
        if(!description){
            return res.status(400).send({message:"Product description is required"});
        }
        const newProduct = new ProductModel({
            name,
            image,
            category,
            subCategory,
            unit,   
            stock,
            price,
            discount,
            description,
            more_details,
        });
        const savedProduct = await newProduct.save();
        return res.status(201).send({message:"Product created successfully", success:true,error:false, data:savedProduct});
    } catch (error) {
        res.status(500).send({message:"Error creating product", error:true, success:false});
    }
}

export const getProductController = async (req,res) => {
    try {
        let {page,limit, search} = req.body;

        if(!page){ page = 1; }
        if(!limit){ limit = 10; }

        const skip = (page - 1) * limit;

        const query = search ? { text: { $search: search } } : {};

        const [data,totalCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1}).skip(skip).limit(limit).populate("subCategory").populate("category"),
            ProductModel.countDocuments(query)
        ]);

        return res.json({
            message: "Products fetched successfully",
            success: true, 
            error: false,
            data: data,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit),
        });

    } catch (error) {
        res.status(500).send({message:"Error fetching products", error:true, success:false});
    }
};

export const deleteProductController = async (req,res) => {
    try {
        const { productId } = req.body;
        if(!productId){
            return res.status(400).send({message:"Product ID is required"});
        }
        const deletedProduct = await ProductModel.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).send({message:"Product not found"});
        }
        return res.status(200).send({message:"Product deleted successfully", success:true, error:false, data:deletedProduct});
    } catch (error) {
        res.status(500).send({message:"Error deleting product", error:true, success:false});
    }   
}
export const updateProductController = async (req,res) => {
    try {
        const {
            _id,
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details
        } = req.body;
        if(!_id){
            return res.status(400).send({message:"Product ID is required"});
        }
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            _id, 
            {
                name,
                image,
                category,
                subCategory,
                unit,   
                stock,
                price,
                discount,
                description,
                more_details
            },
            { new: true }
        );
        if(!updatedProduct){
            return res.status(404).send({message:"Product not found"});
        }
        return res.status(200).send({message:"Product updated successfully", success:true, error:false, data:updatedProduct});
    } catch (error) {
        res.status(500).send({message:"Error updating product", error:true, success:false});
    }   
}
export const getProductByCatController = async (req,res) => {
    try {
        const { id } = req.body;
        if(!id){
            return res.status(400).send({message:"Category ID is required"});
        }
        const products = await ProductModel.find({category:id});
        return res.status(200).send({message:"Products fetched successfully", success:true, error:false, data:products});
    } catch (error) {
        res.status(500).send({message:"Error fetching products by category", error:true, success:false});
    }
}

export const getProductDetailsController = async (req, res) => {
  try {
    const { productId } = req.body;

    console.log("Incoming productId:", productId);
    console.log("Type:", typeof productId);

    const product = await ProductModel.findById(productId);

    console.log("Fetched product:", product);

    if (!product) {
      return res.status(400).send({
        success: false,
        message: "Product not found",
        data: null
      });
    }

    return res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("FETCH PRODUCT ERROR:", error.message);
    return res.status(500).send({
      message: error.message,
      success: false,
      error: true
    });
  }
};


export const getProductByCatAndSubCatController = async (req,res) => {  ///???????????????
    try {
        const { categoryId, subCategoryId } = req.body;
        if(!categoryId || !subCategoryId){
            return res.status(400).send({message:"Category ID and Subcategory ID are required",error:true, success:false});
        }
        if(!page){ page = 1; }
        if(!limit){ limit = 10; }

        const skip = (page - 1) * limit;
        const query = {
            category: {$in : [categoryId]},
            subCategory: {$in : [subCategoryId]}
        }
        const [data,totalCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1}).skip(skip).limit(limit),//???????????????,
            ProductModel.countDocuments(query)
        ]);

        return res.json({
            message: "Products fetched successfully",
            success: true, 
            error: false,
            data: data,
            totalCount:totalCount,
            page: page,
            error: false,
            success: true,
        });
    } catch (error) {
        res.status(500).send({message:"Error fetching products by category and subcategory", error:true, success:false});
    }
}