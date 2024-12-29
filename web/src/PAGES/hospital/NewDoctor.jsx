import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import Web3 from 'web3';

import { pinata } from '../../config';

import api from '../../API/api';

import { abi } from '../../abi';

import { contractAddress } from '../../contractAddress';

import * as THREE from 'three';

// Styled Components

const PageContainer = styled.div`

  min-height: 100vh;

  background: #121212;

  position: relative;

  overflow: hidden;

`;

const BgCanvas = styled.div`

  position: fixed;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  z-index: 0;

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

  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x4A90E2,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const torus = new THREE.Mesh(geometry, material);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    
    scene.add(torus, pointLight, ambientLight);
    camera.position.z = 30;

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    function animate() {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      torus.rotation.z += 0.01;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvasRef.current?.contains(renderer.domElement)) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      scene.remove(torus);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

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

    <PageContainer>

      <BgCanvas ref={canvasRef} />

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
