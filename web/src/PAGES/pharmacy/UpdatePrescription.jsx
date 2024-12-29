import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const UpdatePrescription = () => {
  const [prescription, setPrescription] = useState({
    patientName: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: ''
  });

  const canvasRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <Container>
      <BgCanvas ref={canvasRef} />
      <Form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Update Prescription
        </Title>

        <InputGrid>
          <InputGroup>
            <Label>Patient Name</Label>
            <Input
              type="text"
              value={prescription.patientName}
              onChange={(e) => setPrescription({...prescription, patientName: e.target.value})}
              placeholder="Enter patient name"
            />
          </InputGroup>

          <InputGroup>
            <Label>Medication</Label>
            <Input
              type="text"
              value={prescription.medication}
              onChange={(e) => setPrescription({...prescription, medication: e.target.value})}
              placeholder="Enter medication"
            />
          </InputGroup>

          <InputGroup>
            <Label>Dosage</Label>
            <Input
              type="text"
              value={prescription.dosage}
              onChange={(e) => setPrescription({...prescription, dosage: e.target.value})}
              placeholder="Enter dosage"
            />
          </InputGroup>

          <InputGroup>
            <Label>Frequency</Label>
            <Select
              value={prescription.frequency}
              onChange={(e) => setPrescription({...prescription, frequency: e.target.value})}
            >
              <option value="">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="twice">Twice a day</option>
              <option value="thrice">Thrice a day</option>
            </Select>
          </InputGroup>

          <InputGroup style={{ gridColumn: 'span 2' }}>
            <Label>Duration (in days)</Label>
            <Input
              type="number"
              value={prescription.duration}
              onChange={(e) => setPrescription({...prescription, duration: e.target.value})}
              placeholder="Enter duration"
            />
          </InputGroup>
        </InputGrid>

        <ActionButton onClick={handleSubmit}>
          Update Prescription
        </ActionButton>
      </Form>
    </Container>
  );
};

export default UpdatePrescription;

// Styled Components
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

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
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
  border: 2px solid rgba(74, 144, 226, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #4A90E2;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(74, 144, 226, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #4A90E2;
  }

  option {
    background: #1a1a1a;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 15px;
  background: rgba(74, 144, 226, 0.2);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(74, 144, 226, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;