import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import api from '../../API/api';
import styled from 'styled-components';
import {abi} from '../../abi'
import { contractAddress } from '../../contractAddress';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const Container = styled.div`
  min-height: 100vh;
  background-color: #121212;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  color: #fff;
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

const Section = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 144, 226, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled(motion.h2)`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  border-bottom: 2px solid rgba(74, 144, 226, 0.3);
  padding-bottom: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  padding: 1rem;
  background: rgba(74, 144, 226, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(74, 144, 226, 0.2);
`;

const Label = styled.span`
  color: #4A90E2;
  font-weight: 500;
  display: block;
  margin-bottom: 0.3rem;
`;

const Value = styled.span`
  color: #fff;
`;

const HistoryItem = styled(motion.div)`
  background: rgba(74, 144, 226, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(74, 144, 226, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 144, 226, 0.2);
  }
`;

const PrescriptionButton = styled(motion.button)`
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
  }
`;

const departmentMapping = [
  'Cardiology',
  'Psychiatry',
  'General Medicine',
];

const PatientAnalysis = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState({});
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
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

  // Web3 initialization and other useEffects remain the same...
  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
          setWeb3(web3Instance);
          setContract(contractInstance);
        } catch (error) {
          console.error('Error connecting to wallet:', error);
        }
      }
    };

    initializeWeb3();
  }, []);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await api.get(`/doctor/get/${id}`);
        setPatient(response.data.patient);
      } catch (error) {
        console.error('Error fetching patient details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [id]);

  const fetchPrescriptionDetails = async (prescriptionId) => {
    if (!contract || !prescriptionId || prescriptions[prescriptionId]) return;

    try {
      const result = await contract.methods.getPrescription(prescriptionId).call();
      setPrescriptions((prev) => ({
        ...prev,
        [prescriptionId]: result,
      }));
    } catch (error) {
      console.error('Error fetching prescription:', error);
    }
  };

  if (loading) return <Container><Title>Loading...</Title></Container>;
  if (!patient) return <Container><Title>No patient data found.</Title></Container>;

  return (
    <Container>
      <BgCanvas ref={containerRef} />
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Section>
          <Title>Patient Details</Title>
          <InfoGrid>
            <InfoItem>
              <Label>Name</Label>
              <Value>{patient.name}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Age</Label>
              <Value>{patient.age}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Gender</Label>
              <Value>{patient.gender}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Blood Group</Label>
              <Value>{patient.blood}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Contact</Label>
              <Value>{patient.contactNumber}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Email</Label>
              <Value>{patient.email}</Value>
            </InfoItem>
          </InfoGrid>
        </Section>

        <Section>
          <Title>Medical History</Title>
          {patient.history && patient.history.length > 0 ? (
            patient.history.map((record, index) => (
              <HistoryItem 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <InfoGrid>
                  <InfoItem>
                    <Label>Prescription ID</Label>
                    <Value>{record.prescriptionId}</Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>Date</Label>
                    <Value>{record.date}</Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>Doctor</Label>
                    <Value>{record.doctor}</Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>Department</Label>
                    <Value>{departmentMapping[record.dept] || 'Unknown'}</Value>
                  </InfoItem>
                </InfoGrid>

                <PrescriptionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchPrescriptionDetails(record.prescriptionId)}
                >
                  View Prescription Details
                </PrescriptionButton>

                {prescriptions[record.prescriptionId] && (
                  <InfoGrid style={{ marginTop: '1rem' }}>
                    <InfoItem>
                      <Label>Medicines</Label>
                      <Value>{prescriptions[record.prescriptionId].medicines.join(', ')}</Value>
                    </InfoItem>
                    <InfoItem>
                      <Label>Description</Label>
                      <Value>{prescriptions[record.prescriptionId].description}</Value>
                    </InfoItem>
                    <InfoItem>
                      <Label>Allergies</Label>
                      <Value>{prescriptions[record.prescriptionId].allergies}</Value>
                    </InfoItem>
                  </InfoGrid>
                )}
              </HistoryItem>
            ))
          ) : (
            <Value>No medical history available.</Value>
          )}
        </Section>
      </ContentWrapper>
    </Container>
  );
};

export default PatientAnalysis;
