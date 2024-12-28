import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const AppointmentsScreen = ({ navigation }) => {
  const appointments = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: 'Today, 2:30 PM',
      status: 'Confirmed',
      image: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg'
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialty: 'Pediatrics',
      date: 'Tomorrow, 10:00 AM',
      status: 'Pending',
      image: 'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg'
    },
    {
      id: 3,
      doctorName: 'Dr. Emily Wilson',
      specialty: 'Neurology',
      date: 'Dec 30, 3:15 PM',
      status: 'Confirmed',
      image: 'https://img.freepik.com/free-photo/medium-shot-doctor-with-stethoscope_23-2148869134.jpg'
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      <LinearGradient
        colors={['#4A90E2', '#357ABD', '#2E6DA4']}
        style={styles.header}
      >
        <Animatable.Text 
          animation="fadeInDown"
          style={styles.headerTitle}
        >
          Appointments
        </Animatable.Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
            <Text style={[styles.filterText, styles.activeFilterText]}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Past</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Cancelled</Text>
          </TouchableOpacity>
        </View>

        <Animatable.View animation="fadeInUp" style={styles.appointmentsList}>
          {appointments.map((appointment) => (
            <Animatable.View 
              key={appointment.id}
              animation="fadeInUp"
              delay={appointment.id * 100}
            >
              <TouchableOpacity
                style={styles.appointmentCard}
                onPress={() => navigation.navigate('BookingScreen', { appointment })}
              >
                <LinearGradient
                  colors={['#4A90E2', '#357ABD']}
                  style={styles.appointmentGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.appointmentContent}>
                    <View style={styles.doctorAvatarContainer}>
                      <Image
                        source={{ uri: appointment.image }}
                        style={styles.doctorAvatar}
                      />
                    </View>
                    <View style={styles.appointmentInfo}>
                      <Text style={styles.doctorName}>{appointment.doctorName}</Text>
                      <View style={styles.specialtyContainer}>
                        <Icon name="local-hospital" size={16} color="#FFF" />
                        <Text style={styles.specialtyText}>{appointment.specialty}</Text>
                      </View>
                      <View style={styles.dateContainer}>
                        <Icon name="access-time" size={16} color="#FFF" />
                        <Text style={styles.dateText}>{appointment.date}</Text>
                      </View>
                    </View>
                    <View style={styles.statusContainer}>
                      <Text style={[
                        styles.statusText,
                        { color: appointment.status === 'Confirmed' ? '#4CAF50' : '#FFC107' }
                      ]}>
                        {appointment.status}
                      </Text>
                      <Icon name="chevron-right" size={24} color="#FFF" />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </Animatable.View>
      </ScrollView>

      <BlurView intensity={100} style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home" size={24} color="#666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Appointments')}
        >
          <Icon name="calendar-today" size={24} color="#4A90E2" />
          <Text style={[styles.navText, { color: '#4A90E2' }]}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Messages')}
        >
          <Icon name="chat" size={24} color="#666" />
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="person" size={24} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </BlurView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('BookingScreen')}
      >
        <LinearGradient
          colors={['#4A90E2', '#357ABD']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon name="add" size={30} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    height: 120,
    paddingTop: StatusBar.currentHeight + 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#4A90E2',
  },
  filterText: {
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  activeFilterText: {
    color: '#FFF',
  },
  appointmentsList: {
    paddingHorizontal: 20,
  },
  appointmentCard: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  appointmentGradient: {
    padding: 20,
  },
  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  doctorAvatar: {
    width: '100%',
    height: '100%',
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: 15,
  },
  doctorName: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFF',
    marginBottom: 5,
  },
  specialtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  specialtyText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#FFF',
    opacity: 0.9,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#FFF',
    opacity: 0.9,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 5,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 10,
    paddingBottom: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  navText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppointmentsScreen;