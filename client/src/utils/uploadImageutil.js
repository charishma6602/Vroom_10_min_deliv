import Axios from './Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from './AxiosToastError';

const UploadImg = async(image)=>{
    try{
        const formData = new FormData()
        formData.append('image',image)

        const response = await Axios({
            ...SummaryApi.upload_image,
            data:formData
        })

        return response
    }catch(error){
        AxiosToastError(error)
    }
}

export default UploadImg