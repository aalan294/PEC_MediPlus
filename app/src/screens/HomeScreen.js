import React, { useEffect, useRef } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const specialtyAnimations = useRef(
    Array.from({ length: 4 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      ...specialtyAnimations.map((anim, index) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          delay: index * 100,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, []);

  const scrollY = new Animated.Value(0);
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [400, 300],
    extrapolate: 'clamp',
  });

  const specialties = [
    { id: 1, name: 'Cardiology', icon: 'favorite', color: '#4A90E2' },
    { id: 2, name: 'Pediatrics', icon: 'child-care', color: '#FF9500' },
    { id: 3, name: 'Neurology', icon: 'psychology', color: '#4A90E2' },
    { id: 4, name: 'Orthopedics', icon: 'accessibility', color: '#FF9500' },
  ];

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={['#4A90E2', '#357ABD']}
          style={styles.gradient}
        >
          <View style={styles.waveContainer}>
            <Svg
              height="100"
              width="100%"
              viewBox="1 0 1440 320"
              style={styles.waveSvg}
            >
              <Path
                fill="#ffffff"
                d="M0,32L48,53.3C96,75,192,117,288,122.7C384,128,480,96,576,85.3C672,75,768,85,864,106.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </Svg>
          </View>
          <Animated.View style={[styles.headerContent, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.headerTitle}>MediPlus</Text>
            <Text style={styles.subTitle}>Your Health, Our Priority</Text>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <Animated.View style={[styles.searchBar, { opacity: fadeAnim }]}>
          <Icon name="search" size={24} color="#4A90E2" />
          <TextInput
            placeholder="Search doctors, specialties..."
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </Animated.View>

        <Animated.Text style={[styles.sectionTitle, { opacity: fadeAnim }]}>Medical Services</Animated.Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.specialtiesScroll}
        >
          {specialties.map((specialty, index) => (
            <Animated.View
              key={specialty.id}
              style={[
                { transform: [{ scale: specialtyAnimations[index] }] }
              ]}
            >
              <TouchableOpacity
                style={styles.specialtyCard}
                onPress={() => navigation.navigate('DoctorList', { specialty: specialty.name })}
              >
                <LinearGradient
                  colors={[specialty.color, specialty.color + 'DD']}
                  style={styles.specialtyGradient}
                >
                  <Icon name={specialty.icon} size={32} color="#FFF" />
                </LinearGradient>
                <Text style={styles.specialtyName}>{specialty.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        <Animated.View style={[styles.appointmentsSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity
            style={styles.appointmentCard}
            onPress={() => navigation.navigate('Appointments')}
          >
            <View style={styles.appointmentLeft}>
              <LinearGradient
                colors={['#4A90E2', '#357ABD']}
                style={styles.doctorAvatarGradient}
              >
                <Icon name="person" size={30} color="#FFF" />
              </LinearGradient>
            </View>
            <View style={styles.appointmentInfo}>
              <Text style={styles.doctorName}>Dr. Sarah Johnson</Text>
              <Text style={styles.appointmentTime}>Today, 2:30 PM</Text>
              <View style={styles.appointmentType}>
                <Icon name="favorite" size={16} color="#4A90E2" />
                <Text style={styles.appointmentTypeText}>Cardiology</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      <Animated.View style={[styles.bottomNav, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#4A90E2" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="calendar-today" size={24} color="#666" />
          <Text style={[styles.navText, { color: '#666' }]}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="chat" size={24} color="#666" />
          <Text style={[styles.navText, { color: '#666' }]}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person" size={24} color="#666" />
          <Text style={[styles.navText, { color: '#666' }]}>Profile</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    overflow: 'hidden',
    height: 400,
  },
  gradient: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -170,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    height: 10,
  },
  waveSvg: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100px',
  },
  welcomeText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 48,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'left',
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 56,
    color: '#fff',
    marginTop: -20,
    textAlign: 'left',
  },
  subTitle: {
    fontFamily: 'Poppins_400Bold',
    fontSize: 20,
    color: '#fff',
    marginTop: -20,
    textAlign: 'left',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -130,
    paddingTop: 30,
    position: 'relative',
    zIndex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    margin: 20,
    marginBottom: 15,
    color: '#333',
  },
  specialtiesScroll: {
    paddingLeft: 20,
  },
  specialtyCard: {
    alignItems: 'center',
    marginRight: 15,
    width: 100,
    transform: [{ scale: 1 }],
  },
  specialtyGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  specialtyName: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
    textAlign: 'center',
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  appointmentLeft: {
    marginRight: 15,
  },
  doctorAvatarGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  appointmentTime: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginTop: 2,
  },
  appointmentType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  appointmentTypeText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#4A90E2',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  navText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    marginTop: 6,
  },
});

export default HomeScreen;