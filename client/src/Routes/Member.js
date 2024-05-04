import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AddMember from '../Pages/Member/AddMember'
import AllMember from '../Pages/Member/AllMember'
import MemberDetail from '../Pages/Member/MemberDetail'
import EditMember from '../Pages/Member/EditMember'
import MemberListPerYear from '../Pages/Reports/MemberListPerYear'
const Member = () => {
    return (
        <>
            <Routes>
                <Route path='/allmember' element={<AllMember />} />
            </Routes>
            <Routes>
                <Route path='/editMember' element={<EditMember />} />
            </Routes>

            <Routes>
                <Route path='/MemberDetail' element={<MemberDetail />} />
            </Routes>
            <Routes>
                <Route path='/addmember' element={<AddMember />} />
            </Routes>
            <Routes>
                <Route path='/memberListPerYear' element={<MemberListPerYear />} />
            </Routes>
        </>
    )
}

export default Member