import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

const { width } = Dimensions.get('window');

const AppointmentsScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const scrollY = new Animated.Value(0);
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 120],
    extrapolate: 'clamp',
  });

  const appointments = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: 'Today, 2:30 PM',
      status: 'Upcoming',
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      date: 'Tomorrow, 10:00 AM',
      status: 'Upcoming',
    },
    {
      id: 3,
      doctorName: 'Dr. Emily Brown',
      specialty: 'Pediatrics',
      date: '15 Dec, 3:30 PM',
      status: 'Completed',
    },
  ];

  const renderAppointment = ({ item, index }) => {
    const translateX = new Animated.Value(-width);
    
    useEffect(() => {
      Animated.spring(translateX, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
        delay: index * 100,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.appointmentCard,
          { transform: [{ translateX }] }
        ]}
      >
        <LinearGradient
          colors={['#ffffff', '#f8f9fa']}
          style={styles.cardGradient}
        >
          <View style={styles.appointmentHeader}>
            <Text style={styles.doctorName}>{item.doctorName}</Text>
            <View style={[
              styles.statusContainer,
              item.status === 'Completed' ? styles.completedStatus : styles.upcomingStatus,
            ]}>
              <Icon 
                name={item.status === 'Completed' ? 'check-circle' : 'schedule'} 
                size={16} 
                color={item.status === 'Completed' ? '#4CAF50' : '#4A90E2'}
                style={styles.statusIcon}
              />
              <Text style={[
                styles.status,
                item.status === 'Completed' ? styles.completedStatusText : styles.upcomingStatusText,
              ]}>
                {item.status}
              </Text>
            </View>
          </View>
          <Text style={styles.specialty}>{item.specialty}</Text>
          <View style={styles.dateContainer}>
            <Icon name="event" size={20} color="#4A90E2" />
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={['#4A90E2', '#357ABD']}
          style={styles.headerGradient}
        >
          <Text style={styles.title}>My Appointments</Text>
        </LinearGradient>
      </Animated.View>
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        showsVerticalScrollIndicator={false}
      />
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
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    marginBottom: 10,
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  appointmentCard: {
    marginBottom: 15,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 20,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: {
    marginRight: 4,
  },
  upcomingStatus: {
    backgroundColor: '#E3F2FD',
  },
  completedStatus: {
    backgroundColor: '#E8F5E9',
  },
  status: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  upcomingStatusText: {
    color: '#4A90E2',
  },
  completedStatusText: {
    color: '#4CAF50',
  },
  specialty: {
    color: '#666',
    marginBottom: 12,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    marginLeft: 8,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
});

export default AppointmentsScreen;