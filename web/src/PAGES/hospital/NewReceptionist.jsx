import React, { useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { pinata } from '../../config';
import api from '../../API/api';
import { abi } from '../../abi';
import { contractAddress } from '../../contractAddress';
import { motion } from 'framer-motion';
import { FaUserPlus, FaHospital, FaEnvelope, FaPhone, FaWallet, FaFileUpload } from 'react-icons/fa';

const Container = styled.div`
  min-height: 100vh;
  background: #f0f2f5;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/images/medical-bg.jpg') no-repeat center center;
    background-size: cover;
    opacity: 0.1;
    z-index: 0;
  }
`;

const GlassmorphicElement = styled.div`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
  backdrop-filter: blur(10px);
  z-index: 0;
`;

const TopLeftCircle = styled(GlassmorphicElement)`
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
`;

const BottomRightCircle = styled(GlassmorphicElement)`
  width: 400px;
  height: 400px;
  bottom: -150px;
  right: -150px;
`;

const FormWrapper = styled(motion.form)`
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  backdrop-filter: blur(8px);
  max-width: 1000px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  z-index: 1;
  position: relative;
`;

const Title = styled(motion.h2)`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  grid-column: span 2;
  font-size: 2.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  
  span {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const InputGroup = styled(motion.div)`
  margin-bottom: 20px;
  position: relative;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
  
  svg {
    margin-right: 8px;
    color: #1e3c72;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  padding-left: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background-color: white;
  font-size: 16px;
  color: #2c3e50;
  transition: all 0.3s ease;

  &:focus {
    border-color: #1e3c72;
    outline: none;
    box-shadow: 0 0 15px rgba(30, 60, 114, 0.1);
  }
`;

const Button = styled(motion.button)`
  grid-column: span 2;
  padding: 16px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(42, 82, 152, 0.3);
  }
`;

const ErrorMessage = styled(motion.p)`
  grid-column: span 2;
  color: #e74c3c;
  text-align: center;
  font-weight: 500;
  background: rgba(231, 76, 60, 0.1);
  padding: 12px;
  border-radius: 8px;
`;

const SuccessMessage = styled(motion.p)`
  grid-column: span 2;
  color: #27ae60;
  text-align: center;
  font-weight: 500;
  background: rgba(39, 174, 96, 0.1);
  padding: 12px;
  border-radius: 8px;
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
      const response = await api.post('/hospital/reg-recep', receptionistData);

      if (response.data.status) {
        const { id } = response.data;
        console.log('Receptionist ID:', id);

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
          1
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
    <Container>
      <TopLeftCircle />
      <BottomRightCircle />
      <FormWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
      >
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span>Register Receptionist</span>
        </Title>

        {error && <ErrorMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >{error}</ErrorMessage>}
        {success && <SuccessMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >{success}</SuccessMessage>}

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Label><FaUserPlus />Name</Label>
          <Input
            type="text"
            name="name"
            value={receptionistData.name}
            onChange={handleInputChange}
            placeholder="Enter receptionist's name"
            required
          />
        </InputGroup>

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Label><FaEnvelope />Email</Label>
          <Input
            type="email"
            name="email"
            value={receptionistData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
          />
        </InputGroup>

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Label><FaPhone />Phone</Label>
          <Input
            type="tel"
            name="phone"
            value={receptionistData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required
          />
        </InputGroup>

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Label><FaWallet />Wallet Address</Label>
          <Input
            type="text"
            name="wallet"
            value={receptionistData.wallet}
            onChange={handleInputChange}
            placeholder="Enter wallet address"
            required
          />
        </InputGroup>

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Label><FaHospital />Hospital</Label>
          <Input
            type="text"
            name="hospital"
            value={receptionistData.hospital}
            onChange={handleInputChange}
            placeholder="Enter hospital name"
            required
          />
        </InputGroup>

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Label><FaFileUpload />Verification Document</Label>
          <Input type="file" onChange={handleFileChange} required />
          <Button 
            type="button" 
            onClick={handleFileUpload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFileUpload /> Upload to IPFS
          </Button>
        </InputGroup>

        <Button 
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaUserPlus /> Register Receptionist
        </Button>
      </FormWrapper>
    </Container>
  );
};

export default NewReceptionist;
