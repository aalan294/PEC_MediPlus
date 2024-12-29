import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { pinata } from '../../config';
import api from '../../API/api';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const Container = styled.div`
  min-height: 100vh;
  background-color: #121212;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const BgCanvas = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const Form = styled(motion.form)`
  background: rgba(26, 26, 26, 0.9);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  max-width: 800px;
  width: 100%;
  z-index: 1;
`;

const Title = styled(motion.h2)`
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5rem;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const InputGroup = styled(motion.div)`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  color: #4A90E2;
  font-size: 0.9rem;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(74, 144, 226, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4A90E2;
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #63B3ED, #4A90E2);
  }
`;

const ErrorMessage = styled(motion.p)`
  color: #ff4444;
  text-align: center;
  margin: 10px 0;
`;

const SuccessMessage = styled(motion.p)`
  color: #00C851;
  text-align: center;
  margin: 10px 0;
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
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x4A90E2,
      wireframe: true
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, []);

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
    <Container>
      <BgCanvas ref={canvasRef} />
      <Form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Register Pharmacy
        </Title>

        {error && <ErrorMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >{error}</ErrorMessage>}
        {success && <SuccessMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >{success}</SuccessMessage>}

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
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

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
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

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
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

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
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

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
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

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
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

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Label>Verification Document</Label>
          <Input type="file" onChange={handleFileChange} required />
          <Button 
            type="button" 
            onClick={handleFileUpload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upload to IPFS
          </Button>
        </InputGroup>

        <Button 
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Submit Request
        </Button>
      </Form>
    </Container>
  );
};

export default PharmacyRequest;
