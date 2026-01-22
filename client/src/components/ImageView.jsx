import React from "react";
import { IoMdClose} from "react-icons/io";

const ImageView = ({close, imageUrl}) => {
    return (    
        <div className='fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800 bg-opacity-70 p-4 flex justify-center items-center'>
            <div className='bg-white w-full max-w-3xl p-4 rounded'>
                <button onClick={close} className='w-fit block ml-auto mb-2'>
                    <IoMdClose size={25} />
                </button>
                <div className="flex justify-center items-center">
                    <img src={imageUrl} alt="Enlarged view" className="max-w-full max-h-[80vh] object-contain" />
                </div>
            </div>
        </div>
    )
};

export default ImageView;