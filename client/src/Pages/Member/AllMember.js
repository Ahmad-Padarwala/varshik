import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Box, Pagination } from "@mui/material";
import Sidebar from "../../Layout/Sidebar";
import TransitionAlerts from "../../Component/TransitionAlerts";
import CustomPrompt from "../../Component/CustomPrompt";
import ConfirmDialog from "../../Component/ConfirmDialog";
import EditMemberDialog from "../../Component/EditMemberDialog";

const AllMember = () => {
  const [member, setMember] = useState([]);
  const [clan, setClan] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [page, setPage] = useState(1);
  const [filteredMembers, setfilteredMembers] = useState([]);
  const [memberIdToDelete, setMemberIdToDelete] = useState("");

  // state to manage confirm dialogue
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  // function which call when we close confirm dialogue
  const closeConfirm = () => {
    setIsOpenConfirm(false);
  };

  // Function to handle when Agree is clicked in ConfirmDialog
  const handleAgreeConfirm = () => {
    forceDeleteMember(memberIdToDelete);
  };

  // Function will call when we will call it
  const displayConfirm = async (title, message, memberId) => {
    setConfirmTitle(title);
    setConfirmMessage(message);

    setMemberIdToDelete(memberId);
    setIsOpenConfirm(true);

    // setMemberIdToDelete(id);
  };

  const forceDeleteMember = async (memberId) => {
    try {
      axios
        .delete(
          `${process.env.REACT_APP_PROXY}/deletePaymentByMember/${memberId}`
        )
        .then((res) => {
          if (res.data.success) {
            handleDeleteMember();
            setIsOpenConfirm(false);
          } else {
            displayAlert("Delete Failed", " Data Can not be Deleted");
          }
        })
        .catch((err) => {
          displayAlert("Delete Failed", " Data Can not be Deleted");
        });
    } catch (error) { }

    closeConfirm();
  };

  // State to manage the edit dialog
  const [isOpenEditMemberPopup, setisOpenEditMemberPopup] = useState(false);
  const [selectedData, setSelectedData] = useState("");

  // Function to open the edit dialog with member data
  const openEditDialog = (data) => {
    console.log("reached");
    setSelectedData(data);
    setisOpenEditMemberPopup(true);
  };

  const closeEditMemberPopup = () => {
    console.log("reached");

    setisOpenEditMemberPopup(false);
    getData();
  };

  useEffect(() => {
    getData();
    getClan();
  }, []);

  //sorting
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

  //get all clan List
  const getClan = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_PROXY}/getclan`);
      setClan(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  //get All the Data
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

  //fetch Member on click
  const fetchMemberOnClick = (data) => {
    console.log("Clicked On =", data);
    // navigate('/MemberDetail', { state: {id:1} });
  };

  // prompt Start
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [obid, setObid] = React.useState();

  const deleteMember = (id) => {
    setDialogOpen(true);
    setObid(id);
  };
  const handleDeleteMember = async () => {
    try {
      console.log(obid);
      await axios
        .delete(`${process.env.REACT_APP_PROXY}/deletemember/${obid}`)
        .then((res) => {
          console.log("after delete");
          console.log(res);

          if (res.data.success) {
            getData();
          } else if (
            !res.data.success &&
            res.data.code == process.env.REACT_APP_ERR_DELETE_FOREIGN
          ) {
            displayConfirm(
              " Member is Active Are you Sure You want to delete ?",
              "All Data Associated With The Member will be Deleted and cannot be recovered ",
              obid
            );
          }
        })
        .catch((error) => {
          displayAlert(
            "Error",
            "Something Went Wrong ",
            "Please Contact Your Service Provider"
          );
        });
    } catch (error) {
      displayAlert("Error", "Memeber Not Deleted!", "Please Try Again");
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAgreeDialog = async (value) => {
    if (value === "1234") {
      handleDeleteMember();
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
      const clanName =
        clan.find((c) => c.id === item.clanid)?.clan_name.toLowerCase() || "";

      if (searchFilter) {
        searchTerm = searchFilter.toLowerCase();
      }
      const group = `${item.f_name} ${item.m_name} ${item.l_name}`;
      return (
        searchTerm.toLowerCase() === "" ||
        fname.startsWith(searchTerm) ||
        // lname.startsWith(searchTerm) ||
        mname.startsWith(searchTerm) ||
        clanName.startsWith(searchTerm)
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
          <i className="uil uil-bars sidebar-toggle"></i>

          <div className="search-box">
            <i className="uil uil-search"></i>
            <input
              type="search"
              placeholder="Search here..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>





        </div>

        <div className="dash-content">
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

          <div className="activity">

            <div className="title mt-0">
              <i className="uil uil-clock-three icon-blue"></i>
              <span className="text">All Member</span>
            </div>
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
                  rows.map((data, idx) => {
                    let flag = 0;

                    const d = data.join_date;
                    let debit = data.total_paid;
                    let credit = data.total_debit;

                    if (data.pre_entry > 0) {
                      debit += data.pre_entry;
                    } else {
                      credit -= data.pre_entry;
                    }

                    const ga = debit - credit;
                    return (
                      <>
                        <tr
                          key={idx}
                          onDoubleClick={() => {
                            openEditDialog(data);
                          }}
                        >
                          <th scope="row">{data.id}</th>
                          <td>
                            <span
                              id="member-name"
                              onClick={() => {
                                fetchMemberOnClick(data.id);
                              }}
                            >
                              {`${data.l_name} ${data.f_name} ${data.m_name} `}
                              <br />
                              <small
                                style={{ fontSize: "smaller" }}
                              >{`${data.g_l_name} ${data.g_f_name} ${data.g_m_name} `}</small>
                            </span>
                          </td>

                          <td>
                            {clan.map((x) => {
                              if (data.clanid === x.id) {
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

                          {/* Delete Member Button */}
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                deleteMember(data.id);
                              }}
                            >
                              Delete
                            </button>
                          </td>

                          {/* edit Member Button */}
                          <td>
                            <Link to="/editMember" state={{ id: data.id }}>
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

          <ConfirmDialog
            open={isOpenConfirm}
            handleClose={closeConfirm}
            title={confirmTitle}
            message={confirmMessage}
            onAgree={handleAgreeConfirm}
            onDisagree={closeConfirm}
          />
        </div>
      </section>

      <EditMemberDialog
        isOpen={isOpenEditMemberPopup}
        onClose={closeEditMemberPopup}
        data={selectedData}
      />
    </>
  );
};

export default AllMember;
