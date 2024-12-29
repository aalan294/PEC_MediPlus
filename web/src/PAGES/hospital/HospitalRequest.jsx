import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { pinata } from '../../config';
import api from '../../API/api';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const Container = styled.div`
  min-height: 100vh;
  background-color: #121212;
  position: relative;
  overflow: hidden;
  padding: 2rem;
`;

const BgCanvas = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
`;

const Title = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FormWrapper = styled(motion.form)`
  background: rgba(26, 26, 26, 0.9);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
`;

const InputGroup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin-right: 30px;
`;

const Label = styled.label`
  color: #fff;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4A90E2;
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
  }
`;

const Button = styled(motion.button)`
  grid-column: span 3;
  padding: 1rem;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
  }
`;

const Message = styled(motion.p)`
  grid-column: span 3;
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  color: #fff;
  background: ${props => props.type === 'error' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)'};
`;

const HospitalRequest = () => {
  const [hospitalData, setHospitalData] = useState({
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

    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x4A90E2,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.001;
      sphere.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHospitalData({ ...hospitalData, [name]: value });
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

      setHospitalData({ ...hospitalData, verification: cid });
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
      const response = await api.post('/hospital/req-hospital', hospitalData);

      if (response.data.status) {
        setSuccess('Hospital request submitted successfully!');
        setHospitalData({
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
      setError('Error occurred while submitting the hospital request');
      console.error('Error:', error);
    }
  };

  return (
    <Container>
      <BgCanvas ref={canvasRef} />
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Request Hospital Registration
        </Title>

        <FormWrapper onSubmit={handleSubmit}>
          {error && <Message type="error">{error}</Message>}
          {success && <Message type="success">{success}</Message>}

          <InputGroup whileHover={{ scale: 1.02 }}>
            <Label>Hospital Name</Label>
            <Input
              type="text"
              name="name"
              value={hospitalData.name}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup whileHover={{ scale: 1.02 }}>
            <Label>Owner Name</Label>
            <Input
              type="text"
              name="owner"
              value={hospitalData.owner}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup whileHover={{ scale: 1.02 }}>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={hospitalData.email}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup whileHover={{ scale: 1.02 }}>
            <Label>Phone</Label>
            <Input
              type="tel"
              name="phone"
              value={hospitalData.phone}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup whileHover={{ scale: 1.02 }}>
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              value={hospitalData.address}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup whileHover={{ scale: 1.02 }}>
            <Label>Wallet Address</Label>
            <Input
              type="text"
              name="wallet"
              value={hospitalData.wallet}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup whileHover={{ scale: 1.02 }}>
            <Label>Verification Document</Label>
            <Input type="file" onChange={handleFileChange} required />

          </InputGroup>
          <Button 
              type="button" 
              onClick={handleFileUpload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Upload to IPFS
            </Button>

          <Button 
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Request
          </Button>
        </FormWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default HospitalRequest;
