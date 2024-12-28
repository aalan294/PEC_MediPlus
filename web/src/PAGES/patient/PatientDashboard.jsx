import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components for layout and design
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
`;

const InfoCard = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const InfoRow = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.span`
  font-weight: bold;
  color: #333;
`;

const Value = styled.span`
  margin-left: 10px;
  color: #555;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null); // State to hold patient data
  const navigate = useNavigate();

  // Fetch patient data from localStorage when the component mounts
  useEffect(() => {
    const storedPatient = JSON.parse(localStorage.getItem('patient'));
    if (storedPatient) {
      setPatientData(storedPatient); // Set patient data
    } else {
      // Redirect to login page if no patient data is found
      navigate('/');
    }
  }, [navigate]);

  // Logout function to clear localStorage and navigate to the login page
  const handleLogout = () => {
    localStorage.removeItem('patient'); // Remove patient data from localStorage
    navigate('/'); // Redirect to login page
  };

  // If patient data is not available yet, show a loading message
  if (!patientData) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <InfoCard>
        <h2>Patient Dashboard</h2>

        <InfoRow>
          <Label>Name:</Label> <Value>{patientData.name}</Value>
        </InfoRow>

        <InfoRow>
          <Label>Email:</Label> <Value>{patientData.email}</Value>
        </InfoRow>

        <InfoRow>
          <Label>Contact Number:</Label> <Value>{patientData.contactNumber}</Value>
        </InfoRow>

        <InfoRow>
          <Label>Age:</Label> <Value>{patientData.age}</Value>
        </InfoRow>

        <InfoRow>
          <Label>Blood Group:</Label> <Value>{patientData.blood}</Value>
        </InfoRow>

        <Button onClick={handleLogout}>Logout</Button>
      </InfoCard>
    </Container>
  );
};

export default PatientDashboard;
