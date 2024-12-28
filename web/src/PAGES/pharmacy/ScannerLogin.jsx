import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import styled from 'styled-components';
import { abi } from '../../abi';
import { pinata } from '../../config';
import { contractAddress } from '../../contractAddress';


const ScannerLogin = () => {
  const { id } = useParams(); // Get the prescription ID from the URL
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFulfilled, setIsFulfilled] = useState(false);
  const [url, setUrl] = useState('');

  // Initialize Web3 and contract instance
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);

          setWeb3(web3Instance);
          setContract(contractInstance);
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.error('No Ethereum wallet detected.');
      }
    };

    initWeb3();
  }, []);

  // Fetch prescription details
  useEffect(() => {
    const fetchPrescription = async () => {
      if (contract && id) {
        try {
          const prescriptionData = await contract.methods.getPrescription(id).call();
          setPrescription({
            prescriptionId: prescriptionData[0].toString(),
            userId: prescriptionData[1],
            timestamp: new Date(parseInt(prescriptionData[2]) * 1000),
            description: prescriptionData[3],
            dept: prescriptionData[4].toString(),
            medicines: prescriptionData[5],
            documents: prescriptionData[6],
            allergies: prescriptionData[7],
            isFulfilled: prescriptionData[8],
          });
          setIsFulfilled(prescriptionData[8]);

          const signedUrl = await pinata.gateways.createSignedURL({
            cid: 'bafybeifocbigpbnlup47txhxvbe5fny6epj43oru6g4etg2z635rr3xewy',
            expires: 60000,
          });
          setUrl(signedUrl);
        } catch (error) {
          console.error('Error fetching prescription:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPrescription();
  }, [contract, id]);

  // Function to fulfill the prescription
  const fulfillPrescription = async () => {
    if (contract && account && id) {
      try {
        await contract.methods.fulfillPrescription(id).send({ from: account });
        alert('Prescription fulfilled successfully.');
        setIsFulfilled(true);
      } catch (error) {
        console.error('Error fulfilling prescription:', error);
        alert('Error fulfilling prescription. Make sure you have the correct role and are connected to the network.');
      }
    }
  };

  if (loading) {
    return <LoadingMessage>Loading prescription details...</LoadingMessage>;
  }

  if (!prescription) {
    return <ErrorMessage>Prescription not found.</ErrorMessage>;
  }

  return (
    <Container>
      <Card>
        <Title>Prescription Details</Title>

        <Grid>
          <div>
            <Label>Prescription ID:</Label> {prescription.prescriptionId}
          </div>
          <div>
            <Label>User ID:</Label> {prescription.userId}
          </div>
          <div>
            <Label>Timestamp:</Label> {prescription.timestamp.toString()}
          </div>
          <div>
            <Label>Department:</Label> {prescription.dept}
          </div>
        </Grid>

        <Section>
          <Label>Description:</Label>
          <Text>{prescription.description}</Text>
        </Section>

        <Section>
          <Label>Medicines:</Label>
          <Text>{prescription.medicines.join(', ')}</Text>
        </Section>

        <Section>
          <Label>Allergies:</Label>
          <Text>{prescription.allergies.length > 0 ? prescription.allergies.join(', ') : 'None'}</Text>
        </Section>

        <Section>
          <Label>Documents:</Label>
          <DocumentList>
            {prescription.documents.map((doc, index) => (
              <li key={index}>
                <DocumentLink href={url} target="_blank" rel="noopener noreferrer">
                  Document {index + 1}
                </DocumentLink>
              </li>
            ))}
          </DocumentList>
        </Section>

        <Section>
          <Label>Status:</Label>
          <Text status={isFulfilled}>{isFulfilled ? 'Fulfilled' : 'Not Fulfilled'}</Text>
        </Section>

        {!isFulfilled && (
          <ButtonWrapper>
            <FulfillButton onClick={fulfillPrescription}>Update Prescription as Fulfilled</FulfillButton>
          </ButtonWrapper>
        )}
      </Card>
    </Container>
  );
};

export default ScannerLogin;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #ebf8ff, #ffffff);
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 768px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: #3182ce;
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.strong`
  display: block;
  color: #4a5568;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const Text = styled.p`
  color: ${({ status }) => (status ? '#38a169' : '#e53e3e')};
  margin-top: 0.5rem;
`;

const DocumentList = styled.ul`
  list-style: disc;
  margin-top: 0.5rem;
  padding-left: 1.5rem;
`;

const DocumentLink = styled.a`
  color: #3182ce;
  text-decoration: underline;
  &:hover {
    text-decoration: none;
  }
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const FulfillButton = styled.button`
  background-color: #3182ce;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #2b6cb0;
  }
  transition: background-color 0.3s;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1.5rem;
`;

const ErrorMessage = styled(LoadingMessage)`
  color: red;
`;
