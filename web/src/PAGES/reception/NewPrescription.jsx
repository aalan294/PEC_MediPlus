import React, { useState } from 'react';
import styled from 'styled-components';
import { pinata } from '../../config'; // Import your IPFS configuration
import api from '../../API/api'; // Import your API instance
import Web3 from 'web3';
import { abi } from '../../abi';
import { useNavigate, useParams } from 'react-router-dom';
import { contractAddress } from '../../contractAddress';

// Initialize Web3
const web3 = new Web3(window.ethereum); // Assumes you are using MetaMask
const prescriptionContract = new web3.eth.Contract(abi, contractAddress);

// Enum Mapping (Assuming these are your enum values in the smart contract)
const DEPARTMENTS = {
  CARDIOLOGY: 0,
  DERMATOLOGY: 1,
  NEUROLOGY: 2,
  // Add other departments as needed
};

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
`;

const FormWrapper = styled.form`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h2`
  color: #007bff;
  text-align: center;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 16px;
  color: #333;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 16px;
  color: #333;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: green;
  text-align: center;
`;

const NewPrescription = () => {
  const { id } = useParams(); // Get the user MongoDB ID from the params
  const [prescriptionData, setPrescriptionData] = useState({
    description: '',
    dept: '',
    medicines: '',
    allergies: '',
  });
  const [document, setDocument] = useState(null); // Separate state for document
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionData({ ...prescriptionData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Access the first selected file
    if (file) {
      setDocument(file);
      setError(''); // Clear error if file is selected
    } else {
      setDocument(null); // Reset if no valid file is selected
      setError('No file selected.'); // Set an error if needed
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    // Check if the document is selected before proceeding
    if (!document) {
      setError('Please upload a valid document.');
      return;
    }
  
    try {
      const response = await pinata.upload.file(document);
      const documentCID = response.cid; // Get the document CID from IPFS
  
      // Step 2: Call the smart contract function
      const prescriptionIdBigInt = await createPrescriptionOnBlockchain(
        id, // User MongoDB ID
        prescriptionData.description,
        0, // This should be an enum value
        prescriptionData.medicines.split(','),
        [documentCID], // Document CID from IPFS
        prescriptionData.allergies.split(',')
      );
      
      // Convert BigInt to Number
      const prescriptionId = Number(prescriptionIdBigInt);
      console.log(prescriptionId);
  
      // Step 3: Update MongoDB with prescription ID
      const prescriptionDataMongo = {
        prescriptionId,
        date: new Date().toISOString(),
        doctor: 'Your Doctor Name', // Update this as necessary
        dept: prescriptionData.dept,
      };
  
      const mongoResponse = await api.patch(`reception/old-case/${id}`, prescriptionDataMongo);
  
      if (mongoResponse.data.status) {
        setSuccess('Prescription created successfully!');
        navigate('/reception/dashboard')

      } else {
        setError(mongoResponse.data.message);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setError('An error occurred while creating the prescription.');
    }
  };
  

  const createPrescriptionOnBlockchain = async (userId, description, dept, medicines, documents, allergies) => {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const accounts = await web3.eth.getAccounts();
      const userAccount = accounts[0]; // Get the user's account

      // Call the smart contract function
      const result = await prescriptionContract.methods.createPrescription(
        userId,
        description,
        dept, // Enum value for department
        "sample",
        medicines,
        documents,
        allergies
      ).send({ from: userAccount });
      console.log(result)
      // Assuming you want to return the prescription ID from the transaction
      return result.events.PrescriptionCreated.returnValues.prescriptionId; // Adjust as per your event
    } catch (error) {
      console.error('Error creating prescription on blockchain:', error);
      throw new Error('Blockchain transaction failed');
    }
  };

  return (
    <FormContainer>
      <FormWrapper onSubmit={handleSubmit}>
        <Title>Create New Prescription</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <InputGroup>
          <Label>Description</Label>
          <Input
            type="text"
            name="description"
            value={prescriptionData.description}
            onChange={handleInputChange}
            placeholder="Enter prescription description"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Department</Label>
          <Select
            name="dept"
            value={prescriptionData.dept}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select department</option>
            {Object.entries(DEPARTMENTS).map(([key, value]) => (
              <option key={value} value={value}>{key}</option>
            ))}
          </Select>
        </InputGroup>

        <InputGroup>
          <Label>Medicines (comma-separated)</Label>
          <Input
            type="text"
            name="medicines"
            value={prescriptionData.medicines}
            onChange={handleInputChange}
            placeholder="Enter medicines"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Allergies (comma-separated)</Label>
          <Input
            type="text"
            name="allergies"
            value={prescriptionData.allergies}
            onChange={handleInputChange}
            placeholder="Enter allergies"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Upload Document</Label>
          <Input
            type="file"
            onChange={handleFileChange}
            required
          />
        </InputGroup>

        <Button type="submit">Create Prescription</Button>
      </FormWrapper>
    </FormContainer>
  );
};

export default NewPrescription;
