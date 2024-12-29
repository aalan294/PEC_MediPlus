import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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

const Wrapper = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  max-width: 800px;
  width: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
`;

const AlertBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.2);
  color: white;
  padding: 30px;
  border-radius: 12px;
  font-size: 24px;
  text-align: center;
  width: 100%;
`;

const HomeLink = styled(motion(Link))`
  color: #4A90E2;
  text-decoration: none;
  font-size: 20px;
  padding: 15px 40px;
  border: 2px solid rgba(74, 144, 226, 0.3);
  border-radius: 8px;
  transition: all 0.4s ease;
  background: rgba(255, 255, 255, 0.05);
  
  &:hover {
    background: rgba(74, 144, 226, 0.2);
  }
`;

const UnverifiedP = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('bg-canvas').appendChild(renderer.domElement);

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({ 
      color: '#4A90E2',
      wireframe: true
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      torus.rotation.z += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      const canvas = document.getElementById('bg-canvas');
      if (canvas && canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
      }
    };
  }, []);

  return (
    <Container>
      <BgCanvas id="bg-canvas" />
      <Wrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AlertBox
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Your application to register as a Pharmacy is currently under review. Please wait for verification.
        </AlertBox>
        <HomeLink
          to="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Return to Home
        </HomeLink>
      </Wrapper>
    </Container>
  );
};

export default UnverifiedP;
