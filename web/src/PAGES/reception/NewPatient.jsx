import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../API/api'; // Assuming axios is set up for API calls

// Styled Components
const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: green;
  text-align: center;
`;

const NewPatient = () => {
  const history = useNavigate();
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    contactNumber: '',
    address: '',
    email: '',
    blood: '',
    emergency: '',
    DOB: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setPatientData({
      ...patientData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/reception/new-case', patientData); // Adjust your API path
      if (response.data.status) {
        setSuccess('Patient registered successfully!');
        setError('');
        // Redirect to patient dashboard or other page after successful registration
        history('/reception/dashboard');
      } else {
        setSuccess('');
        setError(response.data.message || 'Error registering patient');
      }
    } catch (error) {
      setSuccess('');
      setError('An error occurred while registering the patient.');
    }
  };

  return (
    <FormContainer>
      <h2>Register New Patient</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Name</Label>
          <Input type="text" name="name" value={patientData.name} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label>Age</Label>
          <Input type="number" name="age" value={patientData.age} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label>Gender</Label>
          <Input type="text" name="gender" value={patientData.gender} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label>Contact Number</Label>
          <Input type="text" name="contactNumber" value={patientData.contactNumber} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label>Address</Label>
          <Input type="text" name="address" value={patientData.address} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input type="email" name="email" value={patientData.email} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label>Blood Group</Label>
          <Input type="text" name="blood" value={patientData.blood} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label>Emergency Contact</Label>
          <Input type="text" name="emergency" value={patientData.emergency} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label>Date of Birth (DOB)</Label>
          <Input type="date" name="DOB" value={patientData.DOB} onChange={handleChange} required />
        </FormGroup>
        <Button type="submit">Register Patient</Button>
      </form>
    </FormContainer>
  );
};

export default NewPatient;
