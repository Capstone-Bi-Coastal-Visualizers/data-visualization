import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import { Login, Signup } from "./AuthForm";
import { toggleModal, modalContent } from "../store/auth";
import Modal from "./Modal"

export const Home = () => {

  // const num = Math.floor(Math.random() * 6) + 1;

  return (
 
    <div className="search-modal-container">
      <div className="background-image"
        style={{
          backgroundImage: `url("images/6.png")`,
        }}
      >
        <SearchBar />
      </div>
      <Modal />
    </div>
  );
};

export default Home;
