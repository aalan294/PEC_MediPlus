import React, { useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import {abi} from '../../abi';  // Import the ABI from the abi.js file
import { contractAddress } from '../../contractAddress';  


const AdminLogin = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleConnectMetamask = async () => {
        setLoading(true);
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
                setUser(accounts[0]);
                const web3 = new Web3(window.ethereum);
                const contractInstance = new web3.eth.Contract(abi, contractAddress);
                const adminAddress = await contractInstance.methods.admin().call();
                if (accounts[0].toLowerCase() === adminAddress.toLowerCase()) {
                    navigate('/admin/dashboard');
                } else {
                    alert('You are not the admin');
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                if (error.code === 4001) {
                    alert('Metamask connection is required.');
                } else {
                    alert('Check if you have installed Metamask or there may be network issues.');
                }
            }
        } else {
            setLoading(false);
            alert('Please install Metamask to use this application.');
        }
    };

    return (
        <Container>
            <Heading>Connect Metamask to Continue</Heading>
            <Button onClick={handleConnectMetamask} disabled={loading}>
                {loading ? 'Connecting...' : 'Connect Metamask'}
            </Button>
        </Container>
    );
};

export default AdminLogin;

// Styled Components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f8ff;
`;

const Heading = styled.h1`
    color: #1e90ff;
    margin-bottom: 20px;
`;

const Button = styled.button`
    background-color: #1e90ff;
    color: #fff;
    padding: 10px 20px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #4682b4;
    }

    &:disabled {
        background-color: #87cefa;
        cursor: not-allowed;
    }
`;
