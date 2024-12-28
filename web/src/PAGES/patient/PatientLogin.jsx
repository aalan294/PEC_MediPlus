import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from '../../API/api';

// Styled components for layout and design
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
`;

const Form = styled.form`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.div`
  margin-top: 10px;
  color: ${props => (props.success ? 'green' : 'red')};
`;

// PatientLogin Component
const PatientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/patient/login', { email, password });

      if (response.data.status) {
        setSuccess(true);
        setMessage(response.data.message);

        // Save the user data in localStorage
        localStorage.setItem('patient', JSON.stringify(response.data.user));

        // Redirect to the dashboard or another page
        setTimeout(() => {
          navigate('/patient/dashboard'); // Change the route as per your needs
        }, 1000);
      } else {
        setSuccess(false);
        setMessage(response.data.message);
      }
    } catch (error) {
      setSuccess(false);
      setMessage('Error logging in. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>Patient Login</h2>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit">Login</Button>

        {message && <Message success={success}>{message}</Message>}
      </Form>
    </Container>
  );
};

export default PatientLogin;
