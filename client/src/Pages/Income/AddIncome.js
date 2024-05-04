import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../Layout/Sidebar";
import TransitionAlerts from "../../Component/TransitionAlerts";

const AddIncome = () => {
  const navigate = useNavigate();
  const [ititle, setItitle] = useState("");
  const [idisc, setIdisc] = useState("");
  const [idate, setIdate] = useState("");
  const [icollectedby, setIcollectedby] = useState("");
  const [ipayments, setIpayments] = useState("");
  const [ireceived, setIreceived] = useState("");
  const [categoryid, setCategoryid] = useState("");
  const [income, setIncome] = useState([]);

  const getData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_PROXY}/getincomecategory`);
      setIncome(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);


  // save data
  const savedata = async (e) => {
    e.preventDefault();
    const team = {
      ititle: ititle,
      idisc: idisc,
      idate: idate,
      icollectedby: icollectedby,
      ipayments: ipayments,
      ireceived: ireceived,
      categoryid: categoryid,
    };
    console.log(team);
    try {
      await axios
        .post(`${process.env.REACT_APP_PROXY}/addincome`, team)
        .then((res) => {
          console.log(res);
          navigate("/allincome", { replace: true });
        })
        .catch((e) => {
          displayAlert('Error', 'Income Not Added!', 'OK');
          console.log(e);
        });
    } catch (error) {
      displayAlert('Error', 'Income Not Added!', 'OK');
      console.log(error);
    }
  };


    // Alert Box
    const [openAlert, setOpenAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertActionText, setAlertActionText] = useState('');
  
    const handleAlertClose = () => {
      setOpenAlert(false);
    };
  
    const displayAlert = (title, message, actionText) => {
      setAlertTitle(title);
      setAlertMessage(message);
      setAlertActionText(actionText);
      setOpenAlert(true);
    };
  
  return (
    <>
      <Sidebar />
      <section class="dashboard">
        <div class="top">
          <i class="uil uil-bars sidebar-toggle"></i>

          <div class="search-box">
            <i class="uil uil-search"></i>
            <input type="text" placeholder="Search here..." />
          </div>
        </div>

        <div class="dash-content mt-5">
          <div class="card">
            <span class="title mt-2">Add New Income </span>
            <form class="form">
              <div class="group">
                <input
                  placeholder=""
                  type="text"
                  value={ititle}
                  onChange={(e) => {
                    setItitle(e.target.value);
                  }}
                />
                <label for="name">Income Title</label>
              </div>
              <div class="group">
                <input
                  placeholder=""
                  type="text"
                  value={idisc}
                  onChange={(e) => {
                    setIdisc(e.target.value);
                  }}
                />
                <label for="name">Income Description</label>
              </div>
              <div class="group">
                <input
                  placeholder=""
                  type="date"
                  value={idate}
                  onChange={(e) => {
                    setIdate(e.target.value);
                  }}
                />
                <label for="name">Income Date</label>
              </div>
              <div class="group">
                <input
                  placeholder=""
                  type="text"
                  value={icollectedby}
                  onChange={(e) => {
                    setIcollectedby(e.target.value);
                  }}
                />
                <label for="name">Income Collected by</label>
              </div>

              <div class="group">
                <input
                  placeholder=""
                  type="number"
                  value={ireceived}
                  onChange={(e) => {
                    setIreceived(e.target.value);
                  }}
                />
                <label for="name">Received Income</label>
              </div>

              <label className="my-2 mb-4">Income Payment</label>
              <div className="group">
                <label for="exampleInputEmail1">Income Payment</label>
                <select
                  name="i_payments"
                  placeholder=""
                  id="i_payments"
                  value={ipayments}
                  onChange={(e) => {
                    setIpayments(e.target.value);
                  }}
                >
                  <option value="" selected disabled>Select Payment Method</option>
                  <option value="cash">💲 Cash</option>
                  <option value="check">💶 Check</option>
                  <option value="online">🤑 Online</option>
                </select>
              </div>

              <label className="my-2 mb-4">Income Category ID</label>
              <div className="group">
                <label for="exampleInputEmail1">Income Category ID</label>
                <select
                  name="category_id"
                  placeholder=""
                  id="category_id"
                  value={categoryid}
                  onChange={(e) => {
                    setCategoryid(e.target.value);
                  }}
                >
                  <option value={''} selected disabled >Select Income Category ID</option>
                  {income.map((e) => {
                    return (
                      <>
                        <option value={e.id}>{e.i_category}</option>
                      </>
                    );
                  })}
                </select>
              </div>
              <button type="submit" onClick={savedata}>
                Submit
              </button>
              <TransitionAlerts
                open={openAlert}
                handleClose={handleAlertClose}
                title={alertTitle}
                message={alertMessage}
                actionText={alertActionText}
              />
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddIncome;
