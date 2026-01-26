import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL : baseURL,
    withCredentials:true //because, to set cookie we need credentials
})
//sending acces token in the header
Axios.interceptors.request.use(
    async(config)=>{
        const accesstoken = localStorage.getItem('accessToken')
    

    if(accesstoken){
        config.headers.Authorization = `Bearer ${accesstoken}`

    }

    return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)


//if accesstoken is expired, we need refreshtoken (to extend access token life)
//interceptors are like middleware that runs desirable code before sending a request or after receiving a response
Axios.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      const refreshtoken = localStorage.getItem("refreshToken")

      if (refreshtoken) {
        const newAccessToken = await refreshAccessToken(refreshtoken)

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return Axios(originalRequest)
        }
      }
    }

    return Promise.reject(error)
  }
)



const refreshAccessToken = async(refreshtoken)=>{
    try{
        const response = await Axios ({
            ...SummaryApi.refresh_token,
            headers:{
                Authorization : `Bearer ${refreshtoken}`
            }
        })

        const accesstoken = response.data.data.accesstoken
        localStorage.setItem('accessToken',accesstoken)
        console.log("response: ",response)
        return accesstoken

        
    }catch(error){
        console.log(error)
    }
    
}
export default Axios