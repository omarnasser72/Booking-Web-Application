# Booking-Web-app

this is full stack web application using MERN stack
it's similar to idea of booking web app
this is my 1st full stack MERN web app
I build it using MVC design pattern

<h1><bold>Features</bold></h1>

<h2>Backend Side</h2>
<p>I used express using middlewares, moongose for connecting to MongoDB server and created my routes</p>
<h2>Models</h2>
<p>We have 5 models for User, Hotel, Reservation, Room and Hotel's Rate</p>
<h3>User model </h3>
<p>describes user's information represented in username, email, profile's photo, password, birthdate, phone, city, country, isAdmin to detect if it's Admin or not </p>
<h3>Hotel model </h3>
<p>describes hotel's information represented in name, city, 
hotel's photos, type, title, description, city, country, distance(distance from city's location), address, rating, cheapestPrice(the cheapest room's price in hotel), featured(is it featured hotel or not), rooms(array of rooms including type and numbers with it's reservation dates) </p>
<h3>Room model </h3>
<p>describes hotel rate's information represented in title, description, price, maxPeople(maximum no of people can stay at the room), images, roomNumbers(contains array of numbers for this type of room and unavailableDates(array of dates that aren't available for reservations) </p>
<h3>Hotel Rate model </h3>
<p>describes hotel rate's information represented in userId(whose reservation it is ) , hotelId(in which hotel), roomTypeId(which type of room ), roomNumberId(which number in the roomvtype ), reservationDuration(contains the start and end dates of duration of the reservation ), cost(cost of reservation based of room type's price and no of days between start and end dates) </p>
<p>I used schema function in moongose to create each in mongoDB server</p>
<h3>Reservation model </h3>
<p>describes reservation's information represented in rating(it's not the hotel's rate but it's user's rate to the hotel) , hotelId(to identify whose hotel rate it is) , 
userId(to identify which user rate this value with this rate)  </p>
<h2>Contollers</h2>
<h3>User Controller</h3>
<p>We have here 5 apis (changePwd, updateUser, deleteUser, getUser, getAllUsers)</p>
<strong>***To be clear that if any step isn't successfully executed we use next helper function to sent error this error is handled by errorhandler function in index.js ***</strong>
<p>Let's talk about each</p>
<p><strong>changePwd</strong> api this api takes <strong>id, email, old and new passwords</strong> from request sent and check for user if it exists first then it trys to match the old password with the one stored in database<br/> after passing these 2 steps we update the user with the data sent and encrypting new password before storing it<br/>after doing that successfully we use nodemailer to sent to user's email message informing him that the password has changed then senting new updated user in json format in response</p>
<p><strong>updateUser</strong> api takes id and updated user checks if username or email or phone of anyother user except current one already exists in database if none of them exists we update user with the new object sent and using nodemailer we sent to user that profile has been updated successfully</p>
<p><strong>deleteUser</strong> api takes user's id from params and delete user</p>
<p><strong>getUser</strong>api takes user's id from params and search for user using user's id and return it if exists</p>
<p><strong>getAllUsers</strong> api return all users from datebase</p>

<p><strong>getUserReservations</strong> api takse user's id from params and search for all user's reservations using user's id and return all if exist otherwise reservation not found</p>
<h3>Authentication Controller</h3>
<strong>***To be clear that if any step isn't successfully executed we use next helper function to sent error this error is handled by errorhandler function in index.js ***</strong><p><strong>signup</strong> api takes user object and check if the username, email, phone already exists in database if not we save new user in and hash password before saving it in database using bycrypt then using node mailer we send mail to the user's email informing him that he has registered on our webapp</p>
<strong>login</strong> api takes credentials for logging in represented in (username, password ) and search for user using username in database if exists it signs new token and extracts password, is Admin and return other information in the user object</p>
<p><strong>logout</strong> api it resets access Token to empty</p>
<h3>Hotel Controller</h3>
<strong>***To be clear that if any step isn't successfully executed we use next helper function to sent error this error is handled by errorhandler function in index.js ***</strong>
<p><strong>createHotel</strong> api takes hotel object and check if it's name doesn't exist it saves it on database</p>
<p><strong>updateHotel</strong> api takes updated data and retrieve previous state of the hotel then calculates new rate value after that it checks if the new name in updated data doesn't exist it update the hotel with the new data and saves it in database</p>
<p><strong>deleteHotel</strong>
api takes hotel's id and search if exists in database it deletes it</p>
<p><strong>getHotel</strong> api return the hotel if exists using hotelId</p>
<p><strong>getAllHotels</strong> api get all hotels in database and return at max the max Limit sent by the user in frontend</p>
<p><strong>getHotels</strong> api takes max, min, city to search for all hotels that their names begin with city send by the user (not just the equal to it), have cheapestPrice that falls between min and max and returns them</p>
<p><strong>countByCity</strong> api takes city attribute and return the no of all hotels that exist in that city</p>
<p><strong>countByType</strong> api return the number of hotels, apartments, resorts, villas and cabins </p>
<p><strong>getHotelRooms</strong> api takes hotelId and returns all returns all types of rooms exist in this hotels</p>
<h3>Hotel Rate Controller</h3>
<p><strong>***To be clear that if any step isn't successfully executed we use next helper function to sent error this error is handled by errorhandler function in index.js ***</strong></p>
<p><strong>createRate</strong> api takes userId, hotelId, rating and create rate object and check if this user rated this hotel before if so we update it's value with the new rate sent if not we save new one in database then we get all rates of this hotel and iterate on them to set the new accumulative rate of the hotel and and update the rate in the hotel model in the database</p>
<p><strong>updateRate</strong> api takes hotelRate obj and updates in the database </p>
<p><strong>getRate</strong> api return the hotelRate using hotelRateId if exists</p>
<p><strong>getAllRates</strong> api return all hotel Rates from database</p>
<p><strong>deleteRate</strong> api deletes rate using rateId if exists</p>
<h2>Utils</h2>
<h4>error.js</h4>
<p>exports createError function creates new object of Error and sets status and message properties with the calling ones and return the error</p>
<h4>verify User.js</h4>
<h6>verifyToken</h6>
<p>if req doesn't have cokkies or accessToken inside cokkies return unauthorized message with status code 401 else verify the returned token with JWT in. env using verify function in jwt if error exist return token invalid with status code 403 and store decided in req.user then call next function </p>
<h6>verifyUser</h6>
<p>call verify token and sent req and res to it if req.user or req. user.isAdmin is true we call next function otherwise return unauthorized message with status code 403</p>
<h6>verifyAdmin</h6>
<p>like verifyUser but here we check if req.user.isAdmin is true we call next function</p>
<h2>Auth route</h2>
<p>here we call apis without verification as it'sn't needed here</p>
<h2>user route </h2>
<p>with delete user or getting all users we use verify Admin utilize, with updateUser, changePwd, getUser, getUserReservations, deleteReservation we use verify User middleware</p>
<h2>Hotel Route</h2>
<p>with createHotel, deleteHotel we use verify Admin, with update Hotel, get Hotel, get Hotels, get All Hotels, countByCity, countByType, createReservation we use verifyUser</p>
<h2>Room Route</h2>
<p>with create Room, update Room, updateRoomAvailability, deleteRoom we use verifyAdmin and with rest of apis we use verifyUser</p>
<h2>Hotel Rate</h2>
<p>we use only verifyUser middleware in this route</p>
<h2>Reservation Route</h2>
<p>with getReservation we use verifyUser middleware and with the rest apis we use verifyAdmin</p>
