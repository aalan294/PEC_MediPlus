import React, { useEffect, useState } from 'react';
import api from '../../API/api';
import styled from 'styled-components';
import AdminNav from './AdminNav';

// Styled Components with Blue and White Theme
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f4f8;
  position: relative;
`;

const SectionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 20px;
  flex-grow: 0.8;
  padding: 10px;
  overflow: scroll;
`;

const Section = styled.div`
  width: 30%;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #007bff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: 0.5s;
 
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
  cursor: pointer;
  transition: 0.5s;
  &:hover{
    transform: scale(1.05);
  }
`;



const AdminDashBoard = () => {
  const [hospital, setHospital] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
 

  // Fetch all doctors, pharmacies, and receptionists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hospitalRes = await api.get('/admin/get-hospital');
        const pharmacyRes = await api.get('/admin/get-pharm');

        setHospital(hospitalRes.data.hospitals);
        setPharmacies(pharmacyRes.data.pharmacies);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
 

  return (
    <Container>
      

     <AdminNav/>

      {/* Section Container */}
      <SectionContainer>
        {/* Left Section: Doctors */}
        <Section>
          <Header>Hospitals</Header>
          <List>
            {hospital.map((doctor) => (
              <ListItem key={doctor.id}>
                <strong>Name:</strong> {doctor.name}<br />
                <strong>Email:</strong> {doctor.email}<br />
                <strong>Wallet:</strong> {doctor.wallet}
              </ListItem>
            ))}
          </List>
        </Section>

        {/* Center Section: Pharmacies */}
        <Section>
          <Header>Pharmacies</Header>
          <List>
            {pharmacies.map((pharmacy) => (
              <ListItem key={pharmacy.id}>
                <strong>Name:</strong> {pharmacy.name}<br />
                <strong>Email:</strong> {pharmacy.email}<br />
                <strong>Wallet:</strong> {pharmacy.wallet}
              </ListItem>
            ))}
          </List>
        </Section>
      </SectionContainer>
    </Container>
  );
};

export default AdminDashBoard;
