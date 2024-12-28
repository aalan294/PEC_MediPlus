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

const MessageScreen = ({ navigation }) => {
  const messages = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      lastMessage: 'Your appointment has been confirmed for tomorrow at 2:30 PM',
      time: '2:30 PM',
      unread: 2,
      image: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg',
      online: true,
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialty: 'Pediatrics',
      lastMessage: 'Please bring your previous medical records',
      time: '11:45 AM',
      unread: 0,
      image: 'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg',
      online: false,
    },
    {
      id: 3,
      doctorName: 'Dr. Emily Wilson',
      specialty: 'Neurology',
      lastMessage: 'How are you feeling after the treatment?',
      time: 'Yesterday',
      unread: 1,
      image: 'https://img.freepik.com/free-photo/medium-shot-doctor-with-stethoscope_23-2148869134.jpg',
      online: true,
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
          Messages
        </Animatable.Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchBar}>
            <Icon name="search" size={24} color="#666" />
            <Text style={styles.searchText}>Search messages...</Text>
          </TouchableOpacity>
        </View>

        <Animatable.View animation="fadeInUp" style={styles.messagesList}>
          {messages.map((message, index) => (
            <Animatable.View 
              key={message.id}
              animation="fadeInUp"
              delay={index * 100}
            >
              <TouchableOpacity
                style={styles.messageCard}
                onPress={() => navigation.navigate('Chat', { doctor: message })}
              >
                <View style={styles.messageContent}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: message.image }}
                      style={styles.avatar}
                    />
                    {message.online && <View style={styles.onlineIndicator} />}
                  </View>
                  <View style={styles.messageInfo}>
                    <View style={styles.messageHeader}>
                      <Text style={styles.doctorName}>{message.doctorName}</Text>
                      <Text style={styles.messageTime}>{message.time}</Text>
                    </View>
                    <Text style={styles.specialty}>{message.specialty}</Text>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                      {message.lastMessage}
                    </Text>
                  </View>
                  {message.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>{message.unread}</Text>
                    </View>
                  )}
                </View>
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
          <Icon name="calendar-today" size={24} color="#666" />
          <Text style={styles.navText}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Messages')}
        >
          <Icon name="chat" size={24} color="#4A90E2" />
          <Text style={[styles.navText, { color: '#4A90E2' }]}>Messages</Text>
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
        onPress={() => navigation.navigate('NewMessage')}
      >
        <LinearGradient
          colors={['#4A90E2', '#357ABD']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon name="edit" size={24} color="#FFF" />
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
  },
  searchContainer: {
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  messagesList: {
    paddingHorizontal: 20,
  },
  messageCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  messageInfo: {
    flex: 1,
    marginLeft: 15,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  specialty: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#4A90E2',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
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

export default MessageScreen;
