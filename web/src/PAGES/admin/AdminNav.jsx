import React, { useEffect, useState } from 'react'
import api from '../../API/api';
import styled from 'styled-components';

const AdminNav = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [hospital, setHospital] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
   
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

   // Fetch all doctors, pharmacies, and receptionists
   useEffect
   (() => {
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
   <>
   {/* Hamburger Menu */}
   <HamburgerMenu onClick={toggleDropdown}>☰</HamburgerMenu>
      {showDropdown && (
        <DropdownMenu>
          <DropdownItem href="/admin/new-hos">Hospital request</DropdownItem>
          <DropdownItem href="/admin/new-pharm">Pharamcy Request</DropdownItem>
          <DropdownItem href="/admin/dashboard">DashBoard</DropdownItem>
          <DropdownItem href='/'>logout</DropdownItem>
        
        </DropdownMenu>
      )}

       {/* Count Section */}
       <CountSection>
        <CountBox>Hospitals: {hospital.length}</CountBox>
        <CountBox>Pharmacies: {pharmacies.length}</CountBox>
      </CountSection>
   </>
  )
}

const CountSection = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background-color: #007bff;
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
  font-size: 25px;
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
  font-size:1.2rem;
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

export default AdminNav