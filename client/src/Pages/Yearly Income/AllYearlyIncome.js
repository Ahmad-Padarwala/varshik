import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Sidebar from "../../Layout/Sidebar";
import TransitionAlerts from "../../Component/TransitionAlerts";
import CustomPrompt from "../../Component/CustomPrompt";

const AllYearlyIncome = () => {
  const [allyear, setAllyear] = useState([]);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_PROXY}/getyear`);
      setAllyear(res.data);
      console.log(res.data)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // prompt
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [obid, setobid] = React.useState("");

  const deleteYear = (id) => {
    setDialogOpen(true);
    setobid(id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAgreeDialog = async (value) => {
    if (value === "1234") {
      try {
        const res = await axios.delete(
          `${process.env.REACT_APP_PROXY}/deleteyear/${obid}`
        );
        getData();
        displayAlert("Success", "Year Income Deleted Successfully !", "OK");
      } catch (error) {
        setDialogOpen(false);
        displayAlert("Error", "Year Income Not Deleted !", "OK");
      }
    } else {
      displayAlert("Error", "Incorrect Captcha!", "Please Try Again");
    }
    setDialogOpen(false);
  };

  // Alert Box
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertActionText, setAlertActionText] = useState("");

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
      <section className="dashboard">
        <div className="top">
          <i className="uil uil-bars sidebar-toggle"></i>
          <div className="search-box">
            <i className="uil uil-search"></i>
            <input type="text" placeholder="Search here..." />
          </div>
        </div>

        <div className="dash-content pt-3">
          <div className="overview">
            <div
              className="title"
              style={{ display: "flex", justifyContent: "right" }}
            >
              <NavLink to={`/addyear`} style={{ textDecoration: "none" }}>
                <button
                  className="btn btn-primary d-flex "
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <i
                    className="uil uil-plus mr-2"
                    style={{ backgroundColor: "#007bff" }}
                  ></i>
                  Add New Year
                </button>
              </NavLink>
            </div>
          </div>

          <div className="activity ">
            <div className="title mt-0">
              <i className="uil uil-clock-three"></i>
              <span className="text">All Yearly Income</span>
            </div>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Start Year</th>
                  <th scope="col">End Year</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {allyear.map((e, idx) => {
                  var d = new Date(e.start_date);
                  var yyyy = d.getFullYear();
                  var mm = String(d.getMonth() + 1).padStart(2, "0");
                  var dd = String(d.getDate()).padStart(2, "0");

                  var d2 = new Date(e.end_date);
                  var yyyy2 = d2.getFullYear();
                  var mm2 = String(d2.getMonth() + 1).padStart(2, "0");
                  var dd2 = String(d2.getDate()).padStart(2, "0");
                  return (
                    <>
                      <tr key={e.id}>
                        <th scope="row">{e.id}</th>
                        <td>{e.amount}</td>
                        <td>{`${dd}-${mm}-${yyyy}`}</td>
                        <td>{`${dd2}-${mm2}-${yyyy2}`}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              navigate(`/edityearincome/${e.id}`);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ml-3"
                            onClick={() => {
                              deleteYear(e.id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>

            <CustomPrompt
              message="If you want to delete, enter 1234"
              open={dialogOpen}
              onClose={handleCloseDialog}
              onAgree={handleAgreeDialog}
            />

            <TransitionAlerts
              open={openAlert}
              handleClose={handleAlertClose}
              title={alertTitle}
              message={alertMessage}
              actionText={alertActionText}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default AllYearlyIncome;
