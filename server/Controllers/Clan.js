const conn = require("../db/conn");
const ErrorHandler = require("../middlewares/ErrorHandlerClan");
const addClan = async (req, res) => {
  const q = "insert into clan (`clan_name`, `parent_clan`) values (?)";
  const values = [req.body.clanName, req.body.parentClan];
  conn.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
};

const getClan = async (req, res) => {
  const q = "select * from clan";
  conn.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
};

const getPerClan = async (req, res) => {
  const q = "select * from clan where id = ?";
  conn.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
};

const deleteClan = async (req, res) => {
  const id = req.params.id;
  const q = "delete from clan where id = ?";
  const deletePayment =
    "DELETE FROM payment WHERE member_id IN (SELECT id FROM member WHERE clanid = ?)";
  const deleteMember = "DELETE FROM member WHERE clanid = ?";

  try {
    await conn.query("BEGIN"); // Start a transaction

    // Delete associated payment records
    await conn.query(deletePayment, [id]);

    // Delete associated member records
    await conn.query(deleteMember, [id]);

    // Finally, delete the clan
    await conn.query(q, [id]);

    await conn.query("COMMIT"); // Commit the transaction

    res.json({ message: "Clan and associated records deleted successfully." });
  } catch (err) {
    await conn.query("ROLLBACK"); // Roll back the transaction on error
    res.status(422).json({ error: err });
  }
};

const EditClan = async (req, res) => {
  const q = "UPDATE `clan` SET `clan_name`=?, `parent_clan`=? where id = ?";

  const values = [req.body.clanName, req.body.parentClan, req.params.id];

  conn.query(q, values, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.json(data);
  });
};

module.exports = { addClan, getClan, deleteClan, getPerClan, EditClan };
