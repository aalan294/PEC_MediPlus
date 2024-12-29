import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { abi } from '../../abi';
import { pinata } from '../../config';
import { contractAddress } from '../../contractAddress';

const ScannerLogin = () => {
  const { id } = useParams();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFulfilled, setIsFulfilled] = useState(false);
  const [url, setUrl] = useState('');
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

    // Initialize Web3
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);

          setWeb3(web3Instance);
          setContract(contractInstance);
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.error('No Ethereum wallet detected.');
      }
    };

    initWeb3();

    return () => {
      renderer.dispose();
    };
  }, []);

  // Fetch prescription details
  useEffect(() => {
    const fetchPrescription = async () => {
      if (contract && id) {
        try {
          const prescriptionData = await contract.methods.getPrescription(id).call();
          setPrescription({
            prescriptionId: prescriptionData[0].toString(),
            userId: prescriptionData[1],
            timestamp: new Date(parseInt(prescriptionData[2]) * 1000),
            description: prescriptionData[3],
            dept: prescriptionData[4].toString(),
            medicines: prescriptionData[5],
            documents: prescriptionData[6],
            allergies: prescriptionData[7],
            isFulfilled: prescriptionData[8],
          });
          setIsFulfilled(prescriptionData[8]);

          const signedUrl = await pinata.gateways.createSignedURL({
            cid: 'bafybeifocbigpbnlup47txhxvbe5fny6epj43oru6g4etg2z635rr3xewy',
            expires: 60000,
          });
          setUrl(signedUrl);
        } catch (error) {
          console.error('Error fetching prescription:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPrescription();
  }, [contract, id]);

  const fulfillPrescription = async () => {
    if (contract && account && id) {
      try {
        await contract.methods.fulfillPrescription(id).send({ from: account });
        alert('Prescription fulfilled successfully.');
        setIsFulfilled(true);
      } catch (error) {
        console.error('Error fulfilling prescription:', error);
        alert('Error fulfilling prescription. Make sure you have the correct role and are connected to the network.');
      }
    }
  };

  if (loading) {
    return <LoadingMessage>Loading prescription details...</LoadingMessage>;
  }

  if (!prescription) {
    return <ErrorMessage>Prescription not found.</ErrorMessage>;
  }

  return (
    <Container>
      <BgCanvas ref={canvasRef} />
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
          Prescription Details
        </Title>

        <InfoGrid>
          <InfoRow>
            <Label>Prescription ID:</Label>
            <Value>{prescription.prescriptionId}</Value>
          </InfoRow>
          <InfoRow>
            <Label>User ID:</Label>
            <Value>{prescription.userId}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Timestamp:</Label>
            <Value>{prescription.timestamp.toString()}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Department:</Label>
            <Value>{prescription.dept}</Value>
          </InfoRow>
        </InfoGrid>

        <DetailSection>
          <Label>Description:</Label>
          <DetailText>{prescription.description}</DetailText>
        </DetailSection>

        <DetailSection>
          <Label>Medicines:</Label>
          <DetailText>{prescription.medicines.join(', ')}</DetailText>
        </DetailSection>

        <DetailSection>
          <Label>Allergies:</Label>
          <DetailText>{prescription.allergies.length > 0 ? prescription.allergies.join(', ') : 'None'}</DetailText>
        </DetailSection>

        <DetailSection>
          <Label>Documents:</Label>
          <DocumentGrid>
            {prescription.documents.map((doc, index) => (
              <DocumentItem key={index}>
                <DocumentLink href={url} target="_blank" rel="noopener noreferrer">
                  Document {index + 1}
                </DocumentLink>
              </DocumentItem>
            ))}
          </DocumentGrid>
        </DetailSection>

        <StatusSection>
          <Label>Status:</Label>
          <StatusText fulfilled={isFulfilled}>
            {isFulfilled ? 'Fulfilled' : 'Not Fulfilled'}
          </StatusText>
        </StatusSection>

        {!isFulfilled && (
          <ActionButton onClick={fulfillPrescription}>
            Update Prescription as Fulfilled
          </ActionButton>
        )}
      </InfoCard>
    </Container>
  );
};

export default ScannerLogin;

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
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Value = styled.span`
  color: #fff;
  font-size: 1.1rem;
`;

const DetailSection = styled.div`
  margin-bottom: 25px;
`;

const DetailText = styled.p`
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 10px;
`;

const DocumentItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(74, 144, 226, 0.2);
`;

const DocumentLink = styled.a`
  color: #4A90E2;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const StatusSection = styled.div`
  margin: 30px 0;
`;

const StatusText = styled.span`
  color: ${props => props.fulfilled ? '#4CAF50' : '#f44336'};
  font-size: 1.2rem;
  font-weight: 500;
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #4A90E2;
`;

const ErrorMessage = styled(LoadingMessage)`
  color: #f44336;
`;
