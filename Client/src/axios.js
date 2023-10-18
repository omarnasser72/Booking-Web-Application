import orgaxios from "axios";

const axios = orgaxios.create({ baseURL: "https://booking-fwaz.onrender.com" });
//{ baseURL: "http://localhost:8888" }
//const axios = orgaxios.create();

// Get the token from localStorage
const accessToken = localStorage.getItem("accessToken");
console.log("accessToken:", accessToken);
// If the token exists, set it as an Axios default header
if (accessToken) {
  axios.defaults.headers.common["Authorization"] = accessToken;
  console.log(
    `axios.defaults.headers.common["Authorization"]:`,
    axios.defaults.headers.common["Authorization"]
  );
}

export default axios;
