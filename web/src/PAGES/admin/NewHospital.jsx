import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../API/api';
import styled from 'styled-components';
import Web3 from 'web3';
import { pinata } from '../../config';
import { abi } from '../../abi';
import AdminNav from './AdminNav';
import {contractAddress} from '../../contractAddress'

const NewHospitalContainer = styled.div`
  background-color: #f0f8ff;
  color: #003366;
  border-radius: 10px;
  margin: auto;
  h2{
    display: flex;
    padding: 5px;
    justify-content: center;
  }
`;

const HospitalList = styled.ul`
display: flex;
flex-wrap: wrap;
flex-direction: row;
  list-style-type: none;
  padding: 10px;
  width: 100%;
`;

const HospitalItem = styled.li`
  padding: 20px;
  margin: 10px 0;
  margin: 3rem;
  width: 400px;
  border: 1px solid #003366;
  border-radius: 5px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const VerifyButton = styled.button`
  background-color: #003366;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #002244;
  }
`;

const DocumentLink = styled.a`
  color: #003366;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const NewHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [signedUrls, setSignedUrls] = useState({});
  const navigate = useNavigate();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractAddress);

  // Fetch hospitals from the API
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await api.get('/admin/get-hos-req');
        setHospitals(response.data.hospitals);

        // Pre-fetch signed URLs for each hospital's verificationHash
        response.data.hospitals.forEach(async (hospital) => {
          if (hospital.verification) {
            const url = await getSignedUrl(hospital.verification);
            setSignedUrls((prev) => ({
              ...prev,
              [hospital._id]: url,
            }));
          }
        });
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };

    fetchHospitals();
  }, []);

  // Function to verify a hospital
  const handleVerify = async (hospital) => {
    try {
      // First upload the hospital data to the blockchain
      await uploadToBlockchain(hospital);

      // Upon successful blockchain upload, update the backend
      await api.patch(`/admin/verify-hospital/${hospital._id}`);

      // Redirect to the dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      alert(error.message);
      console.error('Error during verification:', error);
    }
  };

  // Function to upload hospital data to the blockchain
  const uploadToBlockchain = async (hospital) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods
        .registerFields(
          hospital.wallet,
          hospital._id,
          hospital.name,
          hospital.verification,
          2 // Role is Hospital (enum starts from 0)
        )
        .send({ from: accounts[0] });

      console.log('Hospital data uploaded to blockchain successfully');
    } catch (error) {
      throw new Error('Error uploading hospital data to blockchain: ' + error.message);
    }
  };

  // Function to get signed URL for verification document
  const getSignedUrl = async (cid) => {
    try {
      const signedUrl = await pinata.gateways.createSignedURL({
        cid: cid,
        expires: 60, // URL expiration time in seconds
      });
      return signedUrl;
    } catch (err) {
      console.error('Error fetching signed URL:', err);
      return '';
    }
  };

  return (
    <NewHospitalContainer>
      <AdminNav/>
      <h2>Hospital List</h2>
      <HospitalList>
        {hospitals.map((hospital) => (
          <HospitalItem key={hospital._id}>
            <strong>Owner:</strong> {hospital.owner}
            <strong>Email:</strong> {hospital.email}
            <strong>Address:</strong> {hospital.address}
            <strong>Wallet:</strong> {hospital.wallet}
            <strong>Name:</strong> {hospital.name}
            <strong>Phone:</strong> {hospital.phone}
            <strong>Verification Status:</strong> {hospital.isVerified ? 'Verified' : 'Not Verified'}
            <VerifyButton onClick={() => handleVerify(hospital)}>Verify</VerifyButton>
            {signedUrls[hospital._id] && (
              <DocumentLink
                href={signedUrls[hospital._id]}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Verification Document
              </DocumentLink>
            )}
          </HospitalItem>
        ))}
      </HospitalList>
    </NewHospitalContainer>
  );
};

export default NewHospital;
