import axios from 'axios';

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return import.meta.env.VITE_API_URL;
    }
    return 'http://localhost:5000'; // Your local development backend URL
};

const API = axios.create({
    baseURL: getBaseURL(),
});

export default API;