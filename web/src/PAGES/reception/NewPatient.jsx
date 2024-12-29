import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import api from '../../API/api';

const NewPatient = () => {
  const history = useNavigate();
  const canvasRef = useRef(null);
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    contactNumber: '',
    address: '',
    email: '',
    blood: '',
    emergency: '',
    DOB: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Three.js background setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    // Create animated background elements
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0x4A90E2,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });

    const meshes = [];
    for (let i = 0; i < 20; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(mesh);
      meshes.push(mesh);
    }

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      meshes.forEach(mesh => {
        mesh.rotation.x += 0.001;
        mesh.rotation.y += 0.001;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  const handleChange = (e) => {
    setPatientData({
      ...patientData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/reception/new-case', patientData);
      if (response.data.status) {
        setSuccess('Patient registered successfully!');
        setError('');
        setTimeout(() => {
          history('/reception/dashboard');
        }, 2000);
      } else {
        setSuccess('');
        setError(response.data.message || 'Error registering patient');
      }
    } catch (error) {
      setSuccess('');
      setError('An error occurred while registering the patient.');
    }
  };

  return (
    <Container>
      <BgCanvas ref={canvasRef} />
      <FormCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Register New Patient
        </Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" name="name" value={patientData.name} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Age</Label>
              <Input type="number" name="age" value={patientData.age} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Gender</Label>
              <Input type="text" name="gender" value={patientData.gender} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Contact Number</Label>
              <Input type="text" name="contactNumber" value={patientData.contactNumber} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Address</Label>
              <Input type="text" name="address" value={patientData.address} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input type="email" name="email" value={patientData.email} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Blood Group</Label>
              <Input type="text" name="blood" value={patientData.blood} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Emergency Contact</Label>
              <Input type="text" name="emergency" value={patientData.emergency} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Date of Birth</Label>
              <Input type="date" name="DOB" value={patientData.DOB} onChange={handleChange} required />
            </FormGroup>
          </FormGrid>
          <Button type="submit">Register Patient</Button>
        </form>
      </FormCard>
    </Container>
  );
};

export default NewPatient;

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

const FormCard = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  max-width: 1000px;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  color: #4A90E2;
  font-size: 0.9rem;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4A90E2;
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.2);
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
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  text-align: center;
  margin-bottom: 20px;
`;

const SuccessMessage = styled.p`
  color: #4CAF50;
  text-align: center;
  margin-bottom: 20px;
`;
