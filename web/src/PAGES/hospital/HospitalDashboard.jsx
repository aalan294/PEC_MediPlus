import React, { useEffect, useState, useRef } from 'react';
import api from '../../API/api';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

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
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  color: #fff;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatsContainer = styled(motion.div)`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 200px;
  text-align: center;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 144, 226, 0.3);
`;

const NavMenu = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10;
`;

const NavButton = styled(motion.button)`
  background: rgba(26, 26, 26, 0.9);
  border: 1px solid rgba(74, 144, 226, 0.3);
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(74, 144, 226, 0.2);
  }
`;

const HospitalDashBoard = () => {
  const [doctors, setDoctors] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const canvasRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x4A90E2,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
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
    const fetchData = async () => {
      try {
        const receptionistRes = await api.get('/hospital/get-recep');
        const doctorRes = await api.get('/hospital/get-doc');
        setDoctors(doctorRes.data.doctors);
        setReceptionists(receptionistRes.data.receptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <BgCanvas ref={canvasRef} />
      
      <ContentWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <NavMenu>
          <NavButton onClick={() => setShowDropdown(!showDropdown)}>
            Menu
          </NavButton>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(26, 26, 26, 0.9)',
                padding: '1rem',
                borderRadius: '8px',
                marginTop: '0.5rem'
              }}
            >
              <Link to="/hospital/new-doc" style={{ color: '#fff', display: 'block', margin: '0.5rem 0' }}>
                Register Doctor
              </Link>
              <Link to="/hospital/new-recep" style={{ color: '#fff', display: 'block', margin: '0.5rem 0' }}>
                Register Receptionist
              </Link>
            </motion.div>
          )}
        </NavMenu>

        <Title
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Hospital Dashboard
        </Title>

        <StatsContainer>
          <StatCard whileHover={{ scale: 1.05 }}>
            <h3>Total Doctors</h3>
            <h2>{doctors.length}</h2>
          </StatCard>
          <StatCard whileHover={{ scale: 1.05 }}>
            <h3>Total Receptionists</h3>
            <h2>{receptionists.length}</h2>
          </StatCard>
        </StatsContainer>

        <DashboardGrid>
          <Card>
            <h3>Doctors List</h3>
            {doctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                whileHover={{ scale: 1.02 }}
                style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
              >
                <p><strong>Name:</strong> {doctor.name}</p>
                <p><strong>Email:</strong> {doctor.email}</p>
                <p><strong>Wallet:</strong> {doctor.wallet}</p>
              </motion.div>
            ))}
          </Card>

          <Card>
            <h3>Receptionists List</h3>
            {receptionists.map((receptionist) => (
              <motion.div
                key={receptionist.id}
                whileHover={{ scale: 1.02 }}
                style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
              >
                <p><strong>Name:</strong> {receptionist.name}</p>
                <p><strong>Email:</strong> {receptionist.email}</p>
                <p><strong>Wallet:</strong> {receptionist.wallet}</p>
              </motion.div>
            ))}
          </Card>
        </DashboardGrid>
      </ContentWrapper>
    </Container>
  );
};

export default HospitalDashBoard;
