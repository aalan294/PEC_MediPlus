import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';
import Web3 from 'web3';
import axios from 'axios';
import { abi } from '../abi';
import { contractAddress } from '../contractAddress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';

const AppointmentScreen = () => {
  const { open, isConnected, provider } = useWalletConnectModal();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedRecord, setExpandedRecord] = useState(null);

  // Keep existing Web3 setup
  useEffect(() => {
    if (isConnected && provider) {
      const web3Instance = new Web3(provider);
      const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
      setWeb3(web3Instance);
      setContract(contractInstance);
    } else {
      const ganacheUrl = 'http://192.168.32.227:8545';
      const web3Instance = new Web3(new Web3.providers.HttpProvider(ganacheUrl));
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
        const userDetails = JSON.parse(storedUserDetails);
        const id = userDetails._id;
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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading medical history...</Text>
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.container}>
        <View style={styles.errorCard}>
          <FontAwesome5 name="file-medical-alt" size={50} color="#FF6B6B" />
          <Text style={styles.errorText}>No medical records found</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medical History</Text>
        <Text style={styles.headerSubtitle}>View your past medical records and prescriptions</Text>
      </View>

      <View style={styles.historyContainer}>
        {patient.history && patient.history.length > 0 ? (
          patient.history.map((record, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.recordCard, expandedRecord === index && styles.expandedCard]}
              onPress={() => {
                setExpandedRecord(expandedRecord === index ? null : index);
                fetchPrescriptionDetails(record.prescriptionId);
              }}
            >
              <View style={styles.recordHeader}>
                <View style={styles.recordIcon}>
                  <FontAwesome5 name="file-medical" size={20} color="#4A90E2" />
                </View>
                <View style={styles.recordInfo}>
                  <Text style={styles.recordDate}>{record.date}</Text>
                  <Text style={styles.recordDoctor}>Dr. {record.doctor}</Text>
                  <Text style={styles.prescriptionId}>Prescription #{record.prescriptionId}</Text>
                </View>
                <FontAwesome5 
                  name={expandedRecord === index ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color="#4A90E2" 
                />
              </View>
              
              {expandedRecord === index && prescriptions[record.prescriptionId] && (
                <View style={styles.recordDetails}>
                  <View style={styles.medicineSection}>
                    <View style={styles.sectionHeader}>
                      <FontAwesome5 name="pills" size={16} color="#4A90E2" />
                      <Text style={styles.sectionTitle}>Prescribed Medicines</Text>
                    </View>
                    {prescriptions[record.prescriptionId].medicines.map((medicine, idx) => (
                      <View key={idx} style={styles.medicineItem}>
                        <FontAwesome5 name="dot-circle" size={12} color="#4A90E2" />
                        <Text style={styles.medicineText}>{medicine}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.allergySection}>
                    <View style={styles.sectionHeader}>
                      <FontAwesome5 name="exclamation-circle" size={16} color="#E53E3E" />
                      <Text style={styles.allergyTitle}>Allergies & Notes</Text>
                    </View>
                    <Text style={styles.allergyText}>
                      {prescriptions[record.prescriptionId].allergies || 'No allergies reported'}
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <FontAwesome5 name="notes-medical" size={50} color="#BBC5CE" />
            <Text style={styles.emptyStateText}>No medical history available</Text>
            <Text style={styles.emptyStateSubtext}>Your medical records will appear here</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F8FB',
  },
  loadingText: {
    marginTop: 10,
    color: '#4A90E2',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8F1FF',
    textAlign: 'center',
    marginTop: 5,
  },
  historyContainer: {
    padding: 16,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  expandedCard: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recordDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  recordDoctor: {
    fontSize: 14,
    color: '#4A90E2',
    marginTop: 2,
  },
  prescriptionId: {
    fontSize: 12,
    color: '#8FA3BF',
    marginTop: 2,
  },
  recordDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  medicineSection: {
    marginBottom: 20,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  medicineText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 8,
  },
  allergySection: {
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 12,
  },
  allergyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53E3E',
    marginLeft: 8,
  },
  allergyText: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 8,
    marginLeft: 24,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#BBC5CE',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#BBC5CE',
    marginTop: 8,
  },
  errorCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

export default AppointmentScreen;