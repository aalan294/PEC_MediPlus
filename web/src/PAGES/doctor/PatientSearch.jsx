import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import api from '../../API/api';
import styled from 'styled-components';

// Styled components for layout and design
const Container = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 20px;
  border: 1px solid #007bff;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const PatientList = styled.div`
  margin-top: 20px;
`;

const PatientCard = styled.div`
  background-color: #fff;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #007bff;
  cursor: pointer; // Make the card clickable
`;

const Label = styled.span`
  font-weight: bold;
  color: #333;
`;

const Value = styled.span`
  margin-left: 5px;
  color: #555;
`;

// Department Enum Mapping
const deptEnum = {
  0: 'Cardiology',
  1: 'Psychiatry',
  2: 'General'
};

// Main component
const PatientSearch = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate(); // Use useNavigate for navigation

  // Assuming we are storing the logged-in doctor data in localStorage
  const doctorData = JSON.parse(localStorage.getItem('medithon-user'));
  const doctorDept = doctorData?.dept;

  // Fetch patients from the API on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/doctor/all-patients');
        console.log(response)
        const allPatients = response.data.patients;

        // Filter patients based on the doctor's department (use enum comparison)
        const deptPatients = allPatients

        setPatients(deptPatients);
        setFilteredPatients(deptPatients); // Initialize filtered patients
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [doctorDept]);

  // Handle search input changes and filter patients dynamically
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(value) ||
      patient.contactNumber.includes(value)
    );

    setFilteredPatients(filtered);
  };

  // Handle clicking on a patient card
  const handlePatientClick = (id) => {
    navigate(`/doctor/analyse/${id}`); // Redirect to the desired route
  };

  return (
    <Container>
      <h2>Patient Search - {deptEnum[doctorDept]} Department</h2>
      <SearchBar
        type="text"
        placeholder="Search by Name or Contact Number..."
        value={searchTerm}
        onChange={handleSearch}
      />
      
      <PatientList>
        {filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <PatientCard 
              key={patient._id} 
              onClick={() => handlePatientClick(patient._id)} // Navigate on click
            >
              <div>
                <Label>Name:</Label> <Value>{patient.name}</Value>
              </div>
              <div>
                <Label>Contact Number:</Label> <Value>{patient.contactNumber}</Value>
              </div>
              <div>
                <Label>Age:</Label> <Value>{patient.age}</Value>
              </div>
              <div>
                <Label>Blood Group:</Label> <Value>{patient.blood}</Value>
              </div>
            </PatientCard>
          ))
        ) : (
          <p>No patients found.</p>
        )}
      </PatientList>
    </Container>
  );
};

export default PatientSearch;
