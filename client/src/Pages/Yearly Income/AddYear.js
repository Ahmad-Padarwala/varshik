import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Layout/Sidebar";

const AddYear = () => {
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState(Date);
  const [endDate, setEndDate] = useState(Date);

  const navigate = useNavigate();

  const savedata = async (e) => {
    e.preventDefault();
    const team = {
      amount: amount,
      startDate: startDate,
      endDate: endDate,
    };
    try {
      await axios
        .post(`${process.env.REACT_APP_PROXY}/addyear`, team)
        .then((res) => {
          navigate("/allyearlyincome");
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Sidebar />
      <section className="dashboard">
        <div className="top">
          <i className="uil uil-bars sidebar-toggle"></i>
          <div className="search-box">
            <i className="uil uil-search"></i>
            <input type="text" placeholder="Search here..." />
          </div>
        </div>

        <div className="dash-content   mt-5">
          <div className="card">
            <span className="title mt-2">Add New Year </span>
            <form className="form">
              <div className="group">
                <input
                  placeholder=""
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    if (!isNaN(e.target.value)) {
                      setAmount(e.target.value);
                    }
                  }}
                />
                <label for="name">Year Amount</label>
              </div>

              <div className="group mt-4">
                <input
                  placeholder=""
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                />
                <label for="name">Start Year</label>
              </div>
              <div className="group mt-4">
                <input
                  placeholder=""
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
                />
                <label for="name">End Year</label>
              </div>

              <button type="submit" onClick={savedata}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddYear;
