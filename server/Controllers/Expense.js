const conn = require("../db/conn");

const addExpCategory = async (req, res) => {

    const { expCategory, expSubCategory } = req.body;

    const q =
        "insert into expense_category (e_category, e_subcategory) values (?, ?)";

    conn.query(q, [expCategory, expSubCategory], (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        }
    });
};

const getExpCategory = async (req, res) => {
    const q = "select * from expense_category";
    conn.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

const deleteExpCategory = async (req, res) => {
    const id = req.params.id;
    const q = "delete from expense_category where id = ?";

    conn.query(q, [id], (err, data) => {
        if (err) return res.json({ error: 1 });
        return res.json(data)
    });
};

const addExpenses = async (req, res) => {
    const q =
        "insert into expense_master (`e_title`, `e_disc`, `e_date`, `e_expense_by`, `e_check_cash`, `e_received`, `category_id`) values (?) ";
    const values = [
        req.body.etitle,
        req.body.edisc,
        req.body.edate,
        req.body.eexpenseby,
        req.body.echeckcash,
        req.body.ereceived,
        req.body.categoryid,
    ];

    conn.query(q, [values], (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        }
    });
};

const getExpenses = async (req, res) => {
    const q =
        "select *, DATE_FORMAT(DATE(e_date), '%Y-%m-%d')  AS e_date from expense_master";

    conn.query(q, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        }
    });
};




const getGenerateExpenses = async (req, res) => {
    const q =
        "select  `e_title`, `e_disc`, `e_expense_by`, `e_check_cash`, sum(e_received) as e_received, `category_id`, DATE_FORMAT(DATE(e_date), '%Y-%m-%d')  AS e_date from expense_master group by category_id";

    conn.query(q, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(data);

        }
    });
};

const deleteExpenses = async (req, res) => {
    const id = req.params.id;
    const q = "delete from expense_master where id = ? ";

    conn.query(q, [id], (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        }
    });
};

const getPerExpenses = async (req, res) => {
    const id = req.params.id;

    const q =
        "select *, DATE_FORMAT(DATE(e_date), '%Y-%m-%d') AS e_date from expense_master where id = ?";

    conn.query(q, [id], (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        }
    });
};

const editExpenses = async (req, res) => {

    const { id, etitle, edisc, edate, eexpenseby, echeckcash, ereceived, categoryid } = req.body;

    const q =
        "UPDATE expense_master SET e_title = ?, e_disc = ?, e_date = ?, e_expense_by = ?, e_check_cash = ?, e_received = ?, category_id = ? WHERE id = ? ";

    conn.query(
        q,
        [etitle, edisc, edate, eexpenseby, echeckcash, ereceived, categoryid, id],
        (err, result) => {
            if (err) {
                console.log(err);
            }
            res.send(result);
        }
    );

};

module.exports = {
    addExpCategory,
    getExpCategory,
    deleteExpCategory,
    addExpenses,
    getExpenses,
    deleteExpenses,
    getPerExpenses,
    editExpenses,
    getGenerateExpenses
};
