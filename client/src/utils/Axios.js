import axios from "axios"
import { baseURL } from "../common/SummaryApi"

const Axios = axios.create({
  baseURL,
  withCredentials: true
})

export default Axios
