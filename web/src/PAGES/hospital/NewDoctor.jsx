import React, { useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { pinata } from '../../config';
import api from '../../API/api';
import { abi } from '../../abi';
import { contractAddress } from '../../contractAddress';

// Styled Components for blue and white theme
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
  max-width: 800px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const Title = styled.h2`
  color: #007bff;
  text-align: center;
  margin-bottom: 20px;
  grid-column: span 3;
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

const Button = styled.button`
  grid-column: span 3;
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
  grid-column: span 3;
  color: red;
  text-align: center;
`;

const SuccessMessage = styled.p`
  grid-column: span 3;
  color: green;
  text-align: center;
`;

const NewDoctor = () => {
  const [doctorData, setDoctorData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    wallet: '',
    hospital: '',
    verification: '',
    dept: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({ ...doctorData, [name]: value });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      const response = await pinata.upload.file(selectedFile);
      const cid = response.cid;

      setDoctorData({ ...doctorData, verification: cid });
      console.log('CID:', cid);
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Step 1: Register doctor in the backend
      const response = await api.post('/hospital/reg-doc', doctorData);

      if (response.data.status) {
        const { id } = response.data;
        console.log('Doctor ID:', id);

        // Step 2: Call smart contract function
        await registerDoctorOnBlockchain(id, doctorData);

        setSuccess('Doctor registered successfully!');
        setDoctorData({
          name: '',
          email: '',
          phone: '',
          address: '',
          wallet: '',
          hospital: '',
          verification: '',
          dept: ''
        });

        // Redirect to dashboard
        window.location.href = '/hospital/dashboard';
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error occurred while registering the doctor');
      console.error('Error:', error);
    }
  };

  const registerDoctorOnBlockchain = async (doctorId, doctorData) => {
    try {
      // Ensure Web3 is available and get the user's wallet address
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance
      const contract = new web3.eth.Contract(abi, contractAddress);

      // Determine the enum value for the department
      const deptEnum = getDepartmentEnumValue(doctorData.dept);

      // Call the smart contract function
      await contract.methods
        .registerDoctor(doctorData.wallet, doctorId,"Sample", doctorData.verification, deptEnum)
        .send({ from: accounts[0] });

      console.log('Doctor registered on blockchain successfully!');
      alert("successsfull")
    } catch (error) {
      setError('Error occurred while registering the doctor on the blockchain');
      console.error('Blockchain Error:', error);
    }
  };

  // Function to map department names to enum values
  const getDepartmentEnumValue = (dept) => {
    const departments = {
      "Cardiology": 0,
      "Neurology": 1,
      "Oncology": 2,
      "Pediatrics": 3,
      // Add more mappings as needed
    };
    return departments[dept] ?? 0; // Default to 0 if department is not found
  };

  return (
    <FormContainer>
      <FormWrapper onSubmit={handleSubmit}>
        <Title>Register Doctor</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <InputGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={doctorData.name}
            onChange={handleInputChange}
            placeholder="Enter name"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={doctorData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Phone</Label>
          <Input
            type="tel"
            name="phone"
            value={doctorData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Address</Label>
          <Input
            type="text"
            name="address"
            value={doctorData.address}
            onChange={handleInputChange}
            placeholder="Enter address"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Wallet Address</Label>
          <Input
            type="text"
            name="wallet"
            value={doctorData.wallet}
            onChange={handleInputChange}
            placeholder="Enter wallet address"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Hospital</Label>
          <Input
            type="text"
            name="hospital"
            value={doctorData.hospital}
            onChange={handleInputChange}
            placeholder="Enter hospital name"
            required
          />
        </InputGroup>

        <InputGroup>
  <Label>Department</Label>
  <select
    name="dept"
    value={doctorData.dept}
    onChange={handleInputChange}
    required
    style={{
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
      fontSize: '16px',
      color: '#333',
    }}
  >
    <option value="" disabled>Select department</option>
    <option value="Cardiology">Cardiology</option>
    <option value="Neurology">Neurology</option>
    <option value="Oncology">Oncology</option>
    <option value="Pediatrics">Pediatrics</option>
    {/* Add more options here */}
  </select>
</InputGroup>


        <InputGroup>
          <Label>Verification Document (MBBS Certificate, Joining Letter)</Label>
          <Input type="file" onChange={handleFileChange} required />
          <Button type="button" onClick={handleFileUpload}>
            Upload to IPFS
          </Button>
        </InputGroup>

        <Button type="submit">Register Doctor</Button>
      </FormWrapper>
    </FormContainer>
  );
};

export default NewDoctor;
