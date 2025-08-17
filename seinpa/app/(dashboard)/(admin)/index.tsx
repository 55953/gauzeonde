import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useSession } from '../../../contexts/AuthContext';
import TabLayout from "../../../components/TabLayout";

export default function AdminDashboard() {
  const { session } = useSession();

  const stats = {
    totalDeliveries: 1250,
    activeDrivers: 45,
    totalRevenue: 25600.50,
    pendingDeliveries: 23,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>
            Welcome, {session?.user?.name || 'Admin'} 👋 Role : {session?.user?.role}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalDeliveries}</Text>
            <Text style={styles.statLabel}>Total Deliveries</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.activeDrivers}</Text>
            <Text style={styles.statLabel}>Active Drivers</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${stats.totalRevenue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.pendingDeliveries}</Text>
            <Text style={styles.statLabel}>Pending Deliveries</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} testID="button-manage-users">
            <Text style={styles.actionButtonText}>Manage Users</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} testID="button-view-deliveries">
            <Text style={styles.actionButtonText}>View All Deliveries</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} testID="button-driver-management">
            <Text style={styles.actionButtonText}>Driver Management</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} testID="button-reports">
            <Text style={styles.actionButtonText}>Reports & Analytics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TabLayout/>
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
    marginBottom: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
});