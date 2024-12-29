import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as Animatable from 'react-native-animatable';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [isLoading, setIsLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const specialties = [
    { 
      id: 1, 
      name: 'Cardiology', 
      icon: 'favorite', 
      gradient: ['#FF6B6B', '#FF8E8E'],
      description: 'Heart Care'
    },
    { 
      id: 2, 
      name: 'Pediatrics', 
      icon: 'child-care', 
      gradient: ['#4FACFE', '#00F2FE'],
      description: 'Child Healthcare'
    },
    { 
      id: 3, 
      name: 'Neurology', 
      icon: 'psychology', 
      gradient: ['#FA709A', '#FEE140'],
      description: 'Brain & Nerve Care'
    },
    { 
      id: 4, 
      name: 'Orthopedics', 
      icon: 'accessibility', 
      gradient: ['#43E97B', '#38F9D7'],
      description: 'Bone & Joint Care'
    },
  ];

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animatable.View animation="rotate" iterationCount="infinite" duration={2000}>
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            style={styles.loadingIcon}
          >
            <Icon name="local-hospital" size={40} color="#FFF" />
          </LinearGradient>
        </Animatable.View>
        <Animatable.Text 
          animation="pulse" 
          iterationCount="infinite"
          style={styles.loadingText}
        >
          Loading MediPlus...
        </Animatable.Text>
      </View>
    );
  }

  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.header,
        {
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
        }
      ]}
    >
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Animatable.Text animation="fadeInDown" style={styles.welcomeText}>
            Welcome to
          </Animatable.Text>
          <Animatable.Text animation="fadeInUp" style={styles.headerTitle}>
            MediPlus
          </Animatable.Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {renderHeader()}

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.searchContainer}>
          <BlurView intensity={80} style={styles.searchBar}>
            <Icon name="search" size={24} color="#4A90E2" />
            <TextInput
              placeholder="Search doctors, specialties..."
              style={styles.searchInput}
              placeholderTextColor="#666"
            />
          </BlurView>
        </View>

        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Medical Services</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtiesContainer}
          >
            {specialties.map((specialty, index) => (
              <Animatable.View
                key={specialty.id}
                animation="fadeInRight"
                delay={index * 100}
              >
                <TouchableOpacity
                  style={styles.specialtyCard}
                  onPress={() => navigation.navigate('DoctorList', { specialty: specialty.name })}
                >
                  <LinearGradient
                    colors={specialty.gradient}
                    style={styles.specialtyGradient}
                  >
                    <Icon name={specialty.icon} size={32} color="#FFF" />
                  </LinearGradient>
                  <Text style={styles.specialtyName}>{specialty.name}</Text>
                  <Text style={styles.specialtyDescription}>{specialty.description}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.appointmentsSection}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity
            style={styles.appointmentCard}
            onPress={() => navigation.navigate('Appointments')}
          >
            <LinearGradient
              colors={['#4A90E2', '#357ABD']}
              style={styles.appointmentGradient}
            >
              <View style={styles.appointmentContent}>
                <Image
                  source={{ uri: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg' }}
                  style={styles.doctorAvatar}
                />
                <View style={styles.appointmentInfo}>
                  <Text style={styles.doctorName}>Dr. Sarah Johnson</Text>
                  <Text style={styles.appointmentTime}>Today, 2:30 PM</Text>
                  <View style={styles.appointmentType}>
                    <Icon name="favorite" size={16} color="#FFF" />
                    <Text style={styles.appointmentTypeText}>Cardiology</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            {['Lab Reports', 'Medications', 'Insurance', 'Emergency'].map((item, index) => (
              <Animatable.View
                key={item}
                animation="zoomIn"
                delay={index * 100}
              >
                <TouchableOpacity style={styles.quickAccessCard}>
                  <LinearGradient
                    colors={['#4A90E2', '#357ABD']}
                    style={styles.quickAccessGradient}
                  >
                    <Icon 
                      name={
                        index === 0 ? 'science' :
                        index === 1 ? 'medical-services' :
                        index === 2 ? 'security' : 'emergency'
                      } 
                      size={24} 
                      color="#FFF" 
                    />
                  </LinearGradient>
                  <Text style={styles.quickAccessText}>{item}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      <BlurView intensity={100} style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home" size={24} color="#4A90E2" />
          <Text style={[styles.navText, { color: '#4A90E2' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Appointments')}
        >
          <Icon name="calendar-today" size={24} color="#666" />
          <Text style={styles.navText}>Prescription</Text>
        </TouchableOpacity>
       
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="person" size={24} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#4A90E2',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerGradient: {
    height: height * 0.25,
    paddingTop: StatusBar.currentHeight + 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 30,
    color: '#FFF',
    opacity: 0.9,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 60,
    color: '#FFF',
    marginTop: -15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: height * 0.2,
    paddingBottom: 100,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 60,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  servicesSection: {
    marginBottom: 30,
  },
  specialtiesContainer: {
    paddingHorizontal: 20,
  },
  specialtyCard: {
    width: width * 0.4,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  specialtyGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  specialtyName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginBottom: 5,
  },
  specialtyDescription: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  appointmentsSection: {
    marginBottom: 30,
  },
  appointmentCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  appointmentGradient: {
    padding: 20,
  },
  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFF',
    marginBottom: 5,
  },
  appointmentTime: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#FFF',
    opacity: 0.9,
  },
  appointmentType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  appointmentTypeText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#FFF',
    opacity: 0.9,
  },
  quickAccessSection: {
    marginBottom: 30,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  quickAccessGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickAccessText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
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
});

export default HomeScreen;