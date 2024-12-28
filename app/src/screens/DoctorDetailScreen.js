import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DoctorDetailScreen = ({ route, navigation }) => {
  const { doctor } = route.params;

  const scheduleInfo = {
    availability: 'Mon - Fri',
    timing: '09:00 AM - 05:00 PM',
    consultationFee: '$100',
  };

  const reviews = [
    {
      id: 1,
      name: 'John Smith',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Excellent doctor, very thorough and professional.',
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      rating: 4,
      date: '1 month ago',
      comment: 'Great experience, would recommend to others.',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={doctor.image} style={styles.doctorImage} />
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} color="#FFD700" />
          <Text style={styles.rating}>{doctor.rating}</Text>
          <Text style={styles.reviews}>({reviews.length} reviews)</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>
          {doctor.name} is a highly qualified {doctor.specialty} specialist with {doctor.experience} of experience. 
          Specializing in various conditions and treatments related to {doctor.specialty.toLowerCase()}.
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Schedule Info</Text>
        <View style={styles.scheduleItem}>
          <Icon name="event" size={20} color="#4A90E2" />
          <Text style={styles.scheduleText}>Available: {scheduleInfo.availability}</Text>
        </View>
        <View style={styles.scheduleItem}>
          <Icon name="access-time" size={20} color="#4A90E2" />
          <Text style={styles.scheduleText}>Timing: {scheduleInfo.timing}</Text>
        </View>
        <View style={styles.scheduleItem}>
          <Icon name="attach-money" size={20} color="#4A90E2" />
          <Text style={styles.scheduleText}>Consultation Fee: {scheduleInfo.consultationFee}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Patient Reviews</Text>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.name}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, index) => (
                <Icon
                  key={index}
                  name="star"
                  size={16}
                  color={index < review.rating ? '#FFD700' : '#ddd'}
                />
              ))}
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate('Booking', { doctor })}
      >
        <Text style={styles.bookButtonText}>Book Appointment</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  specialty: {
    fontSize: 16,
    color: '#4A90E2',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviews: {
    marginLeft: 5,
    color: '#666',
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  reviewCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewDate: {
    color: '#666',
  },
  reviewComment: {
    marginTop: 5,
    color: '#666',
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: '#4A90E2',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DoctorDetailScreen;