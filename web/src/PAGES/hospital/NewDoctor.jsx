import React, { useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { pinata } from '../../config';
import api from '../../API/api';
import { abi } from '../../abi';
import { contractAddress } from '../../contractAddress';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to right, #000428, #004e92);
  position: relative;
  overflow: hidden;
`;

const BackgroundElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;

  &:before {
    content: '';
    position: absolute;
    top: 15%;
    left: -5%;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(45,70,185,0.3) 0%, rgba(45,70,185,0) 70%);
    animation: float 8s infinite ease-in-out;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 10%;
    right: -5%;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(72,149,239,0.3) 0%, rgba(72,149,239,0) 70%);
    animation: float 6s infinite ease-in-out reverse;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  z-index: 1;
`;

const FormWrapper = styled.form`
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h2`
  color: #ffffff;
  text-align: center;
  margin-bottom: 40px;
  grid-column: span 3;
  font-size: 3rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const InputGroup = styled.div`
  margin-bottom: 25px;
  position: relative;
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 16px;
  color: #ffffff;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4895ef;
    box-shadow: 0 0 15px rgba(72, 149, 239, 0.3);
    outline: none;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4895ef;
    box-shadow: 0 0 15px rgba(72, 149, 239, 0.3);
    outline: none;
  }

  option {
    background: #000428;
    color: #ffffff;
  }
`;

const Button = styled.button`
  grid-column: span 3;
  padding: 18px;
  background: linear-gradient(45deg, #4895ef 0%, #2d46b9 100%);
  color: white;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.4s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(72, 149, 239, 0.4);
    
    &:before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const Message = styled.p`
  grid-column: span 3;
  text-align: center;
  padding: 15px;
  border-radius: 15px;
  font-weight: 600;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ErrorMessage = styled(Message)`
  background: rgba(255, 82, 82, 0.2);
  color: #ff5252;
  border: 2px solid rgba(255, 82, 82, 0.5);
`;

const SuccessMessage = styled(Message)`
  background: rgba(0, 230, 118, 0.2);
  color: #00e676;
  border: 2px solid rgba(0, 230, 118, 0.5);
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

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesConfig = {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      line_linked: {
        enable: true,
        color: "#ffffff",
        opacity: 0.2
      },
      move: {
        enable: true,
        speed: 1.5
      },
      opacity: {
        value: 0.3
      },
      size: {
        value: 3
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }
    try {
      // Implement file upload logic here
      const formData = new FormData();
      formData.append('file', selectedFile);
      // Add IPFS upload logic
    } catch (err) {
      setError('Error uploading file: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Implement form submission logic here
      // Add validation and API calls
      setSuccess('Doctor registered successfully!');
    } catch (err) {
      setError('Error registering doctor: ' + err.message);
    }
  };

  return (
    <PageContainer>
      <BackgroundElements />
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
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
              placeholder="Enter doctor's name"
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
              placeholder="Enter email address"
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
              placeholder="Enter physical address"
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
              placeholder="Enter ETH wallet address"
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
            <Select
              name="dept"
              value={doctorData.dept}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Oncology">Oncology</option>
              <option value="Pediatrics">Pediatrics</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Verification Document</Label>
            <Input 
              type="file" 
              onChange={handleFileChange} 
              required 
              style={{padding: '12px'}}
            />
            <Button 
              type="button" 
              onClick={handleFileUpload}
              style={{marginTop: '15px'}}
            >
              Upload to IPFS
            </Button>
          </InputGroup>

          <Button type="submit">Register Doctor</Button>
        </FormWrapper>
      </FormContainer>
    </PageContainer>
  );
};

export default NewDoctor;
