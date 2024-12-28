import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../API/api'; // Assuming axios is set up for API calls

// Styled Components
const SearchContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const PatientList = styled.div`
  margin-top: 20px;
`;

const PatientCard = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  padding: 8px 12px;
  margin-left: 10px;
  background-color: ${(props) => (props.primary ? '#007bff' : '#28a745')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.primary ? '#0056b3' : '#218838')};
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const ReceptionSearch = () => {
  const history = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [error, setError] = useState('');

  // Fetch all patients from the backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/reception/get-all');
        if (response.data.status) {
          setPatients(response.data.patients);
        } else {
          setError('Failed to fetch patients');
        }
      } catch (error) {
        setError('Error occurred while fetching patient data');
      }
    };

    fetchPatients();
  }, []);

  // Handle search filtering
  useEffect(() => {
    const filtered = patients.filter((patient) =>
      patient.contactNumber && patient.contactNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleAddPrescription = (patientId) => {
    // Redirect to add prescription page for the patient
    history(`/reception/old-case/${patientId}`);
  };

  const handleCreateUser = () => {
    // Redirect to the new case creation page
    history('/reception/new-case');
  };

  return (
    <SearchContainer>
      <InputGroup>
        <Label>Search by Mobile Number</Label>
        <Input
          type="text"
          placeholder="Enter mobile number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <PatientList>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <PatientCard key={patient._id}>
              <div>
                <strong>{patient.name}</strong>
                <p>Mobile: {patient.contactNumber}</p>
              </div>
              <div>
                <Button primary onClick={() => handleAddPrescription(patient._id)}>
                  Add Prescription
                </Button>
              </div>
            </PatientCard>
          ))
        ) : (
          <div>
            {searchTerm ? (
              <div>
                <p>No patient found with mobile number: {searchTerm}</p>
                <Button onClick={handleCreateUser}>Create New User</Button>
              </div>
            ) : (
              <p>Start typing to search for patients by mobile number</p>
            )}
          </div>
        )}
      </PatientList>
    </SearchContainer>
  );
};

export default ReceptionSearch;
