import uploadImage from "../utils/uploadImageCloudinary.js";

const uploadImageController = async (request, response)=>{
    try{

        const file = request.file

        console.log("file",file)
        const uploadImg = await uploadImage(file)

        return response.json({
            message : "Uploaded successfully",
            error : false,
            success : true,
            data : uploadImg
        })

    }catch(error){
        return response.status(500).json({
            message :  error.message || error,
            error: true,
            success :  false
        })
    }
}

export default uploadImageController