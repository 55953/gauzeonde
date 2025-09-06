import React, { useState,  useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '../../../contexts/AuthContext';
import useMyShipments from '@hooks/useMyShipments';
import { SenderApi, ShipmentApi } from '@api/api';
import { Ionicons } from '@expo/vector-icons';
import { Shipment }  from 'types/index';


export default function SenderDashboardScreen() {
  const navigation = useNavigation<any>();

  const { session } = useSession(); // ensure user is set after login
  const { items, loading, err, load, refresh, hasMore } = useMyShipments();

  useEffect(() => {
    load(true); // initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const renderItem = ({ item }: any) => (
  //   <TouchableOpacity
  //     onPress={() => navigation.navigate('ShipmentDetail', { id: item.id })}
  //     style={{ padding: 12, borderBottomColor: '#eee', borderBottomWidth: 1 }}
  //   >
  //     <Text style={{ fontWeight: '700' }}>{item.origin} ➜ {item.destination}</Text>
  //     <Text>Status: {item.status} • {new Date(item.created_at).toLocaleString()}</Text>
  //     {item.tracking_number ? <Text>Tracking: {item.tracking_number}</Text> : null}
  //   </TouchableOpacity>
  // );

    // e.g., tabs: All | Pending | In Transit | Delivered
        // const [status, setStatus] = useState<string | undefined>(undefined);
        // const { items, load, refresh } = useMyShipments({ status });

        // useEffect(() => { load(true); }, [status]);




  // In a real app, this would fetch from your API
  // const { data: shipments = [], isLoading } = useQuery<Shipment[]>({
  //   queryKey: ['shipments', 'sender'],
  //   queryFn: async () => {
  //     if (!session?.user?.id) return [];
  //     const response = await SenderApi.getShipments<Shipment[]>({
  //       senderId: session.user.id,
  //     });
  //     return response.data;
  //   },
  // }, {
  //   enabled: !!session?.user?.id,
  // });
  // const { data: shipments = [], isLoading } = SenderApi.getShipments(session?.user?.sub || '1') || []

  //          [ {
  //             id: '1',
  //             status: 'in_transit',
  //             pickupAddress: '123 Main St',
  //             deliveryAddress: '456 Oak Ave',
  //             totalAmount: 25.99,
  //             createdAt: '2024-01-15T10:00:00Z',
  //           },
  //           {
  //             id: '2',
  //             status: 'delivered',
  //             pickupAddress: '789 Pine St',
  //             deliveryAddress: '321 Elm St',
  //             totalAmount: 18.50,
  //             createdAt: '2024-01-14T15:30:00Z',
  //           }];

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
            Welcome, {session?.user?.name || 'Sender'} 👋 Role: {session?.user?.role}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.requestButton}
          onPress={() => navigation.navigate('RequestDelivery')}
          testID="button-new-delivery"
        >
          <Text style={styles.requestButtonText}>+ Create a New Shipment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.requestButton}
          onPress={() => navigation.navigate('CreateShipment')}
          testID="button-new-delivery"
        >
          <Text style={styles.requestButtonText}>+ Create a New Shipment</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Shipments</Text>
          
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text>Loading shipments...</Text>
            </View>
          ) : items.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No shipments found</Text>
              <Text style={styles.emptySubtext}>
                Start by requesting your first shipment!
              </Text>
            </View>
          ) : (
            items.map((shipment) => (
              <TouchableOpacity
                key={shipment.id}
                style={styles.shipmentCard}
                onPress={() => navigation.navigate('TrackShipment', { shipmentId: shipment.id })}
                testID={`shipment-${shipment.id}`}
              >
                <View style={styles.shipmentHeader}>
                  <Text style={styles.shipmentId}>#{shipment.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(shipment.status) }]}>
                    <Text style={styles.statusText}>{formatStatus(shipment.status)}</Text>
                  </View>
                </View>
                
                <Text style={styles.addressText} numberOfLines={1}>
                  From: {shipment.pickupAddress}
                </Text>
                <Text style={styles.addressText} numberOfLines={1}>
                  To: {shipment.deliveryAddress}
                </Text>
                
                <View style={styles.shipmentFooter}>
                  <Text style={styles.amountText}>${shipment.totalAmount.toFixed(2)}</Text>
                  <Text style={styles.dateText}>
                    {new Date(shipment.createdAt).toLocaleDateString()}
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
  shipmentCard: {
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
  shipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shipmentId: {
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
  shipmentFooter: {
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