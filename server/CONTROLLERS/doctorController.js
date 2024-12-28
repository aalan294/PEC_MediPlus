const Doctor = require('../MODELS/doctorSchema');
const bcrypt = require('bcrypt')

const loginDoctor = async(req,res)=>{
    try {
        const {email, password} = req.body;
        const doctor = await Doctor.findOne({email});
        if(!doctor){
            throw new Error("Doctor already exists")
        }
        const isMatch = await bcrypt.compare(password, doctor.password);
        if(!isMatch){
            throw new Error("Login Failed")
        }
        res.json({message:"login successful",user:doctor,status:true})
    } catch (error) {
        res.json({message:"error caught in loginDoctor",status: false})
    }
}

module.exports = { loginDoctor}