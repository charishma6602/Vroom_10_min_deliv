import React, { useState,useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import UploadImg from '../utils/uploadImageutil.js';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi.js';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError.js';
import { useSelector, useDispatch } from "react-redux";
import { setAllCategories } from "../store/productSlice.js"

const EditSubCategory = ({ fetchData, close, editData }) => {
    const [subdata, setsubdata] = useState({
        name: editData.name || "",
        image: editData.image || "",
        category: editData.category || [],
        _id: editData._id || ""
    });

    const allCategories = useSelector(state => state.products.allCategories || []);
    const dispatch = useDispatch();

     const fetchCategories = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_category,
      });

      console.log("Fetched categories:", response.data);

      if (response.data?.data) {
        dispatch(setAllCategories(response.data.data));
      }
    } catch (error) {
      console.log("Fetch categories error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setsubdata(prev => ({ ...prev, [name]: value }));
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return AxiosToastError('File not found!');
        const uploadImage = await UploadImg(file);
        const imageUrl = uploadImage?.data?.data?.url;
        if (!imageUrl) return AxiosToastError('Image upload failed');
        setsubdata(prev => ({ ...prev, image: imageUrl }));
    }

    const handleDeleteCategory = (catId) => {
        setsubdata(prev => ({
            ...prev,
            category: prev.category.filter(c => c._id !== catId)
        }));
    }

    const handleAddCategory = (e) => {
        const catId = e.target.value;
        if (!catId) return;

        const selectedCat = allCategories.find(c => c._id === catId);
        if (!selectedCat) return;

        // Prevent duplicates
        if (subdata.category.some(c => c._id === catId)) return;

        setsubdata(prev => ({
            ...prev,
            category: [...prev.category, selectedCat]
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios({
                ...SummaryApi.edit_subcategory,
                data: subdata
            });
            if (response.data?.success) {
                toast.success(response.data.message);
                fetchData?.();
                close?.();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }

    return (
        <section className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold">Edit SubCategory</h2>
                    <button onClick={close} className="text-gray-500 hover:text-gray-700">
                        <IoMdClose size={24} />
                    </button>
                </div>

                <form className="my-3 grid gap-2" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="grid gap-1">
                        <label>Name</label>
                        <input
                            name="name"
                            value={subdata.name}
                            onChange={handleChange}
                            className="p-3 bg-blue-50 border outline-none focus-within:border-pink-500 rounded"
                        />
                    </div>

                    {/* Image */}
                    <div className="grid gap-1">
                        <label>Image</label>
                        <div className="flex flex-col lg:flex-row items-center gap-3">
                            <div className="border bg-blue-100 h-36 w-full lg:w-36 flex items-center justify-center rounded">
                                {subdata.image ? (
                                    <img src={subdata.image} alt={subdata.name} className="object-contain h-full w-full" />
                                ) : (
                                    <p className="text-sm text-neutral-400">No Image</p>
                                )}
                            </div>
                            <label htmlFor="uploadSubCategoryImage">
                                <div className="px-4 py-2 border rounded cursor-pointer border-rose-300 hover:bg-rose-400 font-medium">
                                    Upload Image
                                </div>
                                <input type="file" id="uploadSubCategoryImage" className="hidden" onChange={handleUploadImage} />
                            </label>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="grid gap-1">
                        <label>Select Category</label>
                        <div className="border focus-within:border-pink-300 rounded p-2 max-h-40 overflow-y-auto">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {subdata.category.map(cat => (
                                    <div key={cat._id} className="flex items-center gap-2 border px-2 py-1 rounded">
                                        <p>{cat.name}</p>
                                        <IoMdClose size={16} className="cursor-pointer text-red-500 hover:text-red-700" onClick={() => handleDeleteCategory(cat._id)} />
                                    </div>
                                ))}
                            </div>
                            <select className="w-full p-2 bg-transparent outline-none border" value="" onChange={handleAddCategory}>
                                <option value="">-- Select Category --</option>
                                {allCategories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`${subdata.name && subdata.image && subdata.category.length ? "bg-primary-200 hover:bg-rose-300" : "bg-gray-300"} py-2 font-semibold rounded mt-2 w-full`}
                        disabled={!subdata.name || !subdata.image || !subdata.category.length}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </section>
    );
}

export default EditSubCategory;
