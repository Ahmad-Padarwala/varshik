const ErrorHandlerClan=(err,req,res,next)=>{
    console.log("Middleware Error Hadnling");
    console.log("Middleware ");
 console.log(err.message);
 console.log(err.code);
    const errCode = err.code || 500;
    const errMsg =  err.message || 'Something special went wrong';
    const errStatus= errCode === "ER_ROW_IS_REFERENCED_2" ? process.env.ERR_DELETE_FOREIGN_CODE : 500
    console.log(errStatus)
    res.status(422).json({error:err,code:errCode})
    // res.status(422).json({
    //     success: false,
        
    //     message: errMsg,
    //     code: errCode
    // })
}

module.exports = ErrorHandlerClan;