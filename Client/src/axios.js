import axios from "axios";

export default axios.create({
  headers: {
    Authorization: localStorage.getItem("accessToken"),
  },
  baseURL: "https://booking-fwaz.onrender.com",
});
