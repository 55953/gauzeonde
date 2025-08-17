import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useSession } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { session, logout } = useSession();
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    await logout();
  };

  const navigateToDashboard = () => {
    switch (session?.user?.role) {
      case 'sender':
        navigation.navigate('(sender)');
        break;
      case 'driver':
        navigation.navigate('(driver)');
        break;
      case 'admin':
        navigation.navigate('(admin)');
        break;
      default:
        navigation.navigate('(sender)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Welcome, {session?.user?.name || session?.user?.email}!
          </Text>
          <Text style={styles.roleText}>
            Role: {session?.user?.role || 'sender'}
          </Text>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={navigateToDashboard}
            testID="button-dashboard"
          >
            <Text style={styles.actionTitle}>Dashboard</Text>
            <Text style={styles.actionSubtitle}>
              View your {session?.user?.role || 'sender'} dashboard
            </Text>
          </TouchableOpacity>

          {session?.user?.role === 'sender' && (
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('RequestDelivery')}
              testID="button-request-delivery"
            >
              <Text style={styles.actionTitle}>Request Delivery</Text>
              <Text style={styles.actionSubtitle}>
                Book a new delivery service
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('TrackDelivery')}
            testID="button-track-delivery"
          >
            <Text style={styles.actionTitle}>Track Delivery</Text>
            <Text style={styles.actionSubtitle}>
              Monitor your active deliveries
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  roleText: {
    fontSize: 16,
    color: '#6b7280',
  },
  actionGrid: {
    marginBottom: 32,
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});