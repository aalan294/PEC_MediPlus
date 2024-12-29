import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { pinata } from '../../config';
import api from '../../API/api';
import Web3 from 'web3';
import { abi } from '../../abi';
import { useNavigate, useParams } from 'react-router-dom';
import { contractAddress } from '../../contractAddress';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Initialize Web3
const web3 = new Web3(window.ethereum);
const prescriptionContract = new web3.eth.Contract(abi, contractAddress);

const DEPARTMENTS = {
  CARDIOLOGY: 0,
  DERMATOLOGY: 1,
  NEUROLOGY: 2,
};

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

const FormWrapper = styled(motion.form)`
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
  color: #4A90E2;
  font-size: 0.9rem;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4A90E2;
  }
`;

const Select = styled(motion.select)`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  
  option {
    background: #1a1a1a;
    color: #fff;
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  color: white;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.4);
  }
`;

const Message = styled(motion.p)`
  text-align: center;
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
`;

const ErrorMessage = styled(Message)`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
`;

const SuccessMessage = styled(Message)`
  color: #51cf66;
  background: rgba(81, 207, 102, 0.1);
`;

const NewPrescription = () => {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [prescriptionData, setPrescriptionData] = useState({
    description: '',
    dept: '',
    medicines: '',
    allergies: '',
  });
  const [document, setDocument] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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

  // Rest of the functions remain same
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionData({ ...prescriptionData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDocument(file);
      setError('');
    } else {
      setDocument(null);
      setError('No file selected.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    if (!document) {
      setError('Please upload a valid document.');
      return;
    }
  
    try {
      const response = await pinata.upload.file(document);
      const documentCID = response.cid;
  
      const prescriptionIdBigInt = await createPrescriptionOnBlockchain(
        id,
        prescriptionData.description,
        0,
        prescriptionData.medicines.split(','),
        [documentCID],
        prescriptionData.allergies.split(',')
      );
      
      const prescriptionId = Number(prescriptionIdBigInt);
      console.log(prescriptionId);
  
      const prescriptionDataMongo = {
        prescriptionId,
        date: new Date().toISOString(),
        doctor: 'Your Doctor Name',
        dept: prescriptionData.dept,
      };
  
      const mongoResponse = await api.patch(`reception/old-case/${id}`, prescriptionDataMongo);
  
      if (mongoResponse.data.status) {
        setSuccess('Prescription created successfully!');
        navigate('/reception/dashboard')
      } else {
        setError(mongoResponse.data.message);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setError('An error occurred while creating the prescription.');
    }
  };

  const createPrescriptionOnBlockchain = async (userId, description, dept, medicines, documents, allergies) => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      const userAccount = accounts[0];

      const result = await prescriptionContract.methods.createPrescription(
        userId,
        description,
        dept,
        "sample",
        medicines,
        documents,
        allergies
      ).send({ from: userAccount });
      
      return result.events.PrescriptionCreated.returnValues.prescriptionId;
    } catch (error) {
      console.error('Error creating prescription on blockchain:', error);
      throw new Error('Blockchain transaction failed');
    }
  };

  return (
    <Container>
      <BgCanvas ref={canvasRef} />
      <FormWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
      >
        <Title
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Create New Prescription
        </Title>

        {error && <ErrorMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >{error}</ErrorMessage>}
        {success && <SuccessMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >{success}</SuccessMessage>}

        <InputGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label>Description</Label>
          <Input
            type="text"
            name="description"
            value={prescriptionData.description}
            onChange={handleInputChange}
            placeholder="Enter prescription description"
            required
            whileFocus={{ scale: 1.02 }}
          />
        </InputGroup>

        <InputGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label>Department</Label>
          <Select
            name="dept"
            value={prescriptionData.dept}
            onChange={handleInputChange}
            required
            whileFocus={{ scale: 1.02 }}
          >
            <option value="" disabled>Select department</option>
            {Object.entries(DEPARTMENTS).map(([key, value]) => (
              <option key={value} value={value}>{key}</option>
            ))}
          </Select>
        </InputGroup>

        <InputGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Label>Medicines (comma-separated)</Label>
          <Input
            type="text"
            name="medicines"
            value={prescriptionData.medicines}
            onChange={handleInputChange}
            placeholder="Enter medicines"
            required
            whileFocus={{ scale: 1.02 }}
          />
        </InputGroup>

        <InputGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Label>Allergies (comma-separated)</Label>
          <Input
            type="text"
            name="allergies"
            value={prescriptionData.allergies}
            onChange={handleInputChange}
            placeholder="Enter allergies"
            required
            whileFocus={{ scale: 1.02 }}
          />
        </InputGroup>

        <InputGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Label>Upload Document</Label>
          <Input
            type="file"
            onChange={handleFileChange}
            required
            whileFocus={{ scale: 1.02 }}
          />
        </InputGroup>

        <Button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Create Prescription
        </Button>
      </FormWrapper>
    </Container>
  );
};

export default NewPrescription;
