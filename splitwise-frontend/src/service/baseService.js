import axios from 'axios';
import { getToken } from '../auth';
export const baseURL = process.env.NODE_ENV === "production" ? "api" : "http://localhost:3001/api";
console.log("auth", getToken())
const baseService = axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: 'Bearer ' + getToken()
    }
})

export default baseService;