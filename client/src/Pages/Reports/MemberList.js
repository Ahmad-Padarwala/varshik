import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../Layout/Sidebar";
import Switch from "react-switch";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { chipClasses } from "@mui/material";

const MemberList = () => {
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
  const [selectedYear, setSelectedYear] = useState(`${new Date().getFullYear() + 1}-${new Date().getMonth() + 1}-${new Date().getDate()}`);

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

  const getOnlyClanData = async (clanid) => {
    try {

     
        const yearRes = await axios.get(
          `${process.env.REACT_APP_PROXY}/getmember/${selectedYear}/${clanid}/${isClanChecked}`
        );
      
      



      setMember(yearRes.data);
      setFilterData(yearRes.data);
      // console.log(yearRes.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(filterData);

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

  useEffect(() => {
    const rows = member.filter((item) => {
      var credit = item.total_paid;
      var debit = item.total_debit;
      let total_credit = credit;
      let total_debit = debit;

      console.log("demo data");
      console.log(credit)
      console.log(debit)
      console.log(item.pre_entry)

      if (item.pre_entry > 0) {
        total_credit = credit + item.pre_entry;
      } else {
        total_debit = debit - item.pre_entry;
      }
      var ga = total_credit - total_debit; //gross amount
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

    setFilterData(rows);

    filterData.slice(
      currentPage * itemPerPage,
      (currentPage + 1) * itemPerPage
    );
  }, [showDebit, showCredit]);

  useEffect(() => { }, [filterData]);




  useEffect(() => {
    if (selectedClanId == "") {
      getData();
    } else {
      getOnlyClanData(selectedClanId);
    }
    getClan();
    getYearlyIncome();
  }, [selectedYear]);

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

  // const SelectClan = (clanName, clanId) => {
  //   setSelectedClanId(clanId);
  //   setSelectedClanName(clanName);
  // };

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
  const pageIndex = Array.from({ length: numberOfPage }, (_, idx) => idx + 1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      // html: "#my-table",
      name: "aakib",
    });
    doc.save("clan.pdf");
  };
  const downloadExcel = () => {

    
    const filterDataWithUniqueId = filterData.map((row, index) => ({ 
      ...row,
      uniqueId: row.id,
    }));
    console.log("*********row Data********");
    console.log(filterDataWithUniqueId);
    const dataWithConcatenatedNames = filterDataWithUniqueId.map(row => ({
      ...row,
      FullName: `${row.g_l_name} ${row.g_f_name} ${row.g_m_name}`
    }));
    const dataWithGrossAndOtherFields = dataWithConcatenatedNames.map(row => {
      let credit = row.total_paid;
      let debit = row.total_debit;
      let total_credit = credit;
      let total_debit = debit;

      if (row.pre_entry > 0) {
        total_credit = credit + row.pre_entry;
      } else {
        total_debit = debit - row.pre_entry;
      }

      let ga = total_credit - total_debit; //gross amount

      return {
       // Retain all other fields
        // ID : row.clanId,
        FullName: `${row.g_l_name} ${row.g_f_name} ${row.g_m_name}`,
        // Clan: row.Clan,
        // Opening_Amt: row.Opening_Amt,
        // Total_Debit: row.total_debit,
        // Total_Credit: row.total_credit,
        Gross: Math.abs(ga),
      };
    });
    const ws = XLSX.utils.json_to_sheet(dataWithGrossAndOtherFields, { header: Object.keys(dataWithGrossAndOtherFields[0]) });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "member_list.xlsx");
  };

  const downloadExcelWithDetail = () => {

    
    const filterDataWithUniqueId = filterData.map((row, index) => ({ 
      ...row,
      uniqueId: row.id,
    }));
    console.log("*********row Data********");
    console.log(filterDataWithUniqueId);
    const dataWithConcatenatedNames = filterDataWithUniqueId.map(row => ({
      ...row,
      FullName: `${row.g_l_name} ${row.g_f_name} ${row.g_m_name}`
    }));
    const dataWithGrossAndOtherFields = dataWithConcatenatedNames.map(row => {
      let credit = row.total_paid;
      let debit = row.total_debit;
      let total_credit = credit;
      let total_debit = debit;

      if (row.pre_entry > 0) {
        total_credit = credit + row.pre_entry;
      } else {
        total_debit = debit - row.pre_entry;
      }

      let ga = total_credit - total_debit; //gross amount

      return {
       // Retain all other fields
        //  ID : row.clanId,
        FullName: `${row.g_l_name} ${row.g_f_name} ${row.g_m_name}`,
        // Clan: row.clanName,
        Opening_Amt: row.pre_entry,
        Total_Debit: row.total_debit,
        Total_Credit: row.total_paid,
        Gross: ga,
      };
    });
    const ws = XLSX.utils.json_to_sheet(dataWithGrossAndOtherFields, { header: Object.keys(dataWithGrossAndOtherFields[0]) });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "member_list.xlsx");
  };





  // const downloadExcel = () => {
  //   const ws = XLSX.utils.json_to_sheet(filterData);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  //   XLSX.writeFile(wb, "member_list.xlsx");
  // };

  let grossTotal = 0;

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
                    
                    // onClick={() => searchFilter(selectedClanId)}
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

                {/* date input box */}
                <div>
                  <label htmlFor="year" style={{ marginRight: "10px" }}>
                    Year:-
                  </label>
                  <select
                    name="year"
                    id="year"
                    value={selectedYear}
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
                {/* {kdebit.map((k) => {
                  <td>amount : {k.f_name}</td>;
                })} */}
                {filterData.length > 0
                  ? filterData.map((e) => {
                    let flag = 0;
                    var d = e.join_date;
                    var credit = e.total_paid;
                    var debit = e.total_debit;
                    let total_credit = credit;
                    let total_debit = debit;

                    if (e.pre_entry > 0) {
                      total_credit = credit + e.pre_entry;
                    } else {
                      total_debit = debit - e.pre_entry;
                    }
                    var ga = total_credit - total_debit; //gross amount
                    if (ga < 0) {
                      grossTotal += ga;
                    }


                    return (
                      <>
                        <tr>
                          <th scope="row">{e.id}</th>

                          <td>
                            {showEngName && (
                              <div
                                id="member-name"
                                onClick={() => {
                                  fetchMemberOnClick(e.id);
                                }}
                              >{`${e.l_name} ${e.f_name} ${e.m_name}`}</div>
                            )}

                            {showGujName && (
                              <small
                                style={{ fontSize: "smaller" }}
                              >{`${e.g_l_name} ${e.g_f_name} ${e.g_m_name}`}</small>
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
                            {e.pre_entry >= 0 ? (
                              <p className="text-success">{e.pre_entry}</p>
                            ) : (
                              <p className="text-danger">{e.pre_entry}</p>
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
            <div className="col-lg-10">
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

              <button
                onClick={() => {
                  downloadExcelWithDetail();
                }}
                class="btn btn-success ml-2"
                id="hidden"
              >
                <i class="bi bi-file-earmark-excel"></i> Excel with Detail
              </button>
            </div>

            {/* <div class="col-lg-2 pagination" id="hidden">
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
      </section>
    </>
  );
};

export default MemberList;
