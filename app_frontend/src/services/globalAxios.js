import axios from "axios";

export const DOMAIN = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_URL : "localhost:8000"
export const SOCKET_URL = `${process.env.NODE_ENV === 'production' ? "wss" : 'ws'}://${DOMAIN}`
const baseURL = `${process.env.NODE_ENV === 'production' ? "https" : 'http'}://${DOMAIN}`;


const axios_instance = axios.create({
    baseURL: baseURL,
    withCredentials: true, 
    xsrfHeaderName: 'X-CSRFToken',
    xsrfCookieName: 'csrftoken'
});

export default axios_instance;