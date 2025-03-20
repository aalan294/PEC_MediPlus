import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Linking, Platform, Alert, Pressable } from 'react-native';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';

const projectId = 'f3c1be359046efb4c3f70c6d30d4f3fc';

const providerMetadata = {
  name: 'Your Project Name',
  description: 'Description of your project',
  url: 'https://your-project-website.com/',
  icons: ['https://your-project-logo.com/logo.png'],
  redirect: {
    native: 'yourapp://', // Update this to your app's deep link scheme
    universal: 'https://your-universal-link.com',
  },
};

const AppointmentsScreen = () => {
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    checkMetaMaskInstallation();
  }, []);

  const checkMetaMaskInstallation = async () => {
    try {
      if (Platform.OS === 'ios') {
        const canOpen = await Linking.canOpenURL('metamask://');
        setIsMetaMaskInstalled(canOpen);
      } else if (Platform.OS === 'android') {
        const canOpen = await Linking.canOpenURL('metamask://');
        setIsMetaMaskInstalled(canOpen);
      }
    } catch (error) {
      console.error('Error checking MetaMask installation:', error);
      setIsMetaMaskInstalled(false);
    }
  };

  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled) {
      const storeUrl = Platform.select({
        ios: 'https://apps.apple.com/us/app/metamask/id1438144202',
        android: 'https://play.google.com/store/apps/details?id=io.metamask',
      });
      Alert.alert(
        'MetaMask Required',
        'MetaMask is not installed. Please install it from the app store.',
        [
          {
            text: 'Install MetaMask',
            onPress: () => Linking.openURL(storeUrl),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    try {
      await open(); // Opens the WalletConnect modal
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
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Appointments</Text>
      {isConnected ? (
        <View>
          <Text style={styles.connectedText}>
            Connected Wallet: {address.slice(0, 6)}...{address.slice(-4)}
          </Text>
          <Button title="Disconnect Wallet" onPress={handleDisconnectWallet} />
        </View>
      ) : (
        <Button title="Connect Wallet" onPress={handleConnectWallet} />
      )}

      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
        explorerRecommendedWalletIds={[
          'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
        ]}
        explorerExcludedWalletIds={'ALL'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 10,
    color: 'green',
  },
});

export default AppointmentScreen;