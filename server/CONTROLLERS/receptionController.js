const Reception = require('../MODELS/receptionSchema');
const bcrypt = require('bcrypt')

const receptionLogin = async(req,res)=>{
    try {
        const {email, password} = req.body;
        const reception = await Reception.findOne({email});
        if(!reception){
            throw new Error("Reception is not found in database")
        }
        const isMatch = await bcrypt.compare(password, reception.password);
        if(!isMatch){
            throw new Error("Login Failed")
        }
        res.json({message:"login successful",user:reception,status:true})
    } catch (error) {
        res.json({message:"error caught in loginReception",status: false})
    }
}

module.exports = {receptionLogin}