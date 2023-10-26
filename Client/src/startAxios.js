import orgaxios from "axios";

const axios = orgaxios.create({ baseURL: "https://booking-fwaz.onrender.com" });
//const axios = orgaxios.create({ baseURL: "http://localhost:8080" });

export default axios;
