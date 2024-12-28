import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Styled Components for blue, white, and yellow theme
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
`;

const Wrapper = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const AlertBox = styled.div`
  background-color: #ffeb3b;
  color: #333;
  padding: 20px;
  border-radius: 5px;
  font-size: 18px;
  text-align: center;
  width: 100%;
`;

const HomeLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  font-size: 16px;
  &:hover {
    text-decoration: underline;
  }
`;

const UnverifiedP = () => {
  return (
    <Container>
      <Wrapper>
        <AlertBox>
          Your application to register as a Pharmacy is still under process. Please wait for further updates.
        </AlertBox>
        <HomeLink to="/">Go back to Home Page</HomeLink>
      </Wrapper>
    </Container>
  );
};

export default UnverifiedP;
