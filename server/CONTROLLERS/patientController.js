const Patient = require('../MODELS/patientSchema');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
require('dotenv').config();

const registerPatient = async (req, res) => {
    try {
        const { name, age, gender, contactNumber, address, email, blood, emergency, DOB} = req.body;
        
        if (!name || !age || !gender || !contactNumber || !address || !email || !blood || !emergency || !DOB) {
            return res.json({ message: "Fields missing", status: false });
        }

        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            throw new Error("Patient already Regsiter")
        }

        const hashedPassword = await bcrypt.hash(contactNumber, 10);

        const patient = new Patient({
            name,
            age,
            gender,
            contactNumber,
            address,
            email,
            blood,
            emergency,
            DOB,
            password: hashedPassword,
            history: []  
        });

        await patient.save();
        res.json({ message: "Patient registered successfully", status: true });

    } catch (error) {
        res.json({ message: "Error occurred in registering patient", status: false });
    }
};

const patientLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find the patient by email
        const patient = await Patient.findOne({ email });
        if (!patient) {
            throw new Error("patient Details is not found in Database")
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            throw new Error("Login failed")
        }

        // If login is successful
        return res.json({ message: "Login successful", user: patient, status: true });
    } catch (error) {
        console.error('Error caught in patient login:', error);
        return res.json({ message: "Error caught in patient login", status: false });
    }
};

const getPatient = async(req,res)=>{
    try {
        const {id} = req.params;
        const patient = await Patient.findById(id);
        res.json({message:"patient details fetched successfully",patient: patient,status:true});
    } catch (error) {
        res.json({message:"error caught in getAllPatients",status: false})
    }
}


const getAllPatients = async(req,res)=>{
    try {
        const patients = await Patient.find();
        res.json({message:"patient details fetched successfully",patients: patients,status:true});
    } catch (error) {
        res.json({message:"error caught in getAllPatients",status: false})
    }
}
// Function to send an email with the QR code attached and embedded using CID
const sendEmailWithQR = async (email, qrCodeDataUrl, prescriptionId) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dharaneedharanchinnusamy@gmail.com',
                pass: "vmtxahsdzeenscxp",
            },
        });

        // Extract the base64 data from the data URL
        const base64Data = qrCodeDataUrl.split(';base64,').pop();

        // Prepare the mail options
        const mailOptions = {
            from: "dharaneedharanchinnusamy@gmail.com",
            to: email,
            subject: `Prescription ID: ${prescriptionId}`,
            html: `
                <p>Here is your QR code for prescription ID: ${prescriptionId}</p>
                <br>
                <img src="cid:qrcode" alt="QR Code" />
            `,
            attachments: [
                {
                    filename: 'qrcode.png', // Name of the attachment
                    content: base64Data, // Base64 content
                    encoding: 'base64', // Indicate the content is base64 encoded
                    cid: 'qrcode' // Same as the 'cid' in the image src above
                }
            ]
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully with QR code attached');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};



const generateQRCode = async (url) => {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(url);
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('QR code generation failed');
    }
};

const addHistoryToPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { prescriptionId, date, doctor,dept } = req.body;

        if (!prescriptionId || !date || !doctor || !dept) {
            return res.json({ message: "Fields missing", status: false });
        }

        const patient = await Patient.findById(id);
        if (!patient) {
            return res.json({ message: "Patient not found", status: false });
        }

        const newHistory = {
            prescriptionId,
            date,
            doctor,
            dept
        };

        patient.history.push(newHistory);
        await patient.save();

        // Generate the URL for the prescription
        const prescribUrl = `http://localhost:3000/pharm/scanner/${prescriptionId}`;

        // Generate the QR code
        const qrCodeDataUrl = await generateQRCode(prescribUrl);

        // Send the email with the QR code
        await sendEmailWithQR(patient.email, qrCodeDataUrl, prescriptionId);

        res.json({ message: "History added and QR code sent via email successfully", status: true, patient });

    } catch (error) {
        console.error('Error occurred:', error);
        res.json({ message: "Error occurred while adding history", status: false });
    }
};

module.exports = { registerPatient, getAllPatients, addHistoryToPatient, patientLogin ,getPatient};
