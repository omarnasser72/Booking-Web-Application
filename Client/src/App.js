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
import { hotelInputs, roomInputs, userInputs } from "./formSource";
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import Hotel from "./pages/hotel/Hotel";
import Login from "./pages/login/Login";
import AdminHome from "./pages/adminHome/AdminHome";
import AdminLogin from "./pages/adminLogin/AdminLogin";
import AdminList from "./pages/adminList/AdminList";
import { AuthContext, AuthContextProvider } from "./context/AuthContext"; // Import the AuthContextProvider
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import { useContext } from "react";
import Reservation from "./pages/Reservation/Reservation";
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

function App() {
  const ProtectedRoute = ({ element }) => {
    // Change `children` to `element`
    //return element;
    const { user } = useContext(AuthContext);
    const isLoginOrRegister =
      useLocation().pathname.match(/^(login|register)$/);
    if (user || isLoginOrRegister) {
      return element; // Return the provided element directly
    }
    return <Navigate to="/login" />;
  };

  const ProtectedAdminRoute = ({ element }) => {
    //return element;
    const { user } = useContext(AuthContext);
    if (user) {
      if (user.isAdmin) return element;
      console.log(user.isAdmin);
    }

    return <Navigate to="/login" />;
  };

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/Booking-Web-app">
            <Route index element={<Login />} />
          </Route>

          <Route path="/">
            <Route index element={<ProtectedRoute element={<Home />} />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="" element={<Home />} />
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
              element={<ProtectedRoute element={<Reservation />} />}
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
            <Route path="/adminDashboard">
              <Route path="login" element={<Login />} />
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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
