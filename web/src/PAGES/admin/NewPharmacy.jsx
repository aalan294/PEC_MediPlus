import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../API/api';
import styled from 'styled-components';
import Web3 from 'web3';
import { pinata } from '../../config';
import { abi } from '../../abi';
import AdminNav from './AdminNav';
import { contractAddress } from '../../contractAddress';
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

const PharmacyGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  margin-top: 2rem;
`;

const PharmacyCard = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  transition: transform 0.3s ease;
  color: #fff;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Label = styled.span`
  color: #4A90E2;
  font-weight: 600;
  margin-right: 0.5rem;
`;

const Value = styled.span`
  color: #fff;
`;

const VerifyButton = styled(motion.button)`
  width: 100%;
  padding: 0.8rem;
  margin-top: 1rem;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const DocumentLink = styled(motion.a)`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #4A90E2;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const NewPharmacy = () => {
  const [pharmacies, setPharmacies] = useState([]);
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
    const fetchPharmacies = async () => {
      try {
        const response = await api.get('/admin/get-pharm-req');
        setPharmacies(response.data.pharmacies);

        response.data.pharmacies.forEach(async (pharmacy) => {
          if (pharmacy.verification) {
            const url = await getSignedUrl(pharmacy.verification);
            setSignedUrls((prev) => ({
              ...prev,
              [pharmacy._id]: url,
            }));
          }
        });
      } catch (error) {
        console.error('Error fetching pharmacies:', error);
      }
    };

    fetchPharmacies();
  }, []);

  const handleVerify = async (pharmacy) => {
    try {
      await uploadToBlockchain(pharmacy);
      await api.patch(`/admin/verify-pharm/${pharmacy._id}`);
      navigate('/admin/dashboard');
    } catch (error) {
      alert(error.message);
      console.error('Error during verification:', error);
    }
  };

  const uploadToBlockchain = async (pharmacy) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods
        .registerFields(
          pharmacy.wallet,
          pharmacy._id,
          pharmacy.name,
          pharmacy.verification,
          0
        )
        .send({ from: accounts[0] });
      console.log('Pharmacy data uploaded to blockchain successfully');
    } catch (error) {
      throw new Error('Error uploading pharmacy data to blockchain: ' + error.message);
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
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AdminNav />
        <Title
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Pharmacy Verification Requests
        </Title>
        <PharmacyGrid>
          {pharmacies.map((pharmacy) => (
            <PharmacyCard
              key={pharmacy._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div><Label>Owner:</Label><Value>{pharmacy.owner}</Value></div>
              <div><Label>Email:</Label><Value>{pharmacy.email}</Value></div>
              <div><Label>Address:</Label><Value>{pharmacy.address}</Value></div>
              <div><Label>Wallet:</Label><Value>{pharmacy.wallet}</Value></div>
              <div><Label>Name:</Label><Value>{pharmacy.name}</Value></div>
              <div><Label>Phone:</Label><Value>{pharmacy.phone}</Value></div>
              <div><Label>Status:</Label><Value>{pharmacy.isVerified ? 'Verified' : 'Pending'}</Value></div>
              
              <VerifyButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVerify(pharmacy)}
              >
                Verify Pharmacy
              </VerifyButton>
              
              {signedUrls[pharmacy._id] && (
                <DocumentLink
                  href={signedUrls[pharmacy._id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                >
                  View Verification Document
                </DocumentLink>
              )}
            </PharmacyCard>
          ))}
        </PharmacyGrid>
      </ContentWrapper>
    </Container>
  );
};

export default NewPharmacy;
