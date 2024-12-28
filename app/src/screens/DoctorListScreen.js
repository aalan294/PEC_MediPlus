// screens/DoctorListScreen.js
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure this is installed

const DoctorListScreen = ({ navigation, route }) => {
  const { specialty } = route.params;
  
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      experience: '15 years',
      rating: 4.8,
      // Use require for local images or a URL for remote images
      // image: require('../assets/doctor1.png'),
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      experience: '12 years',
      rating: 4.7,
      // image: require('../assets/doctor2.png'),
    },
  ];

  // Define renderDoctorCard inside the component
  const renderDoctorCard = ({ item }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => navigation.navigate('DoctorDetail', { doctor: item })}
    >
      <Image source={item.image} style={styles.doctorImage} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        <Text style={styles.doctorExperience}>{item.experience} experience</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{specialty} Specialists</Text>
      <FlatList
        data={doctors}
        renderItem={renderDoctorCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    color: '#333',
  },
  listContainer: {
    padding: 10,
  },
  doctorCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  doctorInfo: {
    marginLeft: 15,
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorSpecialty: {
    color: '#4A90E2',
    marginTop: 5,
  },
  doctorExperience: {
    color: '#666',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rating: {
    marginLeft: 5,
    color: '#333',
  },
});

export default DoctorListScreen;