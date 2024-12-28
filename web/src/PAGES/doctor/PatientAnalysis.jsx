import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import api from '../../API/api';
import styled from 'styled-components';
import {abi} from '../../abi'
import { contractAddress } from '../../contractAddress';

// Styled components for layout and design
const Container = styled.div`
  padding: 20px;
  background-color: #f0f8ff;
  min-height: 100vh;
  color: #004085;
`;

const Section = styled.div`
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #004085;
  margin-bottom: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
`;

const Label = styled.span`
  font-weight: bold;
  color: #004085;
`;

const Value = styled.span`
  margin-left: 10px;
  color: #333;
`;

const HistorySection = styled(Section)`
  margin-top: 30px;
`;

const HistoryItem = styled.div`
  background-color: #f5faff;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  border-left: 4px solid #007bff;
`;

// Enum department mapping array
const departmentMapping = [
  'Cardiology',
  'Psychiatry',
  'General Medicine',
];

// Smart contract details (Replace with your contract address and ABI)
 // Replace with your contract address// Replace with your contract ABI

const PatientAnalysis = () => {
  const { id } = useParams(); // Get the patient ID from URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState({}); // To store fetched prescriptions

  // Web3 Initialization
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  // Initialize Web3 and Contract on Component Mount
  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
          const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
          setWeb3(web3Instance);
          setContract(contractInstance);
        } catch (error) {
          console.error('Error connecting to wallet:', error);
        }
      } else {
        console.error('No Ethereum wallet detected. Please install MetaMask.');
      }
    };

    initializeWeb3();
  }, []);

  // Fetch patient details using the ID
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

  // Fetch prescription details from the smart contract
  const fetchPrescriptionDetails = async (prescriptionId) => {
    if (!contract || !prescriptionId || prescriptions[prescriptionId]) return;

    try {
      const result = await contract.methods.getPrescription(prescriptionId).call();
      setPrescriptions((prev) => ({
        ...prev,
        [prescriptionId]: result, // Store the fetched prescription details
      }));
    } catch (error) {
      console.error('Error fetching prescription from smart contract:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!patient) {
    return <p>No patient data found.</p>;
  }

  return (
    <Container>
      {/* Patient Details Section */}
      <Section>
        <Title>Patient Details</Title>
        <div>
          <Label>Name:</Label> <Value>{patient.name}</Value>
        </div>
        <div>
          <Label>Age:</Label> <Value>{patient.age}</Value>
        </div>
        <div>
          <Label>Gender:</Label> <Value>{patient.gender}</Value>
        </div>
        <div>
          <Label>Contact Number:</Label> <Value>{patient.contactNumber}</Value>
        </div>
        <div>
          <Label>Email:</Label> <Value>{patient.email}</Value>
        </div>
        <div>
          <Label>Blood Group:</Label> <Value>{patient.blood}</Value>
        </div>
        <div>
          <Label>Emergency Contact:</Label> <Value>{patient.emergency}</Value>
        </div>
        <div>
          <Label>Date of Birth:</Label> <Value>{patient.DOB}</Value>
        </div>
        <div>
          <Label>Address:</Label> <Value>{patient.address}</Value>
        </div>
      </Section>

      {/* Medical History Section */}
      <HistorySection>
        <Title>Medical History</Title>
        {patient.history && patient.history.length > 0 ? (
          patient.history.map((record, index) => (
            <HistoryItem key={index}>
              <div>
                <Label>Prescription ID:</Label> <Value>{record.prescriptionId}</Value>
              </div>
              <div>
                <Label>Date:</Label> <Value>{record.date}</Value>
              </div>
              <div>
                <Label>Doctor:</Label> <Value>{record.doctor}</Value>
              </div>
              <div>
                <Label>Department:</Label> 
                <Value>{departmentMapping[record.dept] || 'Unknown Department'}</Value>
              </div>

              {/* Fetch and Display Prescription Details */}
              <button onClick={() => fetchPrescriptionDetails(record.prescriptionId)}>
                Show Prescription Details
              </button>

              {prescriptions[record.prescriptionId] && (
                <div>
                  <h4>Prescription Details:</h4>
                  <div>
                    <Label>Medicines:</Label>{' '}
                    <Value>{prescriptions[record.prescriptionId].medicines.join(', ')}</Value>
                  </div>
                  <div>
                    <Label>Timestamp:</Label>{' '}
                    <Value>{prescriptions[record.prescriptionId].timestamp}</Value>
                  </div>
                  <div>
                    <Label>Description:</Label>{' '}
                    <Value>{prescriptions[record.prescriptionId].description}</Value>
                  </div>
                  <div>
                    <Label>Allergies:</Label>{' '}
                    <Value>{prescriptions[record.prescriptionId].allergies}</Value>
                  </div>
                </div>    
              )}
            </HistoryItem>
          ))
        ) : (
          <p>No medical history available.</p>
        )}
      </HistorySection>
    </Container>
  );
};

export default PatientAnalysis;
