import React from "react";
import "./footer.css";
import playstore from "../../../images/playstore.png";
import app_store from "../../../images/app_store.jpg";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p> Download app for Android and IOS </p>
        <img src={playstore} alt="playstore" />
        <img src={app_store} alt="ios"></img>
      </div>
      <div className="midFooter">
        <h1>Ecommerce</h1>
        <p>High Quality Products</p>
        <p>copyrights 2022 &copy; myEcommerce</p>
      </div>
      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="#">Instagram</a>
        <a href="#">Youtube</a>
        <a href="#">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
