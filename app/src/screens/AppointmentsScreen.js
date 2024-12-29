import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable, Linking, Platform } from 'react-native';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';
import Web3 from 'web3';
import { abi } from '../abi';
import { contractAddress } from '../contractAddress';

const projectId = 'f3c1be359046efb4c3f70c6d30d4f3fc';

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

  useEffect(() => {
    checkMetaMaskInstallation();
  }, []);

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
    } catch (error) {
      console.error('Error checking MetaMask installation:', error);
      setIsMetaMaskInstalled(false);
    }
  };

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
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 20,
  },
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
  },
});

export default AppointmentsScreen;
