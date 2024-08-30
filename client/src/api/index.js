import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001/',
    timeout: 20000,
    headers: {
        "Content-Type" : "application/json"
    },
});


API.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;
