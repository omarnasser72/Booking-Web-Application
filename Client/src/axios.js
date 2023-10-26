import orgaxios from "axios";

const axios = orgaxios.create({ baseURL: "https://booking-fwaz.onrender.com" });
//const axios = orgaxios.create({ baseURL: "http://localhost:8080" });

// Function to wait for a specified duration in milliseconds
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Async function to wait for 1 second and then get the token from localStorage
const getTokenWithDelay = async () => {
  await delay(10000); // Wait for 1000 ms (1 second)
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
};

getTokenWithDelay();

export default axios;
