import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})



const uploadImage=async(image)=>{
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer()) //image is convereted in to array buffer
    console.log("image object:", image);

    const uploadImg =  await new Promise((resolve, reject)=>{
        cloudinary.uploader.upload_stream({folder:"Vroom"},
            (error,uploadResult)=>{
                if (error) return reject(error); 
                
            return resolve(uploadResult)}
        ).end(buffer) // that array buffer image is passed here
    })

    return uploadImg
}

export default uploadImage