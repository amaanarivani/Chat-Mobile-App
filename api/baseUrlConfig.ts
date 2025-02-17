import axios from 'axios';
// const baseURL = "https://chat-app-backend-xf7e.onrender.com";
const baseURL = "http://192.168.1.25:9000";
// const instance = axios.create({ baseURL: "https://chat-app-backend-xf7e.onrender.com" });
const instance = axios.create({ baseURL: "http://192.168.1.25:9000" })

export { instance, baseURL };