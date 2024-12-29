import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../API/api';
import styled from 'styled-components';
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

const SearchBar = styled(motion.input)`
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  background: rgba(26, 26, 26, 0.9);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 8px;
  color: #fff;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4A90E2;
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
  }
`;

const PatientList = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const PatientCard = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  cursor: pointer;
  transition: transform 0.3s ease;
  color: #fff;

  &:hover {
    transform: translateY(-5px);
    border-color: #4A90E2;
  }
`;

const Label = styled.span`
  font-weight: 500;
  color: #4A90E2;
`;

const Value = styled.span`
  margin-left: 8px;
  color: #fff;
`;

const NoResults = styled(motion.p)`
  color: #fff;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const deptEnum = {
  0: 'Cardiology',
  1: 'Psychiatry',
  2: 'General'
};

const PatientSearch = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const rendererRef = useRef(null);
  
  const navigate = useNavigate();
  const doctorData = JSON.parse(localStorage.getItem('medithon-user'));
  const doctorDept = doctorData?.dept;

  useEffect(() => {
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const bgElement = document.getElementById('bg');
    if (bgElement && !bgElement.contains(renderer.domElement)) {
      bgElement.appendChild(renderer.domElement);
    }

    // Create animated background
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x4A90E2,
      wireframe: true
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // Add lighting
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    camera.position.z = 30;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (bgElement) {
        bgElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/doctor/all-patients');
        const allPatients = response.data.patients;
        const deptPatients = allPatients;
        setPatients(deptPatients);
        setFilteredPatients(deptPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [doctorDept]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(value) ||
      patient.contactNumber.includes(value)
    );

    setFilteredPatients(filtered);
  };

  const handlePatientClick = (id) => {
    navigate(`/doctor/analyse/${id}`);
  };

  return (
    <Container>
      <BgCanvas id="bg" />
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>{deptEnum[doctorDept]} Department - Patient Search</Title>
        <SearchBar
          type="text"
          placeholder="Search by Name or Contact Number..."
          value={searchTerm}
          onChange={handleSearch}
        />
        
        <PatientList>
          {filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
              <PatientCard 
                key={patient._id} 
                onClick={() => handlePatientClick(patient._id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div>
                  <Label>Name:</Label> <Value>{patient.name}</Value>
                </div>
                <div>
                  <Label>Contact Number:</Label> <Value>{patient.contactNumber}</Value>
                </div>
                <div>
                  <Label>Age:</Label> <Value>{patient.age}</Value>
                </div>
                <div>
                  <Label>Blood Group:</Label> <Value>{patient.blood}</Value>
                </div>
              </PatientCard>
            ))
          ) : (
            <NoResults
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              No patients found.
            </NoResults>
          )}
        </PatientList>
      </ContentWrapper>
    </Container>
  );
};

export default PatientSearch;
