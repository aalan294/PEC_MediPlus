const Hospital = require('../MODELS/hospitalSchema');
const bcrypt = require('bcrypt')

const hospitalRequest = async(req,res)=>{
    try {
        const {name,owner, email, phone, address, wallet, verification} = req.body;
        if(!name || !email || !phone || !address || !wallet || !owner || !verification){
            throw new Error("fields missing");
           
        }
        const existingHospital = await Hospital.findOne({email});
        if(existingHospital){
            throw new Error("Hospital already exists");
            
        }
        const hashedPassword = await bcrypt.hash(email, 10);
        const hospital = new Hospital({
            name,owner, email,password: hashedPassword, phone, address, wallet, verification
        })
        const response = await hospital.save();
        res.json({message: "Hospital registered successfully",id:response._id,status: true});
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"error accured in registering Hospital", status: false})
    }
}

const HospitalLogin = async(req,res) =>{
    try {
        const { email, password } = req.body;
        
        // Find the patient by email
        const hospital = await Hospital.findOne({ email });
        if (!hospital) {
            throw new Error("patient Details is not found in Database")
        }

       
        const isMatch = await bcrypt.compare(password, hospital.password);
        if (!isMatch) {
            throw new Error("Login failed")
        }

        return res.json({ message: "Login successful", user: hospital, status: true });
    } catch (error) {
        console.error('Error caught in patient login:', error);
        return res.json({ message: "Error caught in patient login", status: false });
    }
}


module.exports = {hospitalRequest,HospitalLogin}