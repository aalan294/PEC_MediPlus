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
    fontWeight: '600',
    marginBottom: 20,
  },
  connectedText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'green',
  },
});

export default AppointmentsScreen;
