// api.js
import axios from "axios";
import API_BASE_URL from "./config";

const instance = axios.create({
  baseURL: "https://booking-fwaz.onrender.com",
});

export default instance;
