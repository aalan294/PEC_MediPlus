import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../API/api';
import { useNavigate } from 'react-router-dom';
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

const Form = styled(motion.form)`
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
  margin-bottom: 25px;
`;

const Label = styled.span`
  display: block;
  color: #4A90E2;
  font-size: 0.9rem;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(74, 144, 226, 0.3);
  border-radius: 8px;
  background: rgba(26, 26, 26, 0.7);
  font-size: 16px;
  color: #fff;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4A90E2;
    outline: none;
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
`;

const ErrorMessage = styled(motion.p)`
  color: #ff4444;
  text-align: center;
  margin: 10px 0;
  font-size: 16px;
`;

const PharmacyLogin = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const canvas = canvasRef.current;

    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas.appendChild(renderer.domElement);

    // Create multiple geometric shapes
    const shapes = [];
    const colors = [0x4A90E2, 0x63B3ED, 0x2D9CDB];
    
    // Add icosahedrons
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.IcosahedronGeometry(Math.random() * 1 + 0.5, 0);
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      shapes.push(mesh);
      scene.add(mesh);
    }

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      shapes.forEach(shape => {
        shape.rotation.x += 0.002;
        shape.rotation.y += 0.002;
      });
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
      canvas.removeChild(renderer.domElement);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/pharm/login', loginData);

      if (response.data.status) {
        localStorage.setItem('user', JSON.stringify(response.data.user));

        if (response.data.user.isVerified) {
          navigate('/pharm/dashboard');
        } else {
          navigate('/pharm/unverified');
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error occurred during login');
      console.error('Error:', error);
    }
  };

  return (
    <Container>
      <BgCanvas ref={canvasRef} />
      <Form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Pharmacy Login
        </Title>

        {error && (
          <ErrorMessage
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </ErrorMessage>
        )}

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </InputGroup>

        <InputGroup
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
          />
        </InputGroup>

        <Button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default PharmacyLogin;
