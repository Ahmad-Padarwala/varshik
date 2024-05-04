import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Box, Pagination } from "@mui/material";
import Sidebar from "../../Layout/Sidebar";
import TransitionAlerts from "../../Component/TransitionAlerts";
import CustomPrompt from "../../Component/CustomPrompt";

const AllMember = () => {
  const [member, setMember] = useState([]);
  const [clan, setClan] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [page, setPage] = useState(1);
  const [filteredMembers, setfilteredMembers] = useState([]);

  const itemsPerPage = 5;

  const [order, setOrder] = useState("ASC");

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...member].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setMember(sorted);
      setOrder("DSC");
    }

    if (order === "DSC") {
      const sorted = [...member].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setMember(sorted);
      setOrder("ASC");
    }
  };

  const getClan = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_PROXY}/getclan`);
      setClan(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_PROXY}/getmember`);
      console.log(res.data);
      setMember(res.data);
      setfilteredMembers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    getClan();
  }, []);

  const fetchMemberOnClick = (data) => {
    console.log("Clicked On =", data);
    // navigate('/MemberDetail', { state: {id:1} });
  };

  // prompt Start
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [obid, setobid] = React.useState("");

  const deleteMember = (id) => {
    setDialogOpen(true);
    setobid(id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAgreeDialog = async (value) => {
    if (value === "1234") {
      try {
        await axios.delete(`${process.env.REACT_APP_PROXY}/deletemember/${obid}`);
        getData();
      } catch (error) {
        displayAlert("Error", "Memeber Not Deleted!", "Please Try Again");
      }
    } else {
      displayAlert("Error", "Memeber Not Deleted!", "Please Try Again");
    }
    setDialogOpen(false);
  };

  // PROMPT end

  // Filter
  const filterMembers = () => {
    return member.filter((item) => {
      var searchTerm = "";
      const fname = item.f_name.toLowerCase();
      const mname = item.m_name.toLowerCase();
      const lname = item.l_name.toLowerCase();

      if (searchFilter) {
        searchTerm = searchFilter;
      }
      const group = `${item.f_name} ${item.m_name} ${item.l_name}`;
      return (
        searchTerm.toLowerCase() === "" ||
        fname.includes(searchTerm) ||
        lname.includes(searchTerm) ||
        mname.includes(searchTerm)
        // item.join_date.toLowerCase().includes(searchTerm) ||
        // group.toLowerCase().includes(searchTerm) ||
        // Number(searchTerm) === item.id
      );
    });
  };

  useEffect(() => {
    setfilteredMembers(filterMembers());
    console.log(filterMembers());
  }, [searchFilter]);

  // pagination
  const [currentPage, setCurrentPage] = useState(0);

  const itemPerPage = 4;

  const numberOfPage = Math.ceil(filteredMembers.length / itemPerPage);
  const pageIndex = Array.from({ length: numberOfPage }, (_, idx) => idx + 1);

  const handlePageChangeforpagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const rows = filteredMembers;
  // const rows = filteredMembers.slice(
  //   currentPage * itemPerPage,
  //   (currentPage + 1) * itemPerPage
  // );

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
          {/* <i className="uil uil-bars sidebar-toggle"></i> */}
          
          
          <div className="title ">
            <i className="uil uil-clock-three icon-blue"></i>
            <span className="text">All Member</span>
          </div>
          
          <div className="search-box">
            <i className="uil uil-search"></i>
            <input
              type="search"
              placeholder="Search here..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          <div className="overview ">
            <div
              className="title"
              style={{ display: "flex", justifyContent: "right" }}
            >
              <NavLink to={`/addmember`} style={{ textDecoration: "none" }}>
                <button
                  className="btn btn-primary d-flex "
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <i
                    className="uil uil-plus mr-2"
                    style={{ backgroundColor: "#007bff" }}
                  ></i>
                  Add New Member
                </button>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="dash-content">
          <div className="activity">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => sorting("f_name")}
                    scope="col"
                  >
                    Full Name <i className="bi bi-funnel-fill"></i>
                  </th>
                  <th scope="col">Clan</th>
                  <th scope="col">Joining Date</th>
                  <th scope="col">Credit</th>
                  <th scope="col">Debit</th>
                  <th scope="col">Gross</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows.map((e, idx) => {
                    let flag = 0;

                    const d = e.join_date;
                    let debit = e.total_paid;
                    let credit = e.total_debit;

                    if (e.pre_entry > 0) {
                      debit += e.pre_entry;
                    } else {
                      credit -= e.pre_entry;
                    }

                    const ga = debit - credit;
                    return (
                      <>
                        <tr key={idx}>
                          <th scope="row">{e.id}</th>
                          <td>
                            <span
                              id="member-name"
                              onClick={() => {
                                fetchMemberOnClick(e.id);
                              }}
                            >
                              {`${e.l_name} ${e.f_name} ${e.m_name} `}
                              <br />
                              <small
                                style={{ fontSize: "smaller" }}
                              >{`${e.g_l_name} ${e.g_f_name} ${e.g_m_name} `}</small>
                            </span>
                          </td>
                          <td>
                            {clan.map((x) => {
                              if (e.clanid === x.id) {
                                flag = 1;
                                return x.clan_name;
                              }
                              return null;
                            })}
                            {flag === 0 ? "null" : ""}
                          </td>
                          <td>{d}</td>
                          <td>{debit}</td>
                          <td>{credit}</td>
                          <td>
                            {ga >= 0 ? (
                              <p className="text-success">{ga}</p>
                            ) : (
                              <p className="text-danger">{ga}</p>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                deleteMember(e.id);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                          <td>
                            <Link to="/editMember" state={{ id: e.id }}>
                              <button className="btn btn-success">Edit</button>
                            </Link>
                          </td>
                        </tr>
                      </>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8">No members found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* pagination start */}
          {/* <div className="pagination" style={{ display: "flex", justifyContent: "right", marginRight: "2rem" }}>
            <button
              disabled={currentPage < 1}
              className="page-link"
              onClick={() => handlePageChangeforpagination(currentPage - 1)}
            >
              &lt;
            </button>
            {pageIndex
              .slice(
                Math.max(0, currentPage - 2),
                Math.min(numberOfPage, currentPage + 3)
              )
              .map((page) => {
                return (
                  <>
                    <button
                      key={page}
                      onClick={() => handlePageChangeforpagination(page - 1)}
                      className={page === currentPage + 1 ? "active page-link bg-primary text-white" : "page-link"}
                    >
                      {page}
                    </button>
                  </>
                )
              })
            }
            <button
              disabled={currentPage >= numberOfPage - 1}
              className="page-link"
              onClick={() => handlePageChangeforpagination(currentPage + 1)}
            >
              &gt;
            </button>
           
          </div> */}

          {/* pagination end */}

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
      </section>
    </>
  );
};

export default AllMember;
