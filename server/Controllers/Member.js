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

  console.log("****subclan***")
  console.log(isSubClan)
  if (isSubClan) {
    console.log("****subclan***")
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
    return res.json(data);
  });
};



const getMemberBySelectedDateAndClan = async (req, res) => {
  const selectedDate = req.params.selectedDate;
  const clanid = req.params.clanid;
  let issub = req.params.subClan;
  console.log(issub);
  console.log(typeof (issub));
  let q;

  if (issub == "false") {
    q = `SELECT 
    m.id AS id, 
    m.roll_no AS roll_no, 
    m.f_name AS f_name, 
    m.m_name AS m_name, 
    m.l_name AS l_name, 
    m.g_f_name AS g_f_name, 
    m.g_m_name AS g_m_name, 
    m.g_l_name AS g_l_name, 
    DATE_FORMAT(DATE(m.join_date), '%d-%m-%Y') AS join_date, 
    m.pre_entry, 
    m.clanid, 
    COALESCE(SUM(CASE WHEN p.payment_date <= '${selectedDate}' THEN p.pay_amount ELSE 0 END), 0) AS total_paid, 
    COALESCE(y.varshik, 0) AS total_debit 
    FROM 
    member m 
    LEFT JOIN 
    payment p ON m.id = p.member_id 
    LEFT JOIN 
    ( 
        SELECT 
            m.id, 
            SUM( CASE WHEN y.start_date <= '${selectedDate}' THEN y.amount ELSE 0 END) AS varshik 
        FROM 
            member m 
        LEFT JOIN 
            yearly_income y ON m.join_date <= y.end_date 
        GROUP BY 
            m.id 
    ) y ON m.id = y.id 
    
    WHERE 
    m.join_date <= '${selectedDate}' 
    AND m.clanid = '${clanid}' 
    
    GROUP BY 
    m.id, 
    m.roll_no, 
    m.f_name, 
    m.m_name, 
    m.l_name, 
    m.g_f_name, 
    m.g_m_name, 
    m.g_l_name, 
    join_date, 
    m.pre_entry, 
    m.clanid, 
    y.varshik  
    ORDER BY 
    y.id DESC;
    `;

  }
  else {
    q = `SELECT 
    m.id AS id, 
    m.roll_no AS roll_no, 
    m.f_name AS f_name, 
    m.m_name AS m_name, 
    m.l_name AS l_name, 
    m.g_f_name AS g_f_name, 
    m.g_m_name AS g_m_name, 
    m.g_l_name AS g_l_name, 
    DATE_FORMAT(DATE(m.join_date), '%d-%m-%Y') AS join_date, 
    m.pre_entry, 
    m.clanid, 
    COALESCE(SUM(CASE WHEN p.payment_date <= '${selectedDate}' THEN p.pay_amount ELSE 0 END), 0) AS total_paid, 
    COALESCE(y.varshik, 0) AS total_debit 
  FROM 
    member m 
  LEFT JOIN 
    payment p ON m.id = p.member_id 
  LEFT JOIN 
    ( 
        SELECT 
            m.id, 
            SUM( CASE WHEN y.start_date <= '${selectedDate}' THEN y.amount ELSE 0 END) AS varshik 
        FROM 
            member m 
        LEFT JOIN 
            yearly_income y ON m.join_date <= y.end_date 
        GROUP BY 
            m.id 
    ) y ON m.id = y.id 
    
  WHERE 
    m.join_date <= '${selectedDate}' 
    AND m.clanid IN (SELECT id FROM clan WHERE parent_clan ='${clanid}') 
    
  GROUP BY 
    m.id, 
    m.roll_no, 
    m.f_name, 
    m.m_name, 
    m.l_name, 
    m.g_f_name, 
    m.g_m_name, 
    m.g_l_name, 
    join_date, 
    m.pre_entry, 
    m.clanid, 
    y.varshik  
  ORDER BY 
    y.id DESC;
  `;
  }


  conn.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
};



const getMemberBySelectedDate = async (req, res) => {
  const selectedDate = req.params.selectedDate;
  const q = `SELECT m.id AS id, m.roll_no AS roll_no, m.f_name AS f_name, m.m_name AS m_name, m.l_name AS l_name, m.g_f_name AS g_f_name, m.g_m_name AS g_m_name, m.g_l_name AS g_l_name, DATE_FORMAT(DATE(m.join_date), '%d-%m-%Y') AS join_date, m.pre_entry, m.clanid, COALESCE(SUM(CASE WHEN p.payment_date <= '${selectedDate}' THEN p.pay_amount ELSE 0 END), 0) AS total_paid, COALESCE(y.varshik, 0) AS total_debit FROM member m LEFT JOIN payment p ON m.id = p.member_id LEFT JOIN ( SELECT m.id, SUM( CASE WHEN y.start_date <= '${selectedDate}' THEN y.amount ELSE 0 END) AS varshik FROM member m LEFT JOIN yearly_income y ON m.join_date <= y.end_date GROUP BY m.id ) y ON m.id = y.id WHERE m.join_date <= '${selectedDate}' GROUP BY m.id, m.roll_no, m.f_name, m.m_name, m.l_name, m.g_f_name, m.g_m_name, m.g_l_name, join_date, m.pre_entry, m.clanid, y.varshik  ORDER BY y.id DESC`;
  conn.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
};




const getmemberPerYearAgo = async (req, res) => {
  const selectedAgoDate = req.params.selectedAgoDate;
  // Parse the selectedAgoDate string into a Date object
  const originalDate = new Date(selectedAgoDate);

  // Add one year to the date
  const oneYearLater = new Date(originalDate);
  oneYearLater.setFullYear(originalDate.getFullYear() + 1);
  const selectedNewDate = oneYearLater.toISOString().split("T")[0];


  const q = `SELECT
  m.id AS id,
  m.roll_no AS roll_no,
  m.f_name AS f_name,
  m.m_name AS m_name,
  m.l_name AS l_name,
  m.g_f_name AS g_f_name,
  m.g_m_name AS g_m_name,
  m.g_l_name AS g_l_name,
  m.clanid,
  DATE_FORMAT(DATE(m.join_date), '%d-%m-%Y') AS join_date,
  m.pre_entry AS old_pre_entry,
  COALESCE(SUM(p.old_total_paid), 0) AS old_total_paid,
  COALESCE(y.varshik, 0) AS old_total_debit,
  m2.pre_entry AS new_pre_entry,
  COALESCE(SUM(p2.new_total_paid), 0) AS new_total_paid,
  COALESCE(y2.varshik, 0) AS new_total_debit
FROM
  member m
LEFT JOIN
  (
    SELECT
      member_id,
      SUM(CASE WHEN payment_date <= '${selectedAgoDate}' THEN pay_amount ELSE 0 END) AS old_total_paid
    FROM
      payment
    GROUP BY
      member_id
  ) p ON m.id = p.member_id
LEFT JOIN
  (
    SELECT
      m.id,
      SUM(CASE WHEN y.start_date <= '${selectedAgoDate}' THEN y.amount ELSE 0 END) AS varshik
    FROM
      member m
    LEFT JOIN
      yearly_income y ON m.join_date <= y.end_date
    GROUP BY
      m.id
  ) y ON m.id = y.id
LEFT JOIN
  member m2 ON m.id = m2.id
LEFT JOIN
  (
    SELECT
      member_id,
      SUM(CASE WHEN payment_date <= '${selectedNewDate}' THEN pay_amount ELSE 0 END) AS new_total_paid
    FROM
      payment
    GROUP BY
      member_id
  ) p2 ON m2.id = p2.member_id
LEFT JOIN
  (
    SELECT
      m.id,
      SUM(CASE WHEN y.start_date <= '${selectedNewDate}' THEN y.amount ELSE 0 END) AS varshik
    FROM
      member m
    LEFT JOIN
      yearly_income y ON m.join_date <= y.end_date
    GROUP BY
      m.id
  ) y2 ON m2.id = y2.id
WHERE
  (m.join_date <= '${selectedAgoDate}' OR m2.join_date <= '${selectedNewDate}')
GROUP BY
  m.id, m.roll_no, m.f_name, m.m_name, m.l_name, m.g_f_name, m.g_m_name, m.g_l_name, join_date, m.pre_entry, COALESCE(y.varshik, 0), m2.pre_entry, COALESCE(y2.varshik, 0)
ORDER BY
  m.id DESC;

`;

  conn.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
};
//vbkbkjbvkvbkcb
// const getmemberPerYearAgo = async (req, res) => {
//   const selectedAgoDate = req.params.selectedAgoDate;
// // Parse the selectedAgoDate string into a Date object
// const originalDate = new Date(selectedAgoDate);

// // Add one year to the date
// const oneYearLater = new Date(originalDate);
// oneYearLater.setFullYear(originalDate.getFullYear() + 1);
// const selectedNewDate =

// console.log("one year later", );

//   const q = `
//     SELECT
//       m.id AS id,
//       m.roll_no AS roll_no,
//       m.f_name AS f_name,
//       m.m_name AS m_name,
//       m.l_name AS l_name,
//       m.g_f_name AS g_f_name,
//       m.g_m_name AS g_m_name,
//       m.g_l_name AS g_l_name,
//       DATE_FORMAT(DATE(m.join_date), '%d-%m-%Y') AS join_date,
//       m.pre_entry,
//       m.clanid,
//       COALESCE(SUM(CASE WHEN p.payment_date <= '${selectedAgoDate}' THEN p.pay_amount ELSE 0 END), 0) AS total_paid,
//       COALESCE(y.varshik, 0) AS total_debit
//     FROM
//       member m
//     LEFT JOIN
//       payment p ON m.id = p.member_id
//     LEFT JOIN
//       (
//         SELECT
//           m.id,
//           SUM(CASE WHEN y.start_date <= '${selectedAgoDate}' THEN y.amount ELSE 0 END) AS varshik
//         FROM
//           member m
//         LEFT JOIN
//           yearly_income y ON m.join_date <= y.end_date
//         GROUP BY
//           m.id
//       ) y ON m.id = y.id
//     WHERE
//       m.join_date <= '${selectedAgoDate}'
//     GROUP BY
//       m.id, m.roll_no, m.f_name, m.m_name, m.l_name, m.g_f_name, m.g_m_name, m.g_l_name, join_date, m.pre_entry, m.clanid, y.varshik
//     ORDER BY
//       y.id DESC`;

//   conn.query(q, (err, data) => {
//     if (err) {
//       console.log(err);
//       return res.json(err);
//     }
//     return res.json(data);
//   });
// };



//vcnkvkcnvknvk

const getSingleMember = async (req, res) => {
  const q =
    "SELECT m.id AS id, m.roll_no AS roll_no, m.f_name AS f_name, m.m_name AS m_name, m.l_name AS l_name, DATE_FORMAT(DATE(m.join_date), '%d-%m-%Y')  AS join_date, m.pre_entry, m.clanid, COALESCE ( p.total_paid, 0) AS total_paid, COALESCE(y.varshik, 0) AS total_debit FROM member m LEFT JOIN (SELECT member_id, SUM(pay_amount) AS total_paid FROM payment GROUP BY member_id) p ON m.id = p.member_id LEFT JOIN ( SELECT m.id, SUM(y.amount) AS varshik FROM member m LEFT JOIN yearly_income y ON m.join_date <= y.start_date GROUP BY m.id) y ON m.id = y.id ORDER BY m.id DESC LIMIT 1";

  conn.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
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
  const grno = req.params.grno;
  const q =
    "SELECT *,DATE_FORMAT(DATE(join_date), '%Y-%m-%d')  AS join_date_format FROM member WHERE id = ?";
  conn.query(q, [grno], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

const getPerMemberByRollNo = async (req, res) => {
  const id = req.params.id;
  const q =
    "SELECT *,DATE_FORMAT(DATE(join_date), '%Y-%m-%d')  AS join_date_format FROM member WHERE id = ?";
  conn.query(q, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

const deleteMember = (req, res, next) => {
  const id = req.params.id;
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
  getmemberPerYearAgo,
  getMemberBySelectedDateAndClan
};
