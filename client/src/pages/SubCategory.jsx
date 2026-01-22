import React, { useState, useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../common/SummaryApi';
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import Datatable from '../components/Datatable';
import UploadSubCategory from '../components/uploadSubCategory.jsx';
import ImageView from '../components/ImageView.jsx';
import EditSubCategory from '../components/EditSubCategory.jsx';
import ConfirmBox from '../components/Confirmbox.jsx';
import toast from 'react-hot-toast';
import NoData from '../components/NoData';
import { useDispatch } from "react-redux";
import { setAllCategories } from "../store/productSlice.js";

const SubCategory = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({ _id: "" });
  const [deleteSubCategory, setDeleteSubCategory] = useState({ _id: "" });
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);

  const dispatch = useDispatch();
  const columnHelper = createColumnHelper();

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.get_subcategory });
      const { data: responseData } = response;

      if (!responseData.data) return;

      // Map data to include 'id' for React Table
      const formattedData = responseData.data.map(sub => ({
        id: sub._id,
        ...sub
      }));
      setData(formattedData);

      // Extract unique categories for dropdown
      const uniqueCats = [];
      responseData.data.forEach(sub => {
        if (Array.isArray(sub.category)) {
          sub.category.forEach(cat => {
            if (!uniqueCats.some(c => c._id === cat._id)) {
              uniqueCats.push(cat);
            }
          });
        }
      });

      dispatch(setAllCategories(uniqueCats));
      console.log("Extracted categories:", uniqueCats);
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.delete_subcategory,
        data: deleteSubCategory
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenConfirmBoxDelete(false);
        setDeleteSubCategory({ _id: "" });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Columns for React Table
  const column = [
    columnHelper.accessor('name', { header: "Sub Category Name" }),
    columnHelper.accessor('image', {
      header: "Image",
      cell: ({ row }) => (
        <div className="h-20 flex items-center justify-center bg-gray-100 rounded">
          <img
            src={row.original.image}
            alt={row.original.name}
            className="object-contain h-full w-full cursor-pointer"
            onClick={() => setImageURL(row.original.image)}
          />
        </div>
      )
    }),
    columnHelper.accessor('category', {
      header: "Category",
      cell: ({ row }) => (
        <div className="flex gap-1 flex-wrap">
          {row.original.category?.map(cat => (
            <p
              key={cat._id}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded"
            >
              {cat.name}
            </p>
          ))}
        </div>
      )
    }),
    columnHelper.accessor('id', {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => { setOpenEdit(true); setEditData(row.original); }}
            className="p-2 bg-green-100 rounded-full hover:text-green-600"
          >
            <HiPencil size={20} />
          </button>
          <button
            onClick={() => { setDeleteSubCategory(row.original); setOpenConfirmBoxDelete(true); }}
            className="p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600"
          >
            <MdDelete size={20} />
          </button>
        </div>
      )
    })
  ];

  return (
    <section>
      <div className='p-5 bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Sub Category</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className='text-sm border border-red-300 hover:bg-rose-400 px-3 py-1 rounded'
        >
          Add Sub Category
        </button>
      </div>

      {!data.length && !loading && <NoData />}

      <div className='p-4'>
        <Datatable
          data={data}
          column={column}
          loading={loading}
        />
      </div>

      {openAddSubCategory && (
        <UploadSubCategory
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {imageURL && (
        <ImageView
          imageURL={imageURL}
          close={() => setImageURL("")}
        />
      )}

      {openEdit && (
        <EditSubCategory
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
          editData={editData}
        />
      )}

      {openConfirmBoxDelete && (
        <ConfirmBox
          close={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDeleteSubCategory}
          message={`Are you sure you want to delete ${deleteSubCategory.name}?`}
        />
      )}
    </section>
  );
};

export default SubCategory;
