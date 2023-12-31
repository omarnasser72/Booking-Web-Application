import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import SingleUser from "./pages/singleUser/SingleUser";
import NewUser from "./pages/newUser/NewUser";
import NewHotel from "./pages/newHotel/NewHotel";
import NewRoom from "./pages/newRoom/NewRoom";
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import Hotel from "./pages/hotel/Hotel";
import Login from "./pages/login/Login";
import AdminHome from "./pages/adminHome/AdminHome";
import AdminList from "./pages/adminList/AdminList";
import { AuthContext, AuthContextProvider } from "./context/AuthContext"; // Import the AuthContextProvider
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import { useContext } from "react";
import ListType from "./pages/ListType/ListType";
import ChangePwd from "./pages/change pwd/ChangePwd";
import {
  hotelColumns,
  reservationColumns,
  roomColumns,
  userColumns,
} from "./datatableSource";
import SingleHotel from "./pages/singleHotel/SingleHotel";
import SingleRoom from "./pages/singleRoom/SingleRoom";
import SingleReservation from "./pages/singleReservation/SingleReservation";
import NewReservation from "./pages/newReservation/NewReservation";
import AdminProfile from "./pages/adminProfile/AdminProfile";
import ResetPwd from "./pages/resetPwd/ResetPwd";
import DashboardChoice from "./pages/dashboardChoice/DashboardChoice";
import VerifyEmail from "./pages/verifyEmail/VerifyEmail";
import NewPwd from "./pages/newPwd/newPwd";
import CheckOutSuccess from "./pages/checkoutSuccess/CheckOutSuccess";
import CheckOutFailed from "./pages/checkoutFailed/CheckOutFailed";
import RoomReservation from "./pages/RoomReservation/RoomReservation";
import HotelReservation from "./pages/HotelReservation/HotelReservation";

function App() {
  const ProtectedRoute = ({ element }) => {
    const { user } = useContext(AuthContext);
    const { pathname } = useLocation();

    const isLoginOrRegister = pathname.match(/^(\/login|\/register)$/); // Note the leading slashes

    if (
      user ||
      isLoginOrRegister ||
      pathname.startsWith("/verifyEmail") ||
      pathname.match(/^(\/login|\/register)$/)
    ) {
      return element; // Return the provided element directly
    }
    return <Navigate to="/login" />;
  };

  const ProtectedAdminRoute = ({ element }) => {
    const { user } = useContext(AuthContext);
    if (user) {
      if (user.isAdmin) return element;
      console.log(user.isAdmin);
    }

    return <Navigate to="/login" />;
  };

  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/verifyEmail" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetPassword" element={<ResetPwd />} />
        <Route path="/newPassword" element={<NewPwd />} />
        <Route path="/">
          <Route path="" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="dashboardChoice"
            element={<ProtectedAdminRoute element={<DashboardChoice />} />}
          />
          <Route path="adminDashboard">
            <Route
              index
              element={<ProtectedAdminRoute element={<AdminHome />} />}
            />
            <Route
              path="adminProfile"
              element={<ProtectedAdminRoute element={<AdminProfile />} />}
            />
            <Route path="users">
              <Route
                index
                element={
                  <ProtectedAdminRoute
                    element={<AdminList columns={userColumns} />}
                  />
                }
              />
              <Route
                path=":userId"
                element={<ProtectedAdminRoute element={<SingleUser />} />}
              />
              <Route
                path="new"
                element={<ProtectedAdminRoute element={<NewUser />} />}
              />
            </Route>
            <Route path="hotels">
              <Route
                index
                element={
                  <ProtectedAdminRoute
                    element={<AdminList columns={hotelColumns} />}
                  />
                }
              />

              <Route
                path=":hotelId"
                element={<ProtectedAdminRoute element={<SingleHotel />} />}
              />
              <Route
                path="new"
                element={<ProtectedAdminRoute element={<NewHotel />} />}
              />
            </Route>
            <Route path="rooms">
              <Route
                index
                element={
                  <ProtectedAdminRoute
                    element={<AdminList columns={roomColumns} />}
                  />
                }
              />

              <Route
                path=":roomId"
                element={<ProtectedAdminRoute element={<SingleRoom />} />}
              />
              <Route
                path="new"
                element={<ProtectedAdminRoute element={<NewRoom />} />}
              />
            </Route>
            <Route path="reservations">
              <Route
                index
                element={
                  <ProtectedAdminRoute
                    element={<AdminList columns={reservationColumns} />}
                  />
                }
              />

              <Route
                path=":reservationId"
                element={<ProtectedRoute element={<SingleReservation />} />}
              />
              <Route
                path="new"
                element={<ProtectedRoute element={<NewReservation />} />}
              />
            </Route>
          </Route>
          <Route
            path="Flights"
            element={<ProtectedRoute element={<ListType />} />}
          />
          <Route
            path="CarRental"
            element={<ProtectedRoute element={<ListType />} />}
          />
          <Route
            path="AirportTaxies"
            element={<ProtectedRoute element={<ListType />} />}
          />
          <Route
            path="Attractions"
            element={<ProtectedRoute element={<ListType />} />}
          />
          <Route path="/profile">
            <Route index element={<ProtectedRoute element={<Profile />} />} />
            <Route
              path="changePwd"
              element={<ProtectedRoute element={<ChangePwd />} />}
            />
          </Route>

          <Route
            path="/hotels"
            element={<ProtectedRoute element={<List />} />}
          />
          <Route
            path="/hotels/:id"
            element={<ProtectedRoute element={<Hotel />} />}
          />
          <Route
            path="/hotels/reservation/:id"
            element={<ProtectedRoute element={<HotelReservation />} />}
          />
          <Route path="/ListAll/">
            <Route
              path="hotels"
              element={<ProtectedRoute element={<ListType />} />}
            />
            <Route
              path="apartments"
              element={<ProtectedRoute element={<ListType />} />}
            />
            <Route
              path="resorts"
              element={<ProtectedRoute element={<ListType />} />}
            />
            <Route
              path="villas"
              element={<ProtectedRoute element={<ListType />} />}
            />
            <Route
              path="cabins"
              element={<ProtectedRoute element={<ListType />} />}
            />
          </Route>
          <Route
            path="checkoutSuccess"
            element={<ProtectedRoute element={<CheckOutSuccess />} />}
          />
          <Route
            path="checkoutFailed"
            element={<ProtectedRoute element={<CheckOutFailed />} />}
          />
          <Route
            path="/reservations/:hotelId/:roomTypeId"
            element={<RoomReservation />}
          />
        </Route>
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
