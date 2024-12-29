import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { View, Text, StyleSheet, Alert, Pressable, Linking, Platform } from 'react-native';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';
import Web3 from 'web3';
import { abi } from '../abi';
import { contractAddress } from '../contractAddress';
=======
import { View, Text, StyleSheet, Alert, ScrollView, Button, ActivityIndicator } from 'react-native';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';
import Web3 from 'web3';
import axios from 'axios';
import { abi } from '../abi';  // Assuming ABI is already defined
import { contractAddress } from '../contractAddress';  // Your contract address
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> 98e08c197eeea9ff81c0b395d4b5e6546f3a59a4

const AppointmentScreen = () => {
  const { open, isConnected, provider } = useWalletConnectModal();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState({});
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
const providerMetadata = {
  name: 'Your Project Name',
  description: 'Description of your project',
  url: 'https://your-project-website.com/',
  icons: ['https://your-project-logo.com/logo.png'],
  redirect: {
    native: 'yourapp://',
    universal: 'https://your-universal-link.com',
  },
};

const AppointmentsScreen = () => {
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
=======
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
>>>>>>> 98e08c197eeea9ff81c0b395d4b5e6546f3a59a4

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

<<<<<<< HEAD
  useEffect(() => {
    if (isConnected && provider) {
      const web3Instance = new Web3(provider);
      setWeb3(web3Instance);
    }
  }, [isConnected, provider]);

  const checkMetaMaskInstallation = async () => {
    try {
      const canOpen = await Linking.canOpenURL('metamask://');
      setIsMetaMaskInstalled(canOpen);
=======
  const fetchPrescriptionDetails = async (prescriptionId) => {
    if (!contract || !prescriptionId || prescriptions[prescriptionId]) return;

    try {
      const result = await contract.methods.getPrescription(prescriptionId).call();
      setPrescriptions((prev) => ({
        ...prev,
        [prescriptionId]: result,
      }));
>>>>>>> 98e08c197eeea9ff81c0b395d4b5e6546f3a59a4
    } catch (error) {
      console.error('Error fetching prescription:', error);
      Alert.alert('Error', 'Failed to fetch prescription details.');
    }
  };

<<<<<<< HEAD
  const fetchPrescriptions = async () => {
    // Ensure the wallet is connected and web3 is initialized
    if (!web3 || !isConnected) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }
  
    // Validate the contract address
    if (!Web3.utils.isAddress(contractAddress)) {
      Alert.alert('Error', 'Invalid contract address');
      return;
    }
  
    // Start loading state
    setLoading(true);
    const contract = new web3.eth.Contract(abi, contractAddress);
  
    try {
      // Fetch the prescription count from the contract
      const prescriptionCount = await contract.methods.prescriptionCount().call();
      
      // If no prescriptions are available, display a message
      if (parseInt(prescriptionCount) === 0) {
        Alert.alert('No Prescriptions', 'No prescriptions found');
        setLoading(false);
        return;
      }
  
      // Create an array of promises to fetch all prescriptions
      const prescriptionPromises = [];
      for (let i = 1; i <= prescriptionCount; i++) {
        prescriptionPromises.push(contract.methods.getPrescription(i).call());
      }
  
      // Wait for all prescription data to be fetched
      const results = await Promise.allSettled(prescriptionPromises);
  
      // Process and store valid prescription data
      const fetchedPrescriptions = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const prescription = result.value;
  
          // Check if the prescription object is valid
          if (prescription && typeof prescription === 'object') {
            const patientName = typeof prescription.patientName === 'string' ? prescription.patientName : 'Unknown patient';
            const doctorName = typeof prescription.doctorName === 'string' ? prescription.doctorName : 'Unknown doctor';
  
            const formattedPrescription = {
              id: index + 1,
              patientName,
              doctorName,
              diagnosis: prescription.diagnosis || 'No diagnosis provided',
              medications: prescription.medications || 'No medications listed',
              date: prescription.timestamp ? new Date(prescription.timestamp * 1000).toLocaleDateString() : 'Date not available',
            };
  
            fetchedPrescriptions.push(formattedPrescription);
          }
        }
      });
  
      // Update the state with fetched prescriptions
      if (fetchedPrescriptions.length > 0) {
        setPrescriptions(fetchedPrescriptions);
      } else {
        Alert.alert('No Valid Prescriptions', 'No valid prescriptions found');
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      Alert.alert('Error', `Failed to fetch prescriptions: ${error.message}`);
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };
  

  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled) {
      const storeUrl = Platform.select({
        ios: 'https://apps.apple.com/us/app/metamask/id1438144202',
        android: 'https://play.google.com/store/apps/details?id=io.metamask',
      });
      Alert.alert('MetaMask Required', 'MetaMask is not installed. Please install it.', [
        {
          text: 'Install MetaMask',
          onPress: () => Linking.openURL(storeUrl),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    try {
      await open();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      Alert.alert('Connection Error', 'Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      if (provider) {
        await provider.disconnect();
        Alert.alert('Disconnected', 'Your wallet has been disconnected.');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.walletContainer}>
        {isConnected ? (
          <View style={styles.walletInfo}>
            <Text style={styles.connectedText}>
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Address not available'}
            </Text>
            <Pressable style={styles.disconnectButton} onPress={handleDisconnectWallet}>
              <Text style={styles.buttonText}>Disconnect</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.connectButton} onPress={handleConnectWallet}>
            <Text style={styles.buttonText}>Connect Wallet</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.headerTitle}>Prescriptions</Text>

      {isConnected && (
        <Pressable style={styles.getPrescriptionButton} onPress={fetchPrescriptions}>
          <Text style={styles.buttonText}>Fetch Prescriptions</Text>
        </Pressable>
      )}

      {loading && <Text>Loading prescriptions...</Text>}

      {prescriptions.length > 0 && (
        <View style={styles.prescriptionContainer}>
          {prescriptions.map((prescription, index) => (
            <Text key={index} style={styles.prescriptionText}>
              {JSON.stringify(prescription)}
            </Text>
          ))}
        </View>
      )}

      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
        explorerRecommendedWalletIds={['c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96']}
        explorerExcludedWalletIds="ALL"
      />
    </View>
=======
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
>>>>>>> 98e08c197eeea9ff81c0b395d4b5e6546f3a59a4
  );
};

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    flex: 1,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
  },
  walletContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 100,
=======
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
>>>>>>> 98e08c197eeea9ff81c0b395d4b5e6546f3a59a4
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
<<<<<<< HEAD
  connectedText: {
    fontSize: 16,
    marginRight: 10,
    color: '#4A90E2',
  },
  connectButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  disconnectButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  getPrescriptionButton: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  prescriptionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
  },
  prescriptionText: {
    fontSize: 16,
    color: '#2C3E50',
=======
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
>>>>>>> 98e08c197eeea9ff81c0b395d4b5e6546f3a59a4
  },
});

export default AppointmentScreen;