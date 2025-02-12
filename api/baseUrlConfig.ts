import axios from 'axios';
// const baseURL = "https://stagingchatbotapi.iariv.com";
const baseURL = "http://192.168.1.27:9000";
// const instance = axios.create({ baseURL: "https://stagingchatbotapi.iariv.com" });
const instance = axios.create({ baseURL: "http://192.168.1.27:9000" })

export { instance, baseURL };