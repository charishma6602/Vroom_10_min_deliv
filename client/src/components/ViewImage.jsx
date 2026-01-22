import React from "react";
const ViewImage = ({image, close}) => {
  return (
    <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded relative max-w-lg w-full">
                <button onClick={close} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
                    <IoMdClose size={20}/>
                </button>   
                <img src={image} alt="View" className="max-h-[80vh] w-full object-contain"/>
            </div>
        </div>
    </>
  )
}
export default ViewImage;