import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Button, ActivityIndicator } from 'react-native';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';
import Web3 from 'web3';
import axios from 'axios';
import { abi } from '../abi';  // Assuming ABI is already defined
import { contractAddress } from '../contractAddress';  // Your contract address
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppointmentScreen = () => {
  const { open, isConnected, provider } = useWalletConnectModal();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState({});
  const [loading, setLoading] = useState(true);

  // Connect Web3 to Ganache via WalletConnect or directly to Ganache using Web3 provider
  useEffect(() => {
    if (isConnected && provider) {
      const web3Instance = new Web3(provider);
      const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
      setWeb3(web3Instance);
      setContract(contractInstance);
    } else {
      const ganacheUrl = 'http://192.168.32.227:8545'; // Default Ganache URL
      const web3Instance = new Web3(new Web3.providers.HttpProvider(ganacheUrl)); // Connect to Ganache
      const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
      setWeb3(web3Instance);
      setContract(contractInstance);
    }
  }, [isConnected, provider]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const storedUserDetails = await AsyncStorage.getItem('userDetails');
        if (!storedUserDetails) {
          throw new Error('User details not found in storage.');
        }

        const userDetails = JSON.parse(storedUserDetails); // Parse the JSON string
        const id = userDetails._id; // Access the _id field
        console.log('Retrieved user ID:', id);

        const response = await axios.get(`http://192.168.32.249:3500/doctor/get/${id}`);
        setPatient(response.data.patient);
      } catch (error) {
        console.error('Error fetching patient details:', error);
        Alert.alert('Error', 'Failed to fetch patient details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, []);

  const fetchPrescriptionDetails = async (prescriptionId) => {
    if (!contract || !prescriptionId || prescriptions[prescriptionId]) return;

    try {
      const result = await contract.methods.getPrescription(prescriptionId).call();
      setPrescriptions((prev) => ({
        ...prev,
        [prescriptionId]: result,
      }));
    } catch (error) {
      console.error('Error fetching prescription:', error);
      Alert.alert('Error', 'Failed to fetch prescription details.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" />;
  }

  if (!patient) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No patient data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Patient Details</Text>
        <Text style={styles.label}>
          Name: <Text style={styles.value}>{patient.name}</Text>
        </Text>
        <Text style={styles.label}>
          Age: <Text style={styles.value}>{patient.age}</Text>
        </Text>
        <Text style={styles.label}>
          Gender: <Text style={styles.value}>{patient.gender}</Text>
        </Text>
        <Text style={styles.label}>
          Email: <Text style={styles.value}>{patient.email}</Text>
        </Text>
        <Text style={styles.label}>
          Contact: <Text style={styles.value}>{patient.contactNumber}</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Medical History</Text>
        {patient.history && patient.history.length > 0 ? (
          patient.history.map((record, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.label}>
                Prescription ID: <Text style={styles.value}>{record.prescriptionId}</Text>
              </Text>
              <Text style={styles.label}>
                Date: <Text style={styles.value}>{record.date}</Text>
              </Text>
              <Text style={styles.label}>
                Doctor: <Text style={styles.value}>{record.doctor}</Text>
              </Text>
            
              {prescriptions[record.prescriptionId] && (
                <View style={styles.prescriptionDetails}>
                  <Text style={styles.label}>
                    Medicines: <Text style={styles.value}>{prescriptions[record.prescriptionId].medicines.join(', ')}</Text>
                  </Text>
                  <Text style={styles.label}>
                    Allergies: <Text style={styles.value}>{prescriptions[record.prescriptionId].allergies}</Text>
                  </Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noHistoryText}>No medical history available.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004085',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  value: {
    fontWeight: 'normal',
    color: '#555',
  },
  historyItem: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  prescriptionDetails: {
    marginTop: 10,
  },
  noHistoryText: {
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
  },
});

export default AppointmentScreen;