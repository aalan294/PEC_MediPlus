import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../API/api';
import styled from 'styled-components';
import Web3 from 'web3';
import { pinata } from '../../config';
import { abi } from '../../abi';
import AdminNav from './AdminNav';
import {contractAddress} from '../../contractAddress';
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

const HospitalGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  width: 100%;
  margin-top: 2rem;
`;

const HospitalCard = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  transition: transform 0.3s ease;
  color: #ffffff;

  &:hover {
    transform: translateY(-5px);
  }
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: #4A90E2;
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  margin-bottom: 1rem;
  word-break: break-all;
`;

const VerifyButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;

  &:hover {
    background: linear-gradient(45deg, #63B3ED, #4A90E2);
  }
`;

const DocumentLink = styled(motion.a)`
  display: block;
  text-align: center;
  color: #4A90E2;
  text-decoration: none;
  margin-top: 1rem;
  padding: 8px;
  border: 1px solid #4A90E2;
  border-radius: 6px;

  &:hover {
    background: rgba(74, 144, 226, 0.1);
  }
`;

const NewHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [signedUrls, setSignedUrls] = useState({});
  const navigate = useNavigate();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractAddress);
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

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

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await api.get('/admin/get-hos-req');
        setHospitals(response.data.hospitals);

        response.data.hospitals.forEach(async (hospital) => {
          if (hospital.verification) {
            const url = await getSignedUrl(hospital.verification);
            setSignedUrls((prev) => ({
              ...prev,
              [hospital._id]: url,
            }));
          }
        });
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };

    fetchHospitals();
  }, []);

  const handleVerify = async (hospital) => {
    try {
      await uploadToBlockchain(hospital);
      await api.patch(`/admin/verify-hospital/${hospital._id}`);
      navigate('/admin/dashboard');
    } catch (error) {
      alert(error.message);
      console.error('Error during verification:', error);
    }
  };

  const uploadToBlockchain = async (hospital) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods
        .registerFields(
          hospital.wallet,
          hospital._id,
          hospital.name,
          hospital.verification,
          2
        )
        .send({ from: accounts[0] });
      console.log('Hospital data uploaded to blockchain successfully');
    } catch (error) {
      throw new Error('Error uploading hospital data to blockchain: ' + error.message);
    }
  };

  const getSignedUrl = async (cid) => {
    try {
      const signedUrl = await pinata.gateways.createSignedURL({
        cid: cid,
        expires: 60,
      });
      return signedUrl;
    } catch (err) {
      console.error('Error fetching signed URL:', err);
      return '';
    }
  };

  return (
    <Container>
      <BgCanvas ref={containerRef} />
      <AdminNav />
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Hospital Verification Requests
        </Title>
        <HospitalGrid>
          {hospitals.map((hospital) => (
            <HospitalCard
              key={hospital._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <InfoLabel>Owner</InfoLabel>
              <InfoValue>{hospital.owner}</InfoValue>
              
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{hospital.email}</InfoValue>
              
              <InfoLabel>Address</InfoLabel>
              <InfoValue>{hospital.address}</InfoValue>
              
              <InfoLabel>Wallet</InfoLabel>
              <InfoValue>{hospital.wallet}</InfoValue>
              
              <InfoLabel>Name</InfoLabel>
              <InfoValue>{hospital.name}</InfoValue>
              
              <InfoLabel>Phone</InfoLabel>
              <InfoValue>{hospital.phone}</InfoValue>
              
              <InfoLabel>Status</InfoLabel>
              <InfoValue>{hospital.isVerified ? 'Verified' : 'Pending Verification'}</InfoValue>

              <VerifyButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVerify(hospital)}
              >
                Verify Hospital
              </VerifyButton>

              {signedUrls[hospital._id] && (
                <DocumentLink
                  href={signedUrls[hospital._id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                >
                  View Verification Document
                </DocumentLink>
              )}
            </HospitalCard>
          ))}
        </HospitalGrid>
      </ContentWrapper>
    </Container>
  );
};

export default NewHospital;
