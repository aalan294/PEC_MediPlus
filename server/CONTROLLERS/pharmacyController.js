const Pharmacy = require('../MODELS/pharmacySchema');
const bcrypt = require('bcrypt')


const pharmLogin = async(req,res)=>{
    try {
        const {email, password} = req.body;
        const pharmacy = await Pharmacy.findOne({email});
        if(!pharmacy){
            throw new Error("Pharamcy is not in database")
        }
        const isMatch = await bcrypt.compare(password, pharmacy.password);
        if(!isMatch){
            throw new Error("Login failed")
        }
        res.json({message:"login successful",user:pharmacy,status:true})
    } catch (error) {
        res.json({message:"error caught in loginPharmacy",status: false})
    }
}

module.exports = {pharmLogin}
