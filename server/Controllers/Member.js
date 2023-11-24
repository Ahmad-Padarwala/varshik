const conn = require("../db/conn");
const ErrorHandler = require("../middlewares/ErrorHandler.js");
// const checkRollNo = async (rollno) => {

// }

const quickUpdateMember = async (req, res) => {
  const query =
    "update member set `f_name`=?, `m_name`=?, `l_name`=?, `g_f_name`= ?, `g_m_name`= ?, `g_l_name`= ?,  `pre_entry`=?, `clanid`=? where id=? ";
  const values = [
    req.body.f_name,
    req.body.m_name,
    req.body.l_name,
    req.body.g_f_name,
    req.body.g_m_name,
    req.body.g_l_name,
    req.body.pre_entry,
    req.body.clanid,
    req.body.id,
  ];

  console.log("reached to quick update");
  // console.log(values);
  conn.query(query, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};
const updateMember = async (req, res) => {
  const query =
    "UPDATE member set `roll_no`=?, `f_name`=?, `m_name`=?, `l_name`=?, `g_f_name`= ?, `g_m_name`= ?, `g_l_name`= ?,  `join_date`=?, `pre_entry`=?, `clanid`=?, `m_number`=?  WHERE id=?";

  const values = [
    req.body.rollno,
    req.body.fname,
    req.body.mname,
    req.body.lname,
    req.body.gfname,
    req.body.gmname,
    req.body.glname,
    req.body.jdate,
    req.body.preEntry,
    req.body.clanid,
    req.body.mobileNumber,
    req.body.id,
  ];

  conn.query(query, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

const getMemberListByFilter = async (req, res) => {
  const clanData = req.body;
  const clanId = clanData.selectedClanId;
  const isSubClan = clanData.isClanChecked;
  let q;
  if (isSubClan) {
    q =
      "SELECT m.id AS id, m.roll_no AS roll_no, m.f_name AS f_name, m.m_name AS m_name, m.l_name AS l_name, m.g_f_name AS g_f_name, m.g_m_name AS g_m_name, m.g_l_name AS g_l_name,  DATE_FORMAT(DATE(m.join_date), '%d-%m-%Y') AS join_date, m.pre_entry, m.clanid, c.parent_clan, COALESCE ( p.total_paid, 0) AS total_paid, COALESCE(y.varshik, 0) AS total_debit FROM member m LEFT JOIN (SELECT member_id, SUM(pay_amount) AS total_paid FROM payment GROUP BY member_id) p ON m.id = p.member_id LEFT JOIN (SELECT m.id, SUM(y.amount) AS varshik FROM member m LEFT JOIN yearly_income y ON m.join_date <= y.start_date GROUP BY m.id) y ON m.id = y.id  LEFT JOIN clan c ON m.clanid = c.id  WHERE m.clanid IN (?,(SELECT id FROM clan WHERE parent_clan =? ) )  ORDER BY m.clanid,m.roll_no ASC";
    conn.query(q, [clanId, clanId], (err, data) => {
      return res.json(data);
    });
  } else {
    q =
      "SELECT m.id AS id, m.roll_no AS roll_no, m.f_name AS f_name, m.m_name AS m_name, m.l_name AS l_name,m.g_f_name AS g_f_name, m.g_m_name AS g_m_name, m.g_l_name AS g_l_name, DATE_FORMAT(DATE(m.join_date), '%d-%m-%Y') AS join_date, m.pre_entry, m.clanid, COALESCE ( p.total_paid, 0) AS total_paid, COALESCE(y.varshik, 0) AS total_debit FROM member m LEFT JOIN (SELECT member_id, SUM(pay_amount) AS total_paid FROM payment GROUP BY member_id) p ON m.id = p.member_id LEFT JOIN ( SELECT m.id, SUM(y.amount) AS varshik FROM member m LEFT JOIN yearly_income y ON m.join_date <= y.start_date GROUP BY m.id) y ON m.id = y.id where m.clanid=? ORDER BY m.roll_no ASC";
    conn.query(q, clanId, (err, data) => {
      return res.json(data);
    });
  }
};

const addMember = async (req, res) => {
  // var rno = req.body.rollno;
  // const q = 'SELECT * FROM `member` WHERE roll_no = ?'
  // conn.query(q, [rno], (err, data) => {
  //     if (data.length === 0) {
  //         const insert_q = "insert into member (`roll_no`, `f_name`, `m_name`, `l_name`, `join_date`, `pre_entry`, `clanid`) values (?)";

  //         const values = [
  //             req.body.rollno,
  //             req.body.fname,
  //             req.body.mname,
  //             req.body.lname,
  //             req.body.jdate,
  //             req.body.preEntry,
  //             req.body.clanid,

  //         ]

  //         conn.query(insert_q, [values], (err, data) => {
  //             if (err) return res.json(err)
  //             return res.json(data)
  //         })
  //     } else {
  //         console.log("availabel");
  //         return res.status(401).json({ error: "Roll Number Already Assigned" });
  //     }
  // })

  console.log("********REached*************");
  const q =
    "insert into member (`roll_no`, `f_name`, `m_name`, `l_name`, `g_f_name`, `g_m_name`, `g_l_name`, `join_date`, `pre_entry`, `clanid`, `m_number`) values (?)";

  const values = [
    req.body.rollno,
    req.body.fname,
    req.body.mname,
    req.body.lname,
    req.body.gfname,
    req.body.gmname,
    req.body.glname,
    req.body.jdate,
    req.body.preEntry,
    req.body.clanid,
    req.body.mobileNumber,
  ];

  conn.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

const getMember = async (req, res) => {
  const q =
    "SELECT m.id AS id, m.roll_no AS roll_no, m.f_name AS f_name, m.m_name AS m_name, m.l_name AS l_name, m.g_f_name AS g_f_name, m.g_m_name AS g_m_name, m.g_l_name AS g_l_name, DATE_FORMAT(DATE(m.join_date), '%d-%m-%Y')  AS join_date, m.pre_entry, m.clanid, COALESCE ( p.total_paid, 0) AS total_paid, COALESCE(y.varshik, 0) AS total_debit FROM member m LEFT JOIN (SELECT member_id, SUM(pay_amount) AS total_paid FROM payment GROUP BY member_id) p ON m.id = p.member_id LEFT JOIN ( SELECT m.id, SUM(y.amount) AS varshik FROM member m LEFT JOIN yearly_income y ON m.join_date <= y.start_date GROUP BY m.id) y ON m.id = y.id ORDER BY m.id DESC;";

  conn.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    // console.log(data);
    return res.json(data);
  });
};

const getMemberBySelectedDate = async (req, res) => {
  console.log("object");
  const selectedDate = req.params.selectedDate;
  const q = `SELECT m.id AS id, m.roll_no AS roll_no, m.f_name AS f_name, m.m_name AS m_name, m.l_name AS l_name, m.g_f_name AS g_f_name, m.g_m_name AS g_m_name, m.g_l_name AS g_l_name, DATE_FORMAT(DATE(m.join_date), '%d-%m-%Y') AS join_date, m.pre_entry, m.clanid, COALESCE(SUM(CASE WHEN p.payment_date <= '${selectedDate}' THEN p.pay_amount ELSE 0 END), 0) AS total_paid, COALESCE(y.varshik, 0) AS total_debit FROM member m LEFT JOIN payment p ON m.id = p.member_id LEFT JOIN ( SELECT m.id, SUM( CASE WHEN y.start_date <= '${selectedDate}' THEN y.amount ELSE 0 END) AS varshik FROM member m LEFT JOIN yearly_income y ON m.join_date <= y.start_date GROUP BY m.id ) y ON m.id = y.id WHERE m.join_date <= '${selectedDate}' GROUP BY m.id, m.roll_no, m.f_name, m.m_name, m.l_name, m.g_f_name, m.g_m_name, m.g_l_name, join_date, m.pre_entry, m.clanid, y.varshik ORDER BY m.id DESC;`;
  conn.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
};

const getSingleMember = async (req, res) => {
  const q =
    "SELECT m.id AS id, m.roll_no AS roll_no, m.f_name AS f_name, m.m_name AS m_name, m.l_name AS l_name, DATE_FORMAT(DATE(m.join_date), '%d-%m-%Y')  AS join_date, m.pre_entry, m.clanid, COALESCE ( p.total_paid, 0) AS total_paid, COALESCE(y.varshik, 0) AS total_debit FROM member m LEFT JOIN (SELECT member_id, SUM(pay_amount) AS total_paid FROM payment GROUP BY member_id) p ON m.id = p.member_id LEFT JOIN ( SELECT m.id, SUM(y.amount) AS varshik FROM member m LEFT JOIN yearly_income y ON m.join_date <= y.start_date GROUP BY m.id) y ON m.id = y.id ORDER BY m.id DESC LIMIT 1";

  conn.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log(data);
    return res.json(data);
  });
};

// const getDebit = async (req, res) => {
//   const q = "SELECT f_name FROM member WHERE id > 3";

//   conn.query(q, (err, data) => {
//     if (err) {
//       console.log(err);
//       return res.json(err);
//     }
//     console.log(data);
//     return res.json(data);
//   });
// };

const getPerMember = async (req, res) => {
  console.log("parameter is  ");
  const grno = req.params.grno;
  const q =
    "SELECT *,DATE_FORMAT(DATE(join_date), '%Y-%m-%d')  AS join_date_format FROM member WHERE id = ?";
  conn.query(q, [grno], (err, data) => {
    if (err) return res.json(err);
    // console.log(data);
    return res.json(data);
  });
};

const getPerMemberByRollNo = async (req, res) => {
  console.log("parameter is  ");
  const id = req.params.id;
  const q =
    "SELECT *,DATE_FORMAT(DATE(join_date), '%Y-%m-%d')  AS join_date_format FROM member WHERE id = ?";
  conn.query(q, [id], (err, data) => {
    if (err) return res.json(err);
    // console.log(data);
    return res.json(data);
  });
};

const deleteMember = (req, res, next) => {
  console.log("Delete member");
  const id = req.params.id;
  console.log(id);
  const q = "DELETE FROM member WHERE id = ?";

  conn.query(q, [id], (err, data) => {
    if (err) {
      console.error("Error deleting member:", err);
      return next(err); // Pass the error to the error handling middleware
    }
    // If no error occurred, send a successful response
    res.json({
      success: true,
      message: "Member deleted successfully",
      affectedRows: data.affectedRows,
    });
  });
};

const addPayment = async (req, res) => {
  const memberid = req.params.memberid;
  const rollno = req.params.rollno;
  console.log(memberid);
  console.log(rollno);

  const q =
    "insert into payment (`member_id`, `roll_no`, `pay_amount`, `collected_by`, `book_no`, `voucher_no`, `payment_date`) values (?)";

  const values = [
    req.body.memberId,
    req.body.rollNo,
    req.body.paymentAmount,
    req.body.collectedBy,
    req.body.bookNo,
    req.body.voucherNo,
    req.body.paymentDate,
  ];

  conn.query(q, [values], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ error: "Incorrect Roll No" });
    }
    return res.json(data);
  });
};

module.exports = {
  getMember,
  getSingleMember,
  getMemberBySelectedDate,
  //   getDebit,
  updateMember,
  addMember,
  deleteMember,
  getPerMember,
  addPayment,
  getMemberListByFilter,
  getPerMemberByRollNo,
  quickUpdateMember,
};
