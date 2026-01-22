import Axios from './Axios'
import SummaryApi from '../common/SummaryApi'


const fetchUserDetails = async()=>
{
    try{
        const response = await Axios({   //standard way writing with Axios to fetch an API (user_details) 
            ...SummaryApi.user_profile 
        })
        return response.data

    }catch(error){
        console.log(error)
    }
}

export default fetchUserDetails