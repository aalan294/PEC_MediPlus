import React, { useEffect, useState, useRef } from 'react'
import api from '../../API/api';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const AdminNav = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [hospital, setHospital] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const containerRef = useRef(null);
   
    useEffect(() => {
      // Three.js background setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // Add animated particles
      const particles = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({ color: '#4A90E2', size: 0.05 })
      );
      scene.add(particles);
      camera.position.z = 2;

      const animate = () => {
        requestAnimationFrame(animate);
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        containerRef.current?.removeChild(renderer.domElement);
      };
    }, []);

    const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
    };

    // Fetch all doctors, pharmacies, and receptionists
    useEffect(() => {
      const fetchData = async () => {
        try {
          const hospitalRes = await api.get('/admin/get-hospital');
          const pharmacyRes = await api.get('/admin/get-pharm');

          setHospital(hospitalRes.data.hospitals);
          setPharmacies(pharmacyRes.data.pharmacies);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, []);

    return (
      <Container>
        <BgCanvas ref={containerRef} />
        
        <ContentWrapper>
          {/* Hamburger Menu */}
          <HamburgerMenu onClick={toggleDropdown}>☰</HamburgerMenu>
          {showDropdown && (
            <DropdownMenu>
              <DropdownItem href="/admin/new-hos">Hospital Request</DropdownItem>
              <DropdownItem href="/admin/new-pharm">Pharmacy Request</DropdownItem>
              <DropdownItem href="/admin/dashboard">Dashboard</DropdownItem>
              <DropdownItem href='/'>Logout</DropdownItem>
            </DropdownMenu>
          )}

          {/* Count Section */}
          <StatsSection>
            <StatCard>
              <StatValue>{hospital.length}</StatValue>
              <StatLabel>Total Hospitals</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{pharmacies.length}</StatValue>
              <StatLabel>Total Pharmacies</StatLabel>
            </StatCard>
          </StatsSection>
        </ContentWrapper>
      </Container>
    );
}

const Container = styled.div`
  min-height: 100vh;
  background-color: #121212;
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

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem;
`;

const StatsSection = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 6rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  border-radius: 12px;
  padding: 2rem;
  width: 200px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #999;
  font-size: 1.1rem;
`;

const HamburgerMenu = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 25px;
  background: rgba(74, 144, 226, 0.2);
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  color: #4A90E2;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 144, 226, 0.3);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 70px;
  right: 20px;
  font-size: 1.1rem;
  background: rgba(26, 26, 26, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const DropdownItem = styled.a`
  display: block;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: #4A90E2;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(74, 144, 226, 0.1);
  }
`;

export default AdminNav