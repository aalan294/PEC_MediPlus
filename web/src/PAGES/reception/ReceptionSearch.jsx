import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import api from '../../API/api';

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

const SearchWrapper = styled(motion.div)`
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
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.2);
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 10px;
  color: #E0E0E0;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 6px;
  color: #FFFFFF;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4A90E2;
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.2);
  }
`;

const PatientCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid rgba(74, 144, 226, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #E0E0E0;
`;

const Button = styled(motion.button)`
  padding: 10px 20px;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  text-align: center;
  margin: 10px 0;
`;

const ReceptionSearch = () => {
  const history = useNavigate();
  const canvasRef = useRef(null);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [error, setError] = useState('');

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

    // Fetch patients
    const fetchPatients = async () => {
      try {
        const response = await api.get('/reception/get-all');
        if (response.data.status) {
          setPatients(response.data.patients);
        } else {
          setError('Failed to fetch patients');
        }
      } catch (error) {
        setError('Error occurred while fetching patient data');
      }
    };

    fetchPatients();

    return () => {
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const filtered = patients.filter((patient) =>
      patient.contactNumber && patient.contactNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleAddPrescription = (patientId) => {
    history(`/reception/old-case/${patientId}`);
  };

  const handleCreateUser = () => {
    history('/reception/new-case');
  };

  return (
    <Container>
      <BgCanvas ref={canvasRef} />
      <SearchWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Patient Search</Title>
        <InputGroup>
          <Label>Search by Mobile Number</Label>
          <Input
            type="text"
            placeholder="Enter mobile number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <motion.div layout>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <PatientCard
                key={patient._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <strong>{patient.name}</strong>
                  <p>Mobile: {patient.contactNumber}</p>
                </div>
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddPrescription(patient._id)}
                >
                  Add Prescription
                </Button>
              </PatientCard>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {searchTerm ? (
                <div>
                  <p style={{ color: '#E0E0E0', textAlign: 'center', marginBottom: '20px' }}>
                    No patient found with mobile number: {searchTerm}
                  </p>
                  <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateUser}
                    style={{ width: '100%' }}
                  >
                    Create New User
                  </Button>
                </div>
              ) : (
                <p style={{ color: '#E0E0E0', textAlign: 'center' }}>
                  Start typing to search for patients by mobile number
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </SearchWrapper>
    </Container>
  );
};

export default ReceptionSearch;
