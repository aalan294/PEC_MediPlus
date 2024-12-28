import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const BookingScreen = ({ route, navigation }) => {
  const { doctor } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  ];

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book Appointment</Text>
      <Text style={styles.doctorName}>with {doctor.name}</Text>

      <Text style={styles.sectionTitle}>Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.dateContainer}>
          {generateDates().map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateCard,
                selectedDate === date && styles.selectedDate,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={styles.dateDay}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
              <Text style={styles.dateNumber}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.sectionTitle}>Select Time</Text>
      <View style={styles.timeContainer}>
        {timeSlots.map((time, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.timeCard,
              selectedTime === time && styles.selectedTime,
            ]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={[
              styles.time,
              selectedTime === time && styles.selectedTimeText,
            ]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => {
          navigation.navigate('Appointments');
        }}
      >
        <Text style={styles.bookButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorName: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dateCard: {
    width: 70,
    height: 80,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDate: {
    backgroundColor: '#4A90E2',
  },
  dateDay: {
    fontSize: 14,
    color: '#666',
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeCard: {
    width: '30%',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedTime: {
    backgroundColor: '#4A90E2',
  },
  time: {
    color: '#333',
  },
  selectedTimeText: {
    color: '#fff',
  },
  bookButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;