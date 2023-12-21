import React from "react";
import Navbar from "../../components/navbar/Navbar";
import checkoutSuccess from "./checkoutSuccess.scss";
import Footer from "../../components/footer/Footer";
import MailList from "../../components/mailList/MailList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const CheckOutSuccess = () => {
  return (
    <div className="checkoutContainer">
      <Navbar />
      <div className="checkout">
        <img src="https://res.cloudinary.com/omarnasser/image/upload/v1703110235/bill_cbymlm.png" />
      </div>
      <div className="checkoutMsg">
        <h2>Checkout Completed Successfully</h2>
        <FontAwesomeIcon
          icon={faCheck}
          className="checkIcon"
          style={{ color: "green", fontSize: "xx-large" }}
        />
      </div>
      <MailList />
      <Footer />
    </div>
  );
};

export default CheckOutSuccess;
