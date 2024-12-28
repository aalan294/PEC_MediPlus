import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9f9f9; /* Light background */
  padding: 20px;
  position: relative; /* To position the hamburger menu */
`;

const Title = styled.h2`
  color: #007bff; /* Blue color for the title */
  margin-bottom: 20px;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns */
  gap: 20px; /* Space between boxes */
  width: 80%; /* Responsive width */
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Label = styled.span`
  font-weight: bold;
  color: #333; /* Darker color for the label */
`;

const Value = styled.span`
  display: block; /* Block display for value to take full width */
  margin-top: 5px;
  color: #555; /* Slightly lighter color for the value */
`;

const HamburgerMenu = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  font-size: 24px; /* Increase size for better visibility */
`;

const Dropdown = styled.div`
  position: absolute;
  right: 20px;
  top: 50px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: ${props => (props.isOpen ? 'block' : 'none')}; /* Show or hide */
  z-index: 1; /* Ensure dropdown is above other elements */
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 10px 20px;
  color: #007bff;
  text-decoration: none;

  &:hover {
    background-color: #f1f1f1; /* Light gray on hover */
  }
`;

const DoctorDashboard = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  
  // Fetch user details from local storage
  const userData = JSON.parse(localStorage.getItem('medithon-user'));

  if (!userData) {
    return <div>No user data found. Please log in.</div>;
  }

  return (
    <Container>
      <HamburgerMenu onClick={toggleDropdown}>
        &#9776; {/* Hamburger icon */}
      </HamburgerMenu>
      <Dropdown isOpen={isDropdownOpen}>
        <DropdownItem to="/doctor/search">Search Patient</DropdownItem>
      </Dropdown>
      <Title>Doctor Dashboard</Title>
      <DashboardGrid>
        <Card>
          <Label>Name:</Label>
          <Value>{userData.name}</Value>
        </Card>
        <Card>
          <Label>Email:</Label>
          <Value>{userData.email}</Value>
        </Card>
        <Card>
          <Label>Phone:</Label>
          <Value>{userData.phone}</Value>
        </Card>
        <Card>
          <Label>Department:</Label>
          <Value>{userData.dept}</Value>
        </Card>
        <Card>
          <Label>Hospital:</Label>
          <Value>{userData.hospital}</Value>
        </Card>
        <Card>
          <Label>Address:</Label>
          <Value>{userData.address}</Value>
        </Card>
        <Card>
          <Label>Wallet:</Label>
          <Value>{userData.wallet}</Value>
        </Card>
      </DashboardGrid>
    </Container>
  );
};

export default DoctorDashboard;
