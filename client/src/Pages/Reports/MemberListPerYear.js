import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../Layout/Sidebar";
import Switch from "react-switch";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const MemberListPerYear = () => {
  const [member, setMember] = useState([]);
  const [clan, setClan] = useState([]);
  const [filterClan, setFilterClan] = useState("");
  const [selectedClanId, setSelectedClanId] = useState("");
  const [selectedClanName, setSelectedClanName] = useState("");
  const [isClanChecked, setIsClanChecked] = useState(false);
  const [showDebit, setShowDebit] = useState(true);
  const [showCredit, setShowCredit] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [showGujName, setShowGujName] = useState(true);
  const [showEngName, setShowEngName] = useState(true);
  const [allYear, setAllYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState(
    `${new Date().getFullYear() + 1}-${new Date().getMonth() + 1}-${new Date().getDate()}`
  );

  const [yearAgo, setYearAgo] = useState([]);
  const [pageSize, setPageSize] = useState(10); // Default page size is 20
  const [selectedRowsPerPage, setSelectedRowsPerPage] = useState(filterData.length);

  const [displayedData, setDisplayedData] = useState([]);
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

  let formattedOneYearAgo = '';

  const getYearlyIncome = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_PROXY}/getyear`);
      setAllYear(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setFilterData(member);
  }, [member]);

  const getData = async (date) => {
    try {
      const yearRes = await axios.get(
        `${process.env.REACT_APP_PROXY}/getmember/${selectedYear}`
      );

      setMember(yearRes.data);
      setFilterData(yearRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDebitClick = () => {
    setShowDebit(!showDebit);
  };

  const handleCreditClick = () => {
    setShowCredit(!showCredit);
  };

  const handleGujName = () => {
    setShowGujName(!showGujName);
  };
  const handleEngName = () => {
    setShowEngName(!showEngName);
  };

  // useEffect(() => {
  //   const rows = member.filter((item) => {
  //     if (showDebit && showCredit) {
  //       return true;
  //     }

  //     if (showDebit && item.total_paid - item.total_debit <= 0) {
  //       return true;
  //     }

  //     if (showCredit && item.total_paid - item.total_debit > 0) {
  //       return true;
  //     }

  //     return false;
  //   });

  //   setFilterData(rows);

  //   filterData.slice(
  //     currentPage * itemPerPage,
  //     (currentPage + 1) * itemPerPage
  //   );
  // }, [showDebit, showCredit]);
  useEffect(() => {
    const rows = yearAgo.filter((item) => {

      var credit = item.new_total_paid - item.old_total_paid;
      var debit = item.new_total_debit - item.old_total_debit;

      let total_credit = credit;
      let total_debit = debit;
      var gaa = (item.old_pre_entry + item.old_total_paid) - item.old_total_debit;
      if (gaa > 0) {
        total_credit = total_credit + gaa;
      } else {
        total_debit = total_debit - gaa;
      }

      var ga = total_credit - total_debit; //gross amount
      if (ga < 0) {
        grossTotal += ga;
      }
      if (showDebit && showCredit) {
        return true;
      }

      if (showDebit && ga < 0) {
        return true;
      }

      if (showCredit && ga >= 0) {
        return true;
      }

      return false;
    });
    setDisplayedData(
      (rows.length > 0 ? rows : filterData).slice(startIndex, endIndex)
    );
    setFilterData(rows);

    filterData.slice(
      currentPage * itemPerPage,
      (currentPage + 1) * itemPerPage
    );
  }, [showDebit, showCredit]);

  useEffect(() => { }, [filterData]);


  const fetchMemberOnClick = (data) => {
  };

  const isSubClanHandler = (checked) => {
    setIsClanChecked(checked);
  };

  const setSearch = (e) => {
    setFilterClan(e.target.value);
  };

  const searchRecords = () => {
    clan
      .filter((item) => {
        const searchTerm = filterClan.toLowerCase();
        const clanName = item.clan_name.toLowerCase();

        return searchTerm && clanName.startsWith(searchTerm);
      })
      .map((k) => {
        const clanName = k.clan_name;
        const clanId = k.id;

        onSelectClan(clanName, clanId);
      });
  };

  const onSelectClan = (clanName, clanId) => {
    setSelectedClanId(clanId);
    setSelectedClanName(clanName);
  };

  const getOnlyClanData = async (clanid) => {
    // console.log(clanid)
    try {
      const yearRes = await axios.get(
        `${process.env.REACT_APP_PROXY}/getmember/${selectedYear}/${clanid}`
      );

      setMember(yearRes.data);
      setFilterData(yearRes.data);
      // console.log(yearRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedClanId == "") {
      getData();
    } else {
      getOnlyClanData(selectedClanId);
    }
    getClan();
    getYearlyIncome();
  }, [selectedYear]);
  // console.log(filterData); 
  // console.log(displayedData)

  const searchFilter = async () => {
    const clanData = {
      selectedClanId: selectedClanId,
      selectedClanName: selectedClanName,
      isClanChecked: isClanChecked,
    };

    const res = await axios.post(
      `${process.env.REACT_APP_PROXY}/getMemberListByFilter`,
      clanData
    );
    if (res.data) {
      setMember(res.data);
    } else {
      setMember([]);
    }
  };

  const itemPerPage = 5;

  const numberOfPage = Math.ceil(member.length / itemPerPage);
  // const pageIndex = Array.from({ length: numberOfPage }, (_, idx) => idx + 1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      html: "#my-table",
    });
    doc.save("clan.pdf");
  };
  // const downloadExcel = () => {
  //   const ws = XLSX.utils.json_to_sheet(filterData);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  //   XLSX.writeFile(wb, "member_list.xlsx");
  // };
  const downloadExcel = () => {
    const dataWithUniqueId = filterData.map((row, index) => ({
      ...row,
      uniqueId: index + 1 // Assuming unique ID starts from 1
    }));

    // Convert data to Excel format
    const ws = XLSX.utils.json_to_sheet(dataWithUniqueId);

    // Create a new workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, "member_list.xlsx");
  };

  // Assuming selectedYear is a string representing a date
  const oneYearAgo = new Date(selectedYear);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Format the result if needed
  formattedOneYearAgo = `${oneYearAgo.getFullYear()}-${(
    oneYearAgo.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${oneYearAgo.getDate().toString().padStart(2, "0")}`;


  // const getOneYearAgoData = async () => {
  //   try {
  //     const yearAgoRes = await axios.get(
  //       `${process.env.REACT_APP_PROXY}/getmemberPerYearAgo/${formattedOneYearAgo}`
  //     )
  //     setYearAgo(yearAgoRes.data)
  //     console.log(yearAgoRes.data)
  //   }
  //   catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const yearAgoRes = await axios.get(
          `${process.env.REACT_APP_PROXY}/getmemberPerYearAgo/${formattedOneYearAgo}`
        );
        setYearAgo(yearAgoRes.data);
        setDisplayedData(yearAgoRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedYear && formattedOneYearAgo) {
      fetchData();
    }
  }, [selectedYear, formattedOneYearAgo]);

  //number paginatiopn
  const numberOfPages = Math.ceil((yearAgo.length > 0 ? yearAgo : filterData).length / selectedRowsPerPage);
  const pageIndex = Array.from({ length: numberOfPages }, (_, idx) => idx + 1);



  const handleRowsPerPageChange = (e) => {
    setCurrentPage(0);
    setSelectedRowsPerPage(parseInt(e.target.value, 10));
  };

  let grossTotal = 0
  const startIndex = currentPage * selectedRowsPerPage;
  const endIndex = startIndex + selectedRowsPerPage;
  // const displayedData = (yearAgo.length > 0 ? yearAgo : filterData).slice(startIndex, endIndex);


  useEffect(() => {
    if (filterData.length > 0) {
      setSelectedRowsPerPage(filterData.length);
    } else {
      setSelectedRowsPerPage(pageSize); // Set to default value if filterData is empty
    }
  }, [filterData]);
  return (
    <>
      <div>
        <Sidebar />
      </div>
      <section class="dashboard">
        <div class="dash-content  pt-3">
          <div
            class="flex justify-content-between bg-light my-0 py-2 px-3"
            id="hidden"
          >
            {/*All Member Title*/}
            <div class="title m-0">
              <i class="uil uil-clock-three"></i>
              <span class="text">All Members</span>
            </div>
            {/*Clan Search Dropdown */}

            <div class="center m-0 ">
              <div class="input-group mb-1 ">
                <input
                  type="text"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                  value={filterClan}
                  onChange={setSearch}
                />
                <div class="input-group-prepend">
                  <i
                    class="uil uil-search input-group-text"
                    onClick={searchRecords}
                  ></i>
                  {/* <span class="input-group-text" id="inputGroup-sizing-default">Default</span> */}
                </div>
              </div>
              <div className="sfdropdown">
                {clan
                  .filter((item) => {
                    const searchTerm = filterClan.toLowerCase();
                    const clanName = item.clan_name.toLowerCase();

                    return (
                      searchTerm &&
                      clanName.startsWith(searchTerm) &&
                      clanName !== searchTerm
                    );
                  })

                  .map((item) => (
                    <div
                      onClick={() => {
                        onSelectClan(item.clan_name, item.id);
                        setFilterClan(item.clan_name);
                      }}
                      className="sfdropdown-row"
                      key={item.id}
                    >
                      {item.clan_name}
                    </div>
                  ))}
              </div>
            </div>

            {/*Add New Member button */}
            <div class="title m-0">
              <NavLink to={`/addmember`} style={{ textDecoration: "none" }}>
                <button
                  className="btn btn-primary d-flex "
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <i
                    class="uil uil-plus mr-2"
                    style={{ backgroundColor: "#007bff" }}
                  ></i>
                  Add New Member
                </button>
              </NavLink>
            </div>
          </div>

          <div class="activity ">
            <div>
              {/* clan detail */}
              <div
                class="flex justify-content-start align-items-center py-2"
                Style="background-color:#ffe4c414"
              >
                <div>
                  <span class="key label">Clan Id:</span>
                  <span>{selectedClanId}</span>
                  <span class="key label">Clan Name:</span>
                  <span>{selectedClanName}</span>
                </div>
                <div className="flex align-items-center">
                  {/* toggle Button For subclan */}
                  <Switch
                    onChange={isSubClanHandler}
                    checked={isClanChecked}
                  ></Switch>

                  <span Style="padding-left:10px;margin-bottom:1opx">
                    Sub Clan
                  </span>

                  <button
                    onClick={() => getOnlyClanData(selectedClanId)}
                    className="btn btn-primary"
                    Style="margin-left:25px;"
                  >
                    <i
                      class="uil uil-search mr-2"
                      style={{ backgroundColor: "#007bff" }}
                    ></i>
                    Search
                  </button>
                </div>
              </div>

              <div className="flex px-2 justify-content-between py-1">
                {/* debit and credit check box */}
                <div className="flex px-2 justify-content-between py-1">
                  <div className="form-check ">
                    <input
                      class="form-check-input w-auto"
                      type="checkbox"
                      onClick={handleCreditClick}
                      checked={showCredit}
                    />
                    <label class="form-check-label">Credit</label>
                  </div>

                  <div className="form-check ml-4">
                    <input
                      class="form-check-input w-auto"
                      type="checkbox"
                      onClick={handleDebitClick}
                      checked={showDebit}
                    />
                    <label class="form-check-label">Debit</label>
                  </div>
                </div>

                {/* gujarati / english name box */}
                <div className="flex px-2 justify-content-between py-1">
                  <div className="form-check ml-4">
                    <input
                      class="form-check-input w-auto"
                      type="checkbox"
                      onClick={handleGujName}
                      checked={showGujName}
                    />
                    <label class="form-check-label">Gujarati</label>
                  </div>

                  <div className="form-check ml-4">
                    <input
                      class="form-check-input w-auto"
                      type="checkbox"
                      onClick={handleEngName}
                      checked={showEngName}
                    />
                    <label class="form-check-label">English</label>
                  </div>
                </div>

                {/* <div className="pagination" id="hidden">
                  <label htmlFor="rowsPerPage" className="me-5">Rows per page:</label>
                 
                  <select className="form-select px-1 gross_select_box" aria-label="Default select example" id="rowsPerPage"
                    value={selectedRowsPerPage}
                    onChange={handleRowsPerPageChange}
                  >
                    <option value={5}>5</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={filterData.length} selected>All</option>
                  </select>
                </div> */}

                {/* date input box */}
                <div>
                  <label htmlFor="year" style={{ marginRight: "10px" }}>
                    Year:-
                  </label>
                  <select
                    name="year"
                    id="year"
                    value={selectedYear}
                    className="gross_select_box"
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {/* <option value={allYear[0].end_date}>all</option> */}
                    {allYear.map((year) => (
                      <option key={year.end_date} value={year.end_date}>
                        {year.end_date.slice(0, 4)}
                      </option>
                    ))}
                  </select>

                </div>
              </div>
            </div>

            {/* Show member Data */}


            <table id="my-table" class="table table-striped mt-2">
              <thead>
                <tr className="bg-light">
                  <th scope="col">ID</th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => sorting("f_name")}
                  >
                    Full Name <i class="bi bi-funnel-fill"></i>
                  </th>
                  <th scope="col">Clan</th>
                  <th scope="col">Opening bal.</th>
                  <th scope="col">Credit</th>
                  <th scope="col">Varshik Debit</th>
                  <th scope="col">Gross</th>
                </tr>
              </thead>

              <tbody>
                {displayedData.length > 0
                  ? displayedData.map((e, i) => {
                    let flag = 0;
                    var d = e.join_date;
                    var credit = e.new_total_paid - e.old_total_paid;
                    var debit = e.new_total_debit - e.old_total_debit;
                    let total_credit = credit;
                    let total_debit = debit;
                    var gaa = (e.old_pre_entry + e.old_total_paid) - e.old_total_debit;
                    if (gaa > 0) {
                      total_credit = total_credit - gaa;
                    } else {
                      total_debit = total_debit + gaa;
                    }

                    var ga = total_credit - total_debit; //gross amount
                    if (ga < 0) {
                      grossTotal += ga;
                    }
                    return (
                      <>

                        <tr>
                          <th scope="row">{i + 1}</th>

                          <td>
                            {showEngName && (
                              <div
                                id="member-name"
                                onClick={() => {
                                  fetchMemberOnClick(e.id);
                                }}
                              >{`${e.f_name} ${e.m_name} ${e.l_name}`}</div>
                            )}

                            {showGujName && (
                              <small
                                className="gujarati-name"
                              >{`${e.g_f_name} ${e.g_m_name} ${e.g_l_name}`}</small>
                            )}
                          </td>
                          <td>
                            {clan.map((x) => {
                              if (e.clanid === x.id) {
                                flag = 1;
                                return x.clan_name;
                              }
                            })}
                            {flag === 0 ? "null" : ""}
                          </td>
                          <td>
                            {gaa >= 0 ? (
                              <p className="text-success">{gaa}</p>
                            ) : (
                              <p className="text-danger">{gaa}</p>
                            )}
                          </td>
                          <td>{credit}</td>
                          <td>{debit}</td>

                          <td>
                            {ga >= 0 ? (
                              <p className="text-success">{ga}</p>
                            ) : (
                              <p className="text-danger">{ga}</p>
                            )}
                          </td>
                        </tr>
                      </>
                    );
                  })
                  : ""}
              </tbody>
            </table>
          </div>

          <div class="print-row">
            <div className="col-lg-8">
              <button
                onClick={() => {
                  downloadPdf();
                }}
                class="btn btn-primary"
                id="hidden"
              >
                <i class="bi bi-printer"></i> Print
              </button>
              <button
                onClick={() => {
                  downloadExcel();
                }}
                class="btn btn-success ml-2"
                id="hidden"
              >
                <i class="bi bi-file-earmark-excel"></i> Excel
              </button>
            </div>


            {/* <div class="col-lg-4 pagination" id="hidden">
              <button
                disabled={currentPage < 1}
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
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
                        onClick={() => handlePageChange(page - 1)}
                        className={
                          page === currentPage + 1
                            ? "active page-link bg-primary text-white"
                            : "page-link"
                        }
                      >
                        {page}
                      </button>
                    </>
                  );
                })}
              <button
                disabled={currentPage >= numberOfPage - 1}
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                &gt;
              </button>
            </div> */}
          </div>
        </div>
        <p style={{ fontWeight: 'bold', marginTop: '10px' }}>Total Gross:-<span style={{ fontWeight: 'normal', marginLeft: '10px' }}>{Math.abs(grossTotal)}</span></p>
      </section >
    </>
  );
};

export default MemberListPerYear;
