import axios from "../axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const useFetch = (url) => {
  const { accessToken } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(url);
        const res = await axios.get(url, {
          headers: { accessToken: accessToken },
        });
        console.log(res);
        setData(res.data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url, {
        headers: { accessToken: accessToken },
      });
      setData(res.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };
};
export default useFetch;
