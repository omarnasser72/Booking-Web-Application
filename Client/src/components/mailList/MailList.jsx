import { useState } from "react";
import "./mailList.css";
import { useNavigate } from "react-router-dom";

const MailList = () => {
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const handleClick = () => {
    if (email) navigate("/register", { state: { Email: email } });
  };
  return (
    <div className="mail">
      <h1 className="mailTitle">Save time, save money !</h1>
      <span className="mailDesc">Sign up to Get Our last offers</span>
      <div className="mailInputContainer">
        <input
          type="text"
          placeholder="example@mail.com"
          onChange={handleChange}
        />
        <button onClick={handleClick}>Send</button>
      </div>
    </div>
  );
};

export default MailList;
