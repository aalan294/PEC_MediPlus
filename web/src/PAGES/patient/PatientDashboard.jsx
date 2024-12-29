import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

const InfoCard = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  margin-bottom: 2rem;
`;

const InfoRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(74, 144, 226, 0.2);
  color: #fff;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-weight: 500;
  color: #4A90E2;
`;

const Value = styled.span`
  color: #fff;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ActionButton = styled(motion.button)`
  padding: 1rem;
  background: rgba(74, 144, 226, 0.1);
  color: #4A90E2;
  border: 1px solid #4A90E2;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4A90E2;
    color: #121212;
  }
`;

const LogoutButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  margin-top: 2rem;
  background: rgba(220, 38, 38, 0.1);
  color: #DC2626;
  border: 1px solid #DC2626;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #DC2626;
    color: #fff;
  }
`;

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const navigate = useNavigate();
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

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const storedPatient = JSON.parse(localStorage.getItem('patient'));
    if (storedPatient) {
      setPatientData(storedPatient);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('patient');
    navigate('/');
  };

  if (!patientData) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <BgCanvas ref={canvasRef} />
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Patient Dashboard</Title>
        <InfoCard>
          <InfoRow>
            <Label>Name:</Label>
            <Value>{patientData.name}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Email:</Label>
            <Value>{patientData.email}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Contact Number:</Label>
            <Value>{patientData.contactNumber}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Age:</Label>
            <Value>{patientData.age}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Blood Group:</Label>
            <Value>{patientData.blood}</Value>
          </InfoRow>

          <ActionButtons>
            <ActionButton whileHover={{ scale: 1.05 }}>
              View Medical History
            </ActionButton>
            <ActionButton whileHover={{ scale: 1.05 }}>
              Book Appointment
            </ActionButton>
          </ActionButtons>

          <LogoutButton
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </LogoutButton>
        </InfoCard>
      </ContentWrapper>
    </Container>
  );
};

export default PatientDashboard;
