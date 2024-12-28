import React, { useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { pinata } from '../../config'; // Import Pinata config
import api from '../../API/api'; // Import API config for backend calls
import { abi } from '../../abi'; // Import the ABI of the smart contract
import { contractAddress } from '../../contractAddress';

// Styled Components
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

const NewReceptionist = () => {
  const [receptionistData, setReceptionistData] = useState({
    name: '',
    email: '',
    phone: '',
    wallet: '',
    hospital: '',
    verification: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceptionistData({ ...receptionistData, [name]: value });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      const response = await pinata.upload.file(selectedFile);
      const cid = response.cid;
      setReceptionistData({ ...receptionistData, verification: cid });
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
      // Step 1: Register receptionist in the backend
      const response = await api.post('/hospital/reg-recep', receptionistData);

      if (response.data.status) {
        const { id } = response.data;
        console.log('Receptionist ID:', id);

        // Step 2: Call smart contract function
        await registerReceptionistOnBlockchain(id, receptionistData);

        setSuccess('Receptionist registered successfully!');
        setReceptionistData({
          name: '',
          email: '',
          phone: '',
          wallet: '',
          hospital: '',
          verification: ''
        });

        // Redirect to dashboard
        window.location.href = '/hospital/dashboard';
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error occurred while registering the receptionist');
      console.error('Error:', error);
    }
  };

  const registerReceptionistOnBlockchain = async (receptionistId, receptionistData) => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();

      const contract = new web3.eth.Contract(abi, contractAddress);

      await contract.methods
        .registerReceptionist(
          receptionistData.wallet, 
          receptionistId, 
          "Sample",
          receptionistData.verification, 
          1 // Role.Receptionist enum is 1
        )
        .send({ from: accounts[0] });

      console.log('Receptionist registered on blockchain successfully!');
      alert("Receptionist registered successfully on blockchain!");
    } catch (error) {
      alert(`${error.message}`)
      setError('Error occurred while registering the receptionist on the blockchain');
      console.error('Blockchain Error:', error);
    }
  };

  return (
    <FormContainer>
      <FormWrapper onSubmit={handleSubmit}>
        <Title>Register Receptionist</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <InputGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={receptionistData.name}
            onChange={handleInputChange}
            placeholder="Enter receptionist's name"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={receptionistData.email}
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
            value={receptionistData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Wallet Address</Label>
          <Input
            type="text"
            name="wallet"
            value={receptionistData.wallet}
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
            value={receptionistData.hospital}
            onChange={handleInputChange}
            placeholder="Enter hospital name"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Verification Document (ID, etc.)</Label>
          <Input type="file" onChange={handleFileChange} required />
          <Button type="button" onClick={handleFileUpload}>
            Upload to IPFS
          </Button>
        </InputGroup>

        <Button type="submit">Register Receptionist</Button>
      </FormWrapper>
    </FormContainer>
  );
};

export default NewReceptionist;
