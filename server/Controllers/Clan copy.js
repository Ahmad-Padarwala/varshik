const conn = require("../db/conn")
const ErrorHandler = require("../middlewares/ErrorHandlerClan");
const addClan = async (req, res) => {
    const q = "insert into clan (`clan_name`, `parent_clan`) values (?)";

    const values = [
        req.body.clanName,
        req.body.parentClan,
    ]

    conn.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err)
        return res.json(data)
    })
}



const getClan = async (req, res) => {
    const q = 'select * from clan';
    conn.query(q, (err, data) => {
        if (err) return res.status(500).json(err)
        return res.json(data);
    })
}

const getPerClan = async (req, res) => {
    const q = 'select * from clan where id = ?';
    conn.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err)
        return res.json(data);
    })
}


const deleteClan = async (req, res) => {
    const id = req.params.id
    const q = "delete from clan where id = ?"
    const deletePayment= "DELETE FROM payment WHERE member_id IN (SELECT id FROM member WHERE clanid = ?)"
    const deleteMember="DELETE FROM member WHERE clanid = ?"
    
    conn.query(q, [id],async (err, data) => {
       
        if (err) {            
            // return res.status(422).json({error:err})
            // Delete associated payment records
            await conn.query(deletePayment, [id],async(err,data)=>{
                    if(err) return res.status(422).json({error:err})

                    //Delete Associalted Member Records
                    await conn.query(deleteMember, [id],async(err,data)=>{
                        if(err) return res.status(422).json({error:err})
                        
                        
                    //Delete Clan
                    await conn.query(q, [id],(err,data)=>{
                        if(err) return res.status(422).json({error:err})
                        return res.json(data)
                    })
                    })
            })
           
        }
        return res.json(data)
    })
            
}


  


const EditClan = async (req, res) => {

    const q = "UPDATE `clan` SET `clan_name`=?, `parent_clan`=? where id = ?";

    const values = [
        req.body.clanName,
        req.body.parentClan,
        req.params.id
    ]

    conn.query(q, values, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err)
        }
        return res.json(data)
    })
}


module.exports = { addClan, getClan, deleteClan, getPerClan, EditClan }