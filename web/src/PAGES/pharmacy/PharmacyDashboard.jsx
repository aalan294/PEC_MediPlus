import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled Components for blue and white theme
const DashboardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
`;

const DashboardWrapper = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  color: #007bff;
  text-align: center;
  margin-bottom: 20px;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.span`
  font-weight: bold;
  color: #333;
`;

const Value = styled.span`
  font-size: 16px;
  color: #555;
`;

const PharmacyDashboard = () => {
  const [pharmacyData, setPharmacyData] = useState(null);

  useEffect(() => {
    // Get the user data from local storage
    const userData = localStorage.getItem('user');
    if (userData) {
      setPharmacyData(JSON.parse(userData));
    }
  }, []);

  if (!pharmacyData) {
    return (
      <DashboardContainer>
        <DashboardWrapper>
          <Title>Pharmacy Dashboard</Title>
          <p>Loading pharmacy information...</p>
        </DashboardWrapper>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardWrapper>
        <Title>Pharmacy Dashboard</Title>
        <InfoGroup>
          <Label>Pharmacy Name:</Label>
          <Value>{pharmacyData.name}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>Owner Name:</Label>
          <Value>{pharmacyData.owner}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>Email:</Label>
          <Value>{pharmacyData.email}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>Phone:</Label>
          <Value>{pharmacyData.phone}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>Address:</Label>
          <Value>{pharmacyData.address}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>Wallet Address:</Label>
          <Value>{pharmacyData.wallet}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>Verification Status:</Label>
          <Value>{pharmacyData.isVerified ? 'Verified' : 'Not Verified'}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>Verification Document CID:</Label>
          <Value>{pharmacyData.verification}</Value>
        </InfoGroup>
      </DashboardWrapper>
    </DashboardContainer>
  );
};

export default PharmacyDashboard;
