import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import UploadImg from "../utils/uploadImageutil.js";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError.js";
import SummaryApi from "../common/SummaryApi.js";
import Axios from "../utils/Axios.js";
import toast from "react-hot-toast";
import { setAllCategories } from "../store/productSlice.js";  // <-- correct import

const UploadSubCategory = ({ close, fetchData }) => {
const dispatch = useDispatch();

  const [Catdata, setdata] = useState({
    name: "",
    image: "",
    category: [],
  });

  const allCategories = useSelector((state) => state.products.allCategories);
  //console.log("All categories:", allCategories);

  // ✅ fetch categories on mount
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

    setdata((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleuploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      AxiosToastError("file upload error, file not found!");
      return;
    }

    const uploadImage = await UploadImg(file);
    if (!uploadImage?.data?.data?.url) {
      AxiosToastError("Image upload failed");
      return;
    }

    const imageUrl = uploadImage.data.data.url;

    setdata((preve) => {
      return {
        ...preve,
        image: imageUrl,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.add_subcategory,
        data: Catdata,
      });

      console.log("RESPONSE SUCCESS:", response);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
        close();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleRemoveCategory = (catId) => {
    const index = Catdata.category.findIndex((el) => el._id === catId);
    Catdata.category.splice(index, 1);
    setdata((preve) => {
      return {
        ...preve,
      };
    });
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-2/5 p-6 relative">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Upload Sub Category</h2>
          <button onClick={close} className="text-gray-600 hover:text-gray-800">
            <IoMdClose size={24} />
          </button>
        </div>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={Catdata.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="h-32 w-32 border border-gray-300 flex items-center justify-center">
                {Catdata.image ? (
                  <img
                    src={Catdata.image}
                    alt="Sub Category"
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-400">No Image</p>
                )}
              </div>
              <label htmlFor="uploadSubCategoryImage">
                <div className="px-4 py-1 border border-pink-300 text-gray-500 rounded hover:bg-rose-400 hover:text-neutral-900 cursor-pointer">
                  Upload Image
                </div>
                <input
                  type="file"
                  id="uploadSubCategoryImage"
                  accept="image/*"
                  onChange={handleuploadSubCategoryImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-1">
            <label className="block text-sm font-medium text-gray-700">Select Category</label>

            <div className="border focus-within:border-pink-300 rounded p-2 max-h-40 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {Catdata.category.map((cat) => {
                  return (
                    // CHANGED from <p> to <div> to avoid block-in-p problems
                    <div
                      key={cat._id + "selectedValue"}
                      className="bg-white shadow-md px-1 m-1 flex items-center gap-2"
                    >
                      <span>{cat.name}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${cat.name}`}
                        className="cursor-pointer hover:text-red-600"
                        onClick={() => {
                          handleRemoveCategory(cat._id);
                        }}
                      >
                        <IoMdClose size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <select
                className="w-full p-2 bg-transparent outline-none border"
                onChange={(e) => {
                  const selectedCatId = e.target.value;
                  const selectedCat = allCategories.find((cat) => cat._id === selectedCatId);

                  if (!selectedCat) return;

                  setdata((preve) => {
                    // prevent duplicates
                    if (preve.category.some((c) => c._id === selectedCat._id)) return preve;
                    return {
                      ...preve,
                      category: [...preve.category, selectedCat],
                    };
                  });
                }}
              >
                <option value="">-- Select Category --</option>
                {allCategories.map((category) => {
                  return (
                    <option value={category?._id} key={category._id + "subcategory"}>
                      {category?.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button
            className={`px-4 py-2 border
                ${
                  Catdata?.name && Catdata?.image && Catdata?.category[0]
                    ? "bg-pink-400 hover:bg-rose-500"
                    : "bg-gray-300"
                }
                w-full text-white py-2 rounded
            `}
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadSubCategory;
