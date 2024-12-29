import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
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

const InfoCard = styled(motion.div)`
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const InfoRow = styled(motion.div)`
  padding: 20px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.2);
`;

const Label = styled.span`
  display: block;
  color: #4A90E2;
  font-size: 0.9rem;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Value = styled.span`
  display: block;
  color: #ffffff;
  font-size: 1.1rem;
  word-break: break-all;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
`;

const PharmacyDashboard = () => {
  const [pharmacyData, setPharmacyData] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setPharmacyData(JSON.parse(userData));
    }

    // Three.js background setup
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0x4A90E2 });
    const torus = new THREE.Mesh(geometry, material);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    
    scene.add(torus, pointLight, ambientLight);
    camera.position.z = 30;

    function animate() {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      torus.rotation.z += 0.01;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      scene.remove(torus);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  if (!pharmacyData) {
    return (
      <Container>
        <BgCanvas id="bg-canvas" />
        <InfoCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Pharmacy Dashboard</Title>
          <p style={{ color: '#ffffff', textAlign: 'center' }}>Loading pharmacy information...</p>
        </InfoCard>
      </Container>
    );
  }

  return (
    <Container>
      <BgCanvas id="bg-canvas" />
      <InfoCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Pharmacy Dashboard
        </Title>
        <InfoGrid>
          <InfoRow whileHover={{ scale: 1.02 }}>
            <Label>Pharmacy Name</Label>
            <Value>{pharmacyData.name}</Value>
          </InfoRow>
          <InfoRow whileHover={{ scale: 1.02 }}>
            <Label>Owner Name</Label>
            <Value>{pharmacyData.owner}</Value>
          </InfoRow>
          <InfoRow whileHover={{ scale: 1.02 }}>
            <Label>Email</Label>
            <Value>{pharmacyData.email}</Value>
          </InfoRow>
          <InfoRow whileHover={{ scale: 1.02 }}>
            <Label>Phone</Label>
            <Value>{pharmacyData.phone}</Value>
          </InfoRow>
          <InfoRow whileHover={{ scale: 1.02 }}>
            <Label>Address</Label>
            <Value>{pharmacyData.address}</Value>
          </InfoRow>
          <InfoRow whileHover={{ scale: 1.02 }}>
            <Label>Wallet Address</Label>
            <Value>{pharmacyData.wallet}</Value>
          </InfoRow>
          <InfoRow whileHover={{ scale: 1.02 }}>
            <Label>Verification Status</Label>
            <Value>{pharmacyData.isVerified ? 'Verified' : 'Not Verified'}</Value>
          </InfoRow>
          <InfoRow whileHover={{ scale: 1.02 }}>
            <Label>Verification Document CID</Label>
            <Value>{pharmacyData.verification}</Value>
          </InfoRow>
        </InfoGrid>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Update Information
        </Button>
      </InfoCard>
    </Container>
  );
};

export default PharmacyDashboard;
