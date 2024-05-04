import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../Layout/Sidebar";

const EditYear = () => {
  const { id } = useParams("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  const UpdateYearIncome = async (e) => {
    e.preventDefault();
    const team = {
      amount: amount,
      start_date: startDate,
      end_date: endDate,
    };
    try {
      await axios
        .patch(`${process.env.REACT_APP_PROXY}/edityearincome/${id}`, team)
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

  const getData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_PROXY}/getperyearincome/${id}`
      );
      const originalStartDate = new Date(res.data[0].start_date);
      const originalEndDate = new Date(res.data[0].end_date);
      const incrementedStartDate = new Date(originalStartDate);
      incrementedStartDate.setDate(originalStartDate.getDate());
      const incrementedEndDate = new Date(originalEndDate);
      incrementedEndDate.setDate(originalEndDate.getDate());
      setAmount(res.data[0].amount);
      setStartDate(incrementedStartDate.toISOString().split("T")[0]);
      setEndDate(incrementedEndDate.toISOString().split("T")[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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

        <div className="dash-content mt-5">
          <div className="card">
            <span className="title mt-2">Add New Year</span>
            <form className="form">
              <div className="group">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    if (!isNaN(e.target.value)) {
                      setAmount(e.target.value);
                    }
                  }}
                />
                <label htmlFor="name">Year Amount</label>
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
                <label htmlFor="name">Start Date</label>
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
                <label htmlFor="name">End Date</label>
              </div>

              <button type="submit" onClick={UpdateYearIncome}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditYear;
