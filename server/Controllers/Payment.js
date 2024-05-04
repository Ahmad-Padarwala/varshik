const conn = require("../db/conn");

const getPaymentHistory = async (req, res) => {
  const query =
    "SELECT p.* , DATE_FORMAT(DATE(payment_date), '%Y-%m-%d') AS payment_date, m.f_name,m.m_name,m.l_name FROM `payment` as p JOIN member as m on p.member_id=m.id ORDER BY p.id desc";
  conn.query(query, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
};

const getPaymentInfo = async (req, res) => {
  const query =
    "select p.*, DATE_FORMAT(DATE(p.payment_date), '%Y-%m-%d')  as payment_date_format, m.f_name,m.m_name,m.l_name from payment as p JOIN member as m on p.member_id=m.id where p.id=?  ";
  conn.query(query, [req.params.id], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
};

const updatePayment = async (req, res) => {
  const values = [
    req.body.paymentAmount,
    req.body.collectedBy,
    req.body.bookNo,
    req.body.voucherNo,
    req.body.paymentDate,
    req.params.id,
  ];


  const query =
    "UPDATE `payment` SET `pay_amount`=?,`collected_by`=?,`book_no`=?,`voucher_no`=?,`payment_date`=? WHERE id=?";
  conn.query(query, values, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    return res.json(data);
  });
};

const deletePaymentByMember = (req, res) => {
  const query = "DELETE from payment where member_id=?";
  conn.query(query, [req.params.id], (err, data) => {
    if (err) return res.json(err);

    return res.json({ success: true, data: data });
  });
};
const deletePayment = (req, res) => {
  const query = "DELETE from payment WHERE id=?";
  conn.query(query, [req.params.id], (err, data) => {
    if (err) {
      return res.json({ success: false, err: err });
    }

    return res.json({ success: true, data: data });
  });
};

const getSingalPaymentData = (req, res) => {
  const query =
    "SELECT c.clan_name, CONCAT(m.f_name, ' ', m.m_name, ' ', m.l_name) AS member_name, p.member_id, p.pay_amount FROM payment p JOIN member m ON p.member_id = m.id JOIN clan c ON m.clanid = c.id limit 1";

  conn.query(query, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
};

module.exports = {
  getPaymentHistory,
  getPaymentInfo,
  updatePayment,
  deletePaymentByMember,
  deletePayment,
  getSingalPaymentData,
};
