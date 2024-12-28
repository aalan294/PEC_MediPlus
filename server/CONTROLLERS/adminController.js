const Doctor = require('../MODELS/doctorSchema');
const Pharmacy = require('../MODELS/pharmacySchema');
const Reception = require('../MODELS/receptionSchema');
const Hospital = require('../MODELS/hospitalSchema')
const bcrypt = require('bcrypt')

const registerDoctor = async (req, res) => {
    try {
        const { name, email, phone, address, wallet, hospital, verification, dept } = req.body;

        // Check for missing fields
        if (!name || !email || !phone || !address || !wallet || !hospital || !verification || !dept) {
            return res.json({ message: "fields missing", status: false });
        }

        // Check if the doctor already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            throw new Error("Doctor already exists")
        }

        // Hash the password and create a new doctor
        const hashedPassword = await bcrypt.hash(email, 10);
        const doctor = new Doctor({
            name, email, password: hashedPassword, phone, address, wallet, hospital, verification, dept
        });

        // Save the doctor to the database
        const response = await doctor.save();
        return res.json({ message: "Doctor registered successfully", id: response._id, status: true });

    } catch (error) {
        console.log(error.message);
        return res.json({ message: "error occurred in registering Doctor", status: false });
    }
};


const registerReception = async(req,res)=>{
    try {
        const {name, email, phone, wallet, hospital, verification} = req.body;
        if(!name || !email || !phone || !wallet || !hospital || !verification){
            res.json({message: "fields missing",status: false});
        }
        const existingReception = await Reception.findOne({email});
        if(existingReception){
            throw new Error("reception already exists")
        }
        const hashedPassword = await bcrypt.hash(email, 10);
        const reception = new Reception({
            name, email, password: hashedPassword, phone, wallet, hospital, verification
        })
        const response = await reception.save();
        res.json({message: "Receptionist registered successfully",id:response._id,status: true});
    } catch (error) {
        console.log(error.message)
        res.json({message:"error accured in registering Doctor", status: false})
    }
}

const registerPharmacy = async(req,res)=>{
    try {
        const {name,owner, email, phone, address, wallet, verification} = req.body;
        if(!name || !email || !phone || !address || !wallet || !owner || !verification){
            throw new Error("Fields Missing")
        }
        const existingPharmacy = await Pharmacy.findOne({email});
        if(existingPharmacy){
            throw new Error("Pharmacy already exists")
        }
        const hashedPassword = await bcrypt.hash(email, 10);
        const pharmacy = new Pharmacy({
            name,owner, email,password: hashedPassword, phone, address, wallet, verification
        })
        const response = await pharmacy.save();
        res.json({message: "pharmacy registered successfully",id:response._id,status: true});
    } catch (error) {
        res.json({message:"error accured in registering pharmacy", status: false})
    }
}

const getPharamacies = async(req,res)=>{
    try {
        const pharamacies = await Pharmacy.find({isVerified:true});
        res.json({message:"data fetched Successfully",pharmacies:pharamacies,status:true})
    } catch (error) {
        res.json({message:"error accured in getPharmacy",status: false})
    }

}

const getHospital = async(req,res)=>{
    try {
        const doctors = await Hospital.find({isVerified:true});
        res.json({message:"data fetched Successfully",hospitals:doctors,status:true})
    } catch (error) {
        res.json({message:"error accured in getDoctors",status: false})
    }

}
const getReceptions = async(req,res)=>{
    try {
        const reception = await Reception.find();
        res.json({message:"data fetched Successfully",receptions:reception,status:true})
    } catch (error) {
        res.json({message:"error accured in getReceptions",status: false})
    }

}

const getDoctors = async(req,res)=>{
    try {
        const reception = await Doctor.find();
        res.json({message:"data fetched Successfully",doctors:reception,status:true})
    } catch (error) {
        res.json({message:"error accured in getReceptions",status: false})
    }

}


const verifyHospital = async(req,res) =>{
    try {
        const {id} = req.params;

        const hospital = await Hospital.findByIdAndUpdate(id,{isVerified:true});

        res.json({message:"Hospital Verified Succesfully!..",status:true})
    } catch (error) {
        res.json({message:"Error caught on Verify Hospital",status:false});
    }
}

const verifypharm = async(req,res) =>{
    try {
        const {id} = req.params;

        const phamarcy = await Pharmacy.findByIdAndUpdate(id,{isVerified:true});

        res.json({message:"phamarcy Verified Succesfully!..",status:true})
    } catch (error) {
        res.json({message:"Error caught on Verify phamarcy",status:false});
    }
}

const getPharamaciesReq = async(req,res)=>{
    try {
        const pharamacies = await Pharmacy.find({isVerified:false});
        res.json({message:"data fetched Successfully",pharmacies:pharamacies,status:true})
    } catch (error) {
        res.json({message:"error accured in getPharmacy",status: false})
    }

}

const getHospitalReq = async(req,res)=>{
    try {
        const doctors = await Hospital.find({isVerified:false});
        res.json({message:"data fetched Successfully",hospitals:doctors,status:true})
    } catch (error) {
        res.json({message:"error accured in getDoctors",status: false})
    }

}






module.exports = {getDoctors,getHospital,getPharamaciesReq,getHospitalReq,getPharamacies,getReceptions,registerDoctor,registerPharmacy,registerReception,verifyHospital,verifypharm}

