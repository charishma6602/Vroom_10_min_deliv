import multer from 'multer'

const storage = multer.memoryStorage()//temporary storage purpose

const upload =  multer({storage : storage})

export default upload
