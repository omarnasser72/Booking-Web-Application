import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";

const allowedExtensions = /^[^.\/]+\.(jpg|jpeg|png|gif|bmp)$/i;

const List = () => {
  const [fetchedReservations, setFetchedReservations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState("true");

  const getLastReservations = async () => {
    try {
      const res = await axios.get(`/reservations`);
      setFetchedReservations(res.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };
  useEffect(() => {
    getLastReservations();
    console.log(fetchedReservations);
  }, []);

  useEffect(() => {
    // Fetch related data for each reservation
    const fetchReservationDetails = async () => {
      try {
        if (fetchedReservations.length > 0) {
          const last10Reservations = fetchedReservations.slice(-10);
          const reservationsWithData = await Promise.all(
            last10Reservations.map(async (fetchedReservation) => {
              // Fetch user data
              const userResponse = await axios.get(
                `/users/${fetchedReservation.userId}`
              );
              console.log(userResponse.data);
              const username = userResponse.data?.username;

              const userImg = userResponse.data?.img;

              // Fetch hotel data
              const hotelResponse = await axios.get(
                `/hotels/find/${fetchedReservation.hotelId}`
              );
              const hotel = hotelResponse.data?.name;

              // Fetch room type data
              const roomTypeResponse = await axios.get(
                `/rooms/${fetchedReservation.roomTypeId}`
              );
              const roomType = roomTypeResponse.data?.title;

              // Fetch room number data
              const roomNumberResponse = await axios.get(
                `/rooms/${fetchedReservation.roomTypeId}/${fetchedReservation.roomNumberId}`
              );
              const roomNumber = roomNumberResponse.data?.number;

              return {
                _id: fetchedReservation._id,
                username,
                userImg: userImg,
                hotel,
                roomType,
                roomNumber,
                reservationDuration: fetchedReservation.reservationDuration,
                cost: fetchedReservation.cost,
              };
            })
          );
          setLoading(false);
          setReservations(reservationsWithData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchReservationDetails();
    console.log(fetchedReservations);
  }, [fetchedReservations]);

  return (
    <TableContainer component={Paper} className="table">
      {loading ? (
        <div className="loading">loading Reservations ...</div>
      ) : (
        <Table sx={{ minWidth: 650 }} aria-label="simple tabele">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Reservation ID</TableCell>
              <TableCell className="tableCell">User's Profile Image</TableCell>
              <TableCell className="tableCell">User</TableCell>
              <TableCell className="tableCell">Hotel</TableCell>
              <TableCell className="tableCell">Room Type</TableCell>
              <TableCell className="tableCell">Room Number</TableCell>
              <TableCell className="tableCell">Duration</TableCell>
              <TableCell className="tableCell">Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="tableCell">{reservation._id}</TableCell>
                <TableCell className="tableCell">
                  <div className="cellWrapper">
                    <img
                      src={
                        reservation.userImg !== undefined ||
                        allowedExtensions.test(reservation?.userImg)
                          ? `${process.env.PUBLIC_URL}/upload/profileImages/${reservation.userImg}`
                          : "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-18.jpg"
                      }
                      alt=""
                      className="image"
                    />
                  </div>
                </TableCell>
                <TableCell className="tableCell">
                  {reservation.username}
                </TableCell>
                <TableCell className="tableCell">{reservation.hotel}</TableCell>
                <TableCell className="tableCell">
                  {reservation.roomType}
                </TableCell>
                <TableCell className="tableCell">
                  {reservation.roomNumber}
                </TableCell>
                {/* <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell> */}
                <TableCell className="tableCell">
                  {
                    new Date(
                      new Date(
                        reservation.reservationDuration.startDate
                      ).getTime() +
                        24 * 60 * 60 * 1000
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  {" to "}
                  {
                    new Date(
                      new Date(
                        reservation.reservationDuration.endDate
                      ).getTime() +
                        24 * 60 * 60 * 1000
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                </TableCell>

                <TableCell className="tableCell">{reservation.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default List;
