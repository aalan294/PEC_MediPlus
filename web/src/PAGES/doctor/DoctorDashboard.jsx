import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
  padding-top: 4rem;
`;

const Title = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const DashboardGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  margin-top: 2rem;
`;

const Card = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Label = styled.span`
  font-weight: 500;
  color: #4A90E2;
  font-size: 1.1rem;
`;

const Value = styled.span`
  display: block;
  margin-top: 0.5rem;
  color: #e0e0e0;
  font-size: 1rem;
  word-break: break-all;
`;

const NavMenu = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2;
`;

const MenuButton = styled.button`
  background: rgba(74, 144, 226, 0.2);
  border: 1px solid rgba(74, 144, 226, 0.5);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4A90E2;
  font-size: 24px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 144, 226, 0.3);
  }
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  right: 0;
  top: 60px;
  background: rgba(26, 26, 26, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  overflow: hidden;
  width: 200px;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 1rem 1.5rem;
  color: #4A90E2;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 144, 226, 0.1);
  }
`;

const DoctorDashboard = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const bgElement = document.getElementById('bg');
    if (bgElement) {
      bgElement.appendChild(renderer.domElement);
    }

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x4A90E2,
      wireframe: true
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (bgElement) {
        bgElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  
  const userData = JSON.parse(localStorage.getItem('medithon-user'));

  if (!userData) {
    return <div>No user data found. Please log in.</div>;
  }

  return (
    <Container ref={containerRef}>
      <BgCanvas id="bg" />
      <NavMenu>
        <MenuButton onClick={toggleDropdown}>
          ☰
        </MenuButton>
        {isDropdownOpen && (
          <Dropdown
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <DropdownItem to="/doctor/search">Search Patient</DropdownItem>
          </Dropdown>
        )}
      </NavMenu>
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Doctor Dashboard</Title>
        <DashboardGrid>
          <Card whileHover={{ scale: 1.02 }}>
            <Label>Name:</Label>
            <Value>{userData.name}</Value>
          </Card>
          <Card whileHover={{ scale: 1.02 }}>
            <Label>Email:</Label>
            <Value>{userData.email}</Value>
          </Card>
          <Card whileHover={{ scale: 1.02 }}>
            <Label>Phone:</Label>
            <Value>{userData.phone}</Value>
          </Card>
          <Card whileHover={{ scale: 1.02 }}>
            <Label>Department:</Label>
            <Value>{userData.dept}</Value>
          </Card>
          <Card whileHover={{ scale: 1.02 }}>
            <Label>Hospital:</Label>
            <Value>{userData.hospital}</Value>
          </Card>
          <Card whileHover={{ scale: 1.02 }}>
            <Label>Address:</Label>
            <Value>{userData.address}</Value>
          </Card>
          <Card whileHover={{ scale: 1.02 }}>
            <Label>Wallet:</Label>
            <Value>{userData.wallet}</Value>
          </Card>
        </DashboardGrid>
      </ContentWrapper>
    </Container>
  );
};

export default DoctorDashboard;
