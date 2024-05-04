import axios from "axios";
import { useEffect, useState } from "react";

import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
const EditMemberDialog = ({ isOpen, onClose, data }) => {


  const navigate = useNavigate();
  const [formData, setFormData] = useState(data || {});
  const [clanList, setClanList] = useState([]);
  
  //clear state before closing dialog box
  const closeDialog=()=>{
    setFormData([]);
    setClanList([]);
    onClose();
  }

  

  useEffect(() => {
    fetchClanList();
    setFormData(data || {});
    console.log(formData)
   
  }, [data]
  )

   //fetch clan list 
   const fetchClanList = async () => {

    try {
      const res = await axios.get(`${process.env.REACT_APP_PROXY}/getclan`);
      setClanList(res.data);
      // console.log(clanList)
    } catch (error) {
      console.log(error);
    }
  }


// handle Form Data
const handleInputChange = (e) => {
  console.log(e)
  const { name, value } = e.target;
  console.log(e.target)
  setFormData({
    ...formData,
    [name]: value,
  });
};




//handle updated data
const handleUpdate=async(e)=>{
  e.preventDefault();
  console.log("reached for update")
 console.log(formData)
  await axios.post(`${process.env.REACT_APP_PROXY}/quickUpdateMember`,formData).then((res)=>{
      closeDialog();
      
  }).catch((e) => {
          console.log(e);
         alert("updateFailed");
        })

}


  if (!isOpen) return null;

 
  return (

   
    <div className="popup">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        
        <div class="form-container">
          <form onSubmit={handleUpdate}>
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="{firstName}" name="f_name" value={formData.f_name}
                onChange={handleInputChange} required />
              </div>
              <div class="form-group">
                <label for="middleName">Middle Name</label>
                <input type="text" id="middleName" name="m_name" value={formData.m_name}
                onChange={handleInputChange}/>
              </div>
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" name="l_name" value={formData.l_name}
                onChange={handleInputChange} required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="gujFirstName">Guj First Name</label>
                <input type="text" id="gujFirstName" name="g_f_name" value={formData.g_f_name}
                onChange={handleInputChange}/>
              </div>
              <div class="form-group">
                <label for="gujMiddleName">Guj Middle Name</label>
                <input type="text" id="gujMiddleName" name="g_m_name" value={formData.g_m_name}
                onChange={handleInputChange}/>
              </div>
              <div class="form-group">
                <label for="gujLastName">Guj Last Name</label>
                <input type="text" id="gujLastName" name="g_l_name" value={formData.g_l_name}
                onChange={handleInputChange}/>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="clanSelection">Clan Selection</label>
                <select id="clanSelection" name="clanid" value={formData.clanid} onChange={handleInputChange}>
                  {clanList.map((item) => {
                      return (
                        <>
                          <option value={item.id}>{item.clan_name}</option>
                        </>
                      )
                    })}
                  
                 
                </select>
              </div>
              <div class="form-group">
                <label for="openingAmt">Opening Amount</label>
                <input type="number" id="openingAmt" name="pre_entry" value={formData.pre_entry}
                onChange={handleInputChange}/>
              </div>
              <div class="btn-container">
                <button type="submit" >Update</button>
                <button type="button" class="cancel" onClick={closeDialog}>Close</button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}

export default EditMemberDialog;