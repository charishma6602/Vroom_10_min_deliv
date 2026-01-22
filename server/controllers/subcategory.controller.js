import SubCategoryModel from '../model/subcategory.model.js';

export const addSubCategoryController = async (request, response) => {
    try {
        const { name, image, category } = request.body; // Expecting category to be an array of category IDs

        if (!name || !image || !category || !Array.isArray(category) || category.length === 0) {    
            return response.status(400).json({
                message: "Provide required fields",
                error: true,
                success: false
            });
        }
        const newSubCategory = new SubCategoryModel({
            name,
            image,
            category
        });

        const savedSubCategory = await newSubCategory.save();

        response.status(201).json({
            message: "Subcategory added successfully",
            error: false,
            success: true,
            data: savedSubCategory
        });
    } catch (error) {
        response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        });

    }
};
export const getSubCategoryController = async (request, response) => {
    try {
        const subcategories = await SubCategoryModel.find().populate('category').sort({ createdAt: -1 });
        response.json({
            message: "Subcategories fetched successfully",
            error: false,
            success: true,
            data: subcategories
        });
    } catch (error) {
        response.json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

export const updateSubCategoryController = async (request, response) => {
    try {
        const { _id, name, image, category } = request.body;

        if (!_id || !name || !image || !category || !Array.isArray(category) || category.length === 0) {
            return response.status(400).json({
                message: "Provide required fields",
                error: true,
                success: false
            });
        }

        // Update the subcategory
        const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
            _id,
            { name, image, category },  // <-- data to update
            { new: true }               // <-- return the updated document
        );

        response.status(200).json({
            message: "Subcategory updated successfully",
            error: false,
            success: true,
            data: updatedSubCategory
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        });
    }
};

export const deleteSubCategoryController = async (request, response) => {
    try {
        const { _id } = request.body;
        console.log("DELETE SUBCATEGORY ID:", _id);
        if (!_id) {
            return response.status(400).json({
                message: "Subcategory ID is required",
                error: true,
                success: false
            });
        }   
        const deletedSubCategory = await SubCategoryModel.findByIdAndDelete(_id);

        if (!deletedSubCategory) {  
            return response.status(404).json({
                message: "Subcategory not found",
                error: true,
                success: false
            });
        }
        response.status(200).json({
            message: "Subcategory deleted successfully",
            error: false,
            success: true
        });
    } catch (error) {
        response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        });
    }
};