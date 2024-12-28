import React, { useEffect, useState } from 'react';
import api from '../../API/api';
import styled from 'styled-components';

// Styled Components with Blue and White Theme
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f4f8;
  padding: 20px;
  position: relative;
`;

const SectionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  flex-grow: 1;
`;

const Section = styled.div`
  width: 30%;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #007bff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h2`
  text-align: center;
  color: #007bff;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

const ListItem = styled.li`
  margin: 10px 0;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #007bff;
  border-radius: 5px;
`;

const CountSection = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background-color: #007bff;
  border-radius: 10px;
  color: white;
`;

const CountBox = styled.div`
  padding: 15px;
  background-color: #0056b3;
  border-radius: 8px;
  font-size: 18px;
  color: #fff;
  width: 150px;
  text-align: center;
`;

const HamburgerMenu = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #007bff;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  color: white;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.a`
  display: block;
  padding: 10px;
  text-decoration: none;
  color: #007bff;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const HospitalDashBoard = () => {
  const [doctors, setDoctors] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch all doctors, pharmacies, and receptionists
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const receptionistRes = await api.get('/hospital/get-recep');
        const doctorRes = await api.get('/hospital/get-doc');
        console.log(receptionistRes.data.receptions,doctorRes.data.doctors)
   

        setDoctors(doctorRes.data.doctors);
        setReceptionists(receptionistRes.data.receptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <Container>
      {/* Hamburger Menu */}
      <HamburgerMenu onClick={toggleDropdown}>☰</HamburgerMenu>
      {showDropdown && (
        <DropdownMenu>
          <DropdownItem href="/hospital/new-doc">Register Doctor</DropdownItem>
          <DropdownItem href="/hospital/new-recep">Register Receptionist</DropdownItem>
        </DropdownMenu>
      )}

      {/* Count Section */}
      <CountSection>
        <CountBox>Doctors: {doctors.length}</CountBox>
        <CountBox>Receptionists: {receptionists.length}</CountBox>
      </CountSection>

      {/* Section Container */}
      <SectionContainer>
        {/* Left Section: Doctors */}
        <Section>
          <Header>Doctors</Header>
          <List>
            {doctors.map((doctor) => (
              <ListItem key={doctor.id}>
                <strong>Name:</strong> {doctor.name}<br />
                <strong>Email:</strong> {doctor.email}<br />
                <strong>Wallet:</strong> {doctor.wallet}
              </ListItem>
            ))}
          </List>
        </Section>

        {/* Right Section: Receptionists */}
        <Section>
          <Header>Receptionists</Header>
          <List>
            {receptionists.map((receptionist) => (
              <ListItem key={receptionist.id}>
                <strong>Name:</strong> {receptionist.name}<br />
                <strong>Email:</strong> {receptionist.email}<br />
                <strong>Wallet:</strong> {receptionist.wallet}
              </ListItem>
            ))}
          </List>
        </Section>
      </SectionContainer>
    </Container>
  );
};

export default HospitalDashBoard;
