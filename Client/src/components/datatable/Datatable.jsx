import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "../../axios";
import moment from "moment";
import "moment-timezone";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";

const Datatable = ({ columns }) => {
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  console.log(path);
  let addedUrl = "";
  if (path === "users") addedUrl = "/getUsers/all";
  const { data, loading, error } = useFetch(`/${path}${addedUrl}`);

  console.log(data);
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(data);
    console.log(list);
    if (path === "reservations") {
      const modifiedData = data.map((attribute) => ({
        ...attribute,
        startDate: moment(attribute.reservationDuration.startDate)
          .add(1, "day")
          .toISOString()
          .split("T")[0],
        endDate: moment(attribute.reservationDuration.endDate)
          .add(1, "day")
          .toISOString()
          .split("T")[0],
      }));
      setList(modifiedData);
    } else setList(data);
  }, [data]);

  const handleDelete = async (id) => {
    try {
      if (path == "reservations") {
        const reservation = (
          await axios.get(`/reservations/${id}`, {
            headers: { accessToken: accessToken },
          })
        ).data;
        console.log(reservation);

        const { hotelId, userId, roomTypeId, roomNumberId } = reservation;
        const { startDate, endDate } = reservation.reservationDuration;

        console.log(
          hotelId,
          userId,
          roomTypeId,
          roomNumberId,
          startDate,
          endDate
        );

        const roomRes = await axios.delete(
          `/rooms/${hotelId}/${roomTypeId}/${roomNumberId}/${startDate}/${endDate}`,
          {
            headers: { accessToken: accessToken },
          }
        );
        console.log(roomRes);
        //const reservationRes = await axios.delete(`/${path}/${id}`);
        //console.log(reservationRes);

        setList(list.filter((item) => item._id !== id));
      }
      await axios.delete(`/${path}/${id}`, {
        headers: { accessToken: accessToken },
      });
      setList(list.filter((item) => item._id !== id));
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${path.slice(0, -1)} has deleted successfully`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="viewButton"
              onClick={() => navigate(`${params.row._id}`)}
            >
              View
            </div>
            <div
              className="deleteButton"
              onClick={() => handleDelete(`${params.row._id}`)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      {loading ? (
        <div className="loading">
          <img
            className="uploadHotelIcon"
            src="https://media.tenor.com/hlKEXPvlX48AAAAj/loading-loader.gif"
          />
          <span>loading...</span>
        </div>
      ) : (
        <div className="wrapper">
          <div className="datatableTitle" onClick={() => navigate(`new`)}>
            {path}
            <div className="link" onClick={() => navigate(`new`)}>
              Add New {path}
            </div>
          </div>
          <DataGrid
            className="dataGrid"
            rows={list}
            columns={columns.concat(actionColumn)}
            pageSize={9}
            getRowId={(row) => row._id}
          />
        </div>
      )}
    </div>
  );
};

export default Datatable;
