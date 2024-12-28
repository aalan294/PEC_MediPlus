import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({ navigation }) => {
  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    bloodGroup: 'A+',
    age: '32',
    weight: '75 kg',
    height: '175 cm',
  };

  const menuItems = [
    { icon: 'person', title: 'Personal Information' },
    { icon: 'history', title: 'Medical History' },
    { icon: 'local-hospital', title: 'Test Reports' },
    { icon: 'payment', title: 'Payment Methods' },
    { icon: 'settings', title: 'Settings' },
    { icon: 'help', title: 'Help & Support' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{profileData.name}</Text>
        <Text style={styles.email}>{profileData.email}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Blood Group</Text>
          <Text style={styles.infoValue}>{profileData.bloodGroup}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Age</Text>
          <Text style={styles.infoValue}>{profileData.age}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Weight</Text>
          <Text style={styles.infoValue}>{profileData.weight}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Icon name={item.icon} size={24} color="#4A90E2" />
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Icon name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Icon name="logout" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    color: '#666',
    marginTop: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoCard: {
    alignItems: 'center',
  },
  infoLabel: {
    color: '#666',
    fontSize: 12,
  },
  infoValue: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuTitle: {
    flex: 1,
    marginLeft: 15,
    color: '#333',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4444',
    margin: 20,
    padding: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileScreen;