import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Sidebar from '../../Layout/Sidebar'
import { useNavigate } from 'react-router-dom';
import Switch from "react-switch";

const MemberList = () => {
  const [member, setMember] = useState([]);
  const [clan, setClan] = useState([]);
  const [filterClan, setFilterClan] = useState('');
  const navigate = useNavigate();
  const [selectedClanId, setSelectedClanId] = useState('');
  const [selectedClanName, setSelectedClanName] = useState('');
  const[isClanChecked,setIsClanChecked]=useState(false);
  

  const getClan = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_PROXY}/getclan`)
      setClan(res.data)
    } catch (error) {
      console.log(error);
    }
  }

  const getData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_PROXY}/getmember`)
      setMember(res.data)
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getData()
    getClan()
  }, []);

  const deleteMember = async (id) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_PROXY}/deletemember/${id}`)


      getData()
    } catch (error) {
      window.alert(error)
    }
  }

  const fetchMemberOnClick = (data) => {
    // navigate('/MemberDetail', { state: {id:1} });

  }

  const isSubClanHandler=(checked)=>{
    setIsClanChecked(checked);
  }

  const setSearch = (e) => {
    setFilterClan(e.target.value);
  }

  const onSelectClan = (clanName, clanId) => {
    setSelectedClanId(clanId);
    setSelectedClanName(clanName);
  }

  const searchFilter=async()=>{


    const clanData = {
    selectedClanId: selectedClanId,
    selectedClanName: selectedClanName,
    isClanChecked: isClanChecked,
  };

    const res = await axios.post(`${process.env.REACT_APP_PROXY}/getMemberListByFilter`, clanData);
    setMember(res.data)

  }


  return (
    <>
      <Sidebar />
      <section className="dashboard">
        <div className="top">
          <i className="uil uil-bars sidebar-toggle" ></i>

          <div className="search-box">
            <i className="uil uil-search"></i>
            <input type="text" placeholder="Search here..." />
          </div>

        </div>

        <div className="dash-content  pt-3" >
          <div className="overview" >


            <div className="title" style={{ display: "flex", justifyContent: "right" }}>
              <NavLink to={`/addmember`} style={{ textDecoration: "none" }}>
                <button className='btn btn-primary d-flex ' style={{ justifyContent: "center", alignItems: "center" }}>
                  <i className="uil uil-plus mr-2" style={{ backgroundColor: "#007bff" }}></i>
                  Add New Member
                </button>
              </NavLink>
            </div>

            {/* <div className="boxes">
              <div className="box box1">
                <i className="uil uil-thumbs-up"></i>
                <span className="text">Total Likes</span>
                <span className="number">50,120</span>
              </div>
              <div className="box box2">
                <i className="uil uil-comments"></i>
                <span className="text">Comments</span>
                <span className="number">20,120</span>
              </div>
              <div className="box box3">
                <i className="uil uil-share"></i>
                <span className="text">Total Share</span>
                <span className="number">10,120</span>
              </div>
            </div> */}
          </div>

          <div className="activity ">

            <div>




              <div Style="display:block">
                <div Style="float:left">
                  <div className="title mt-0">
                    <i className="uil uil-clock-three"></i>
                    <span className="text">All Member</span>
                  </div>

              




                  <label className="label"><span className="key" >Clan Id:</span> {selectedClanId}</label>
                  <label className="label"><span className="key" >Clan Name:</span> {selectedClanName}</label>
                 
                     </div>
                   
                     <div  id="clanToggle">
                      <Switch  onChange={isSubClanHandler} checked={isClanChecked}></Switch>
                      <span Style="padding-left:10px;margin-bottom:1opx">Sub Clan</span>

                      <button onClick={searchFilter} className='btn btn-primary' Style="margin-left:25px;" >
                  <i className="uil uil-search mr-2" style={{ backgroundColor: "#007bff" }}></i>
                  Search
                </button>
                      </div>

                    
              </div>



              <div className="top">
                <i className="uil uil-bars sidebar-toggle" style={{ opacity: 0 }} ></i>

                <div>
                  {/* <div className="search-inner ">
              <input type="text" placeholder="Search here..." value={filterMember} onChange={setSerch} />
            </div> */}
                  <div className="input-group mb-1">
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" value={filterClan} onChange={setSearch} />
                    <div className="input-group-prepend">
                      <i className="uil uil-search input-group-text"></i>
                      {/* <span className="input-group-text" id="inputGroup-sizing-default">Default</span> */}
                    </div>
                  </div>
                  <div className="sfdropdown">

                    {clan
                      .filter((item) => {

                        const searchTerm = filterClan.toLowerCase();
                        const clanName = item.clan_name.toLowerCase();

                        return searchTerm && clanName.startsWith(searchTerm) && clanName !== searchTerm;

                      })


                      .map((item) => (
                        <div
                          onClick={() => onSelectClan(item.clan_name, item.id)}
                          className="sfdropdown-row"
                          key={item.id}
                        >
                          {item.clan_name}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>


            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Full Name</th>
                  <th scope="col">Clan</th>
                  <th scope="col">Joining Date</th>
                  <th scope="col">Credit</th>
                  <th scope="col">Debit</th>
                  <th scope="col">Gross</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {
                  member.map((e, idx) => {
                    let flag = 0;

                    // var dates=e.join_date.substring(0,10);
                    // console.log(e.join_date+" date: "+dates)
                    // var date = new Date(e.join_date).toJSON().slice(0,10)
                    // var components = date.split("-");
                    // var d = `${components[2]}-${components[1]}-${components[0]}`;

                    var d = e.join_date;

                    var debit = e.total_paid;
                    var credit = e.total_debit;
                    if (e.pre_entry > 0) {
                      debit = debit + e.pre_entry
                    }
                    else {
                      credit = credit - e.pre_entry
                    }
                    var ga = debit - credit
                    return (
                      <>

                        <tr >
                          <th scope="row">{e.roll_no}</th>
                          <td ><span id="member-name" onClick={() => { fetchMemberOnClick(e.roll_no) }}>{`${e.f_name} ${e.m_name} ${e.l_name}`}</span></td>
                          <td>
                            {
                              clan.map((x) => {
                                if (e.clanid === x.id) {
                                  flag = 1;
                                  return (x.clan_name)
                                }
                              })

                            }
                            {
                              flag === 0 ? "null" : ""
                            }
                          </td>
                          <td>{d}</td>
                          <td>{debit}</td>
                          <td>{credit}</td>
                          <td>{ga >= 0 ? <p className='text-success'>{ga}</p> : <p className='text-danger'>{ga}</p>}</td>
                          <td><button className='btn btn-danger' onClick={() => { deleteMember(e.id) }}>Delete</button></td>
                          <td><Link to="/editMember" state={{ id: e.id }}><button className='btn btn-success'>Edit</button></Link></td>
                        </tr>
                      </>
                    )
                  })
                }
              </tbody>
            </table>

          </div>
        </div>
      </section>

    </>
  )
}

export default MemberList