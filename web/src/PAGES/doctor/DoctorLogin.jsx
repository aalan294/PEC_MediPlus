import React, { useState } from 'react';
import api from '../../API/api';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9f9f9; /* Light background */
  padding: 20px;
`;

const Title = styled.h2`
  color: #007bff; /* Blue color for the title */
`;

const Form = styled.form`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px; /* Fixed width */
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: #333; /* Darker color for the label */
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    border-color: #007bff; /* Blue border on focus */
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff; /* Blue background */
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }
`;

const Message = styled.div`
  margin-top: 15px;
  color: ${props => (props.success ? 'green' : 'red')}; /* Green for success, red for error */
`;

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await api.post('/doctor/login', { email, password });
      const { message, status, user } = response.data; // Destructure user from response

      setMessage(message);
      setStatus(status);

      if (status) {
        // Store user data in local storage
        localStorage.setItem('medithon-user', JSON.stringify(user)); // Store user data
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      setMessage('An error occurred while logging in.');
      setStatus(false);
      console.error('Login error:', error);
    }
  };

  return (
    <Container>
      <Title>Doctor Login</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="email">Email:</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputGroup>
        <Button type="submit">Login</Button>
      </Form>
      {message && (
        <Message success={status}>
          {message}
        </Message>
      )}
    </Container>
  );
};

export default DoctorLogin;
