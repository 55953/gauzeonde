import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '../../../contexts/AuthContext';

interface Delivery {
  id: string;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  totalAmount: number;
  createdAt: string;
}

export default function SenderDashboard() {
  const navigation = useNavigation<any>();
  const { session } = useSession();

  // In a real app, this would fetch from your API
  const { data: deliveries = [], isLoading } = useQuery<Delivery[]>({
    queryKey: ['deliveries', 'sender'],
    queryFn: async () => {
      // Mock data for now
      return [
        {
          id: '1',
          status: 'in_transit',
          pickupAddress: '123 Main St',
          deliveryAddress: '456 Oak Ave',
          totalAmount: 25.99,
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          status: 'delivered',
          pickupAddress: '789 Pine St',
          deliveryAddress: '321 Elm St',
          totalAmount: 18.50,
          createdAt: '2024-01-14T15:30:00Z',
        },
      ];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'in_transit':
        return '#3b82f6';
      case 'delivered':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Sender Dashboard</Text>
          <Text style={styles.subtitle}>
            Welcome, {session?.user?.name || 'Sender'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.requestButton}
          onPress={() => navigation.navigate('RequestDelivery')}
          testID="button-new-delivery"
        >
          <Text style={styles.requestButtonText}>+ New Delivery Request</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Deliveries</Text>
          
          {isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text>Loading deliveries...</Text>
            </View>
          ) : deliveries.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No deliveries found</Text>
              <Text style={styles.emptySubtext}>
                Start by requesting your first delivery!
              </Text>
            </View>
          ) : (
            deliveries.map((delivery) => (
              <TouchableOpacity
                key={delivery.id}
                style={styles.deliveryCard}
                onPress={() => navigation.navigate('TrackDelivery', { deliveryId: delivery.id })}
                testID={`delivery-${delivery.id}`}
              >
                <View style={styles.deliveryHeader}>
                  <Text style={styles.deliveryId}>#{delivery.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(delivery.status) }]}>
                    <Text style={styles.statusText}>{formatStatus(delivery.status)}</Text>
                  </View>
                </View>
                
                <Text style={styles.addressText} numberOfLines={1}>
                  From: {delivery.pickupAddress}
                </Text>
                <Text style={styles.addressText} numberOfLines={1}>
                  To: {delivery.deliveryAddress}
                </Text>
                
                <View style={styles.deliveryFooter}>
                  <Text style={styles.amountText}>${delivery.totalAmount.toFixed(2)}</Text>
                  <Text style={styles.dateText}>
                    {new Date(delivery.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
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
  requestButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  loading: {
    alignItems: 'center',
    padding: 32,
  },
  empty: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  deliveryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});