import React, { useState } from 'react';
import styled from 'styled-components';
import { pinata } from '../../config';
import api from '../../API/api';

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

const PharmacyRequest = () => {
  const [pharmacyData, setPharmacyData] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    address: '',
    wallet: '',
    verification: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPharmacyData({ ...pharmacyData, [name]: value });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      if (!selectedFile) {
        setError('Please select a file to upload');
        return;
      }

      const response = await pinata.upload.file(selectedFile);
      const cid = response.cid;

      setPharmacyData({ ...pharmacyData, verification: cid });
      setSuccess('File uploaded successfully!');
      console.log('CID:', cid);
    } catch (error) {
      setError('Error uploading to IPFS');
      console.error('Error uploading to IPFS:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Request pharmacy registration
      const response = await api.post('/pharm/reg-pharm', pharmacyData);

      if (response.data.status) {
        setSuccess('Pharmacy registered successfully!');
        setPharmacyData({
          name: '',
          owner: '',
          email: '',
          phone: '',
          address: '',
          wallet: '',
          verification: ''
        });
        setSelectedFile(null);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error occurred while registering the pharmacy');
      console.error('Error:', error);
    }
  };

  return (
    <FormContainer>
      <FormWrapper onSubmit={handleSubmit}>
        <Title>Register Pharmacy</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <InputGroup>
          <Label>Pharmacy Name</Label>
          <Input
            type="text"
            name="name"
            value={pharmacyData.name}
            onChange={handleInputChange}
            placeholder="Enter pharmacy name"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Owner Name</Label>
          <Input
            type="text"
            name="owner"
            value={pharmacyData.owner}
            onChange={handleInputChange}
            placeholder="Enter owner's name"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={pharmacyData.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Phone</Label>
          <Input
            type="tel"
            name="phone"
            value={pharmacyData.phone}
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
            value={pharmacyData.address}
            onChange={handleInputChange}
            placeholder="Enter pharmacy address"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Wallet Address</Label>
          <Input
            type="text"
            name="wallet"
            value={pharmacyData.wallet}
            onChange={handleInputChange}
            placeholder="Enter wallet address"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Verification Document (License, Registration Certificate)</Label>
          <Input type="file" onChange={handleFileChange} required />
          <Button type="button" onClick={handleFileUpload}>
            Upload to IPFS
          </Button>
        </InputGroup>

        <Button type="submit">Submit Request</Button>
      </FormWrapper>
    </FormContainer>
  );
};

export default PharmacyRequest;
