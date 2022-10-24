import axios from 'axios'

const API = axios.create({
    baseURL:`http://127.0.0.1:8000/api/`,
    timeout:2000,
    headers:{
        'Content-Type':'application/json',
    }
})

API.interceptors.request.use(
    config=>{
        let authToken = localStorage.getItem('authToken')?JSON.parse(localStorage.getItem('authToken')):null
        if(authToken){
            config.headers={
                ...config.headers,
                'Authorization':`Bearer ${authToken?.access}`
            }
        }
        return config
    },
    error=>Promise.reject(error)
)

export default API