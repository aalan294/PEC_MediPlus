import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../../API/api';
import { useNavigate } from 'react-router-dom';

// Styled Components for blue and white theme
const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
`;

const FormWrapper = styled.form`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
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

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 16px;
  color: #333;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const HospitalLogin = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Make API call for login
      const response = await api.post('/hospital/login', loginData);

      if (response.data.status) {
        // Store the user data in local storage
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Navigate based on verification status
        if (response.data.user.isVerified) {
          navigate('/hospital/dashboard');
        } else {
          navigate('/hospital/unverified');
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error occurred during login');
      console.error('Error:', error);
    }
  };

  return (
    <FormContainer>
      <FormWrapper onSubmit={handleSubmit}>
        <Title>Hospital Login</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Input
          type="email"
          name="email"
          value={loginData.email}
          onChange={handleInputChange}
          placeholder="Enter email"
          required
        />
        <Input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleInputChange}
          placeholder="Enter password"
          required
        />
        <Button type="submit">Login</Button>
      </FormWrapper>
    </FormContainer>
  );
};

export default HospitalLogin;
