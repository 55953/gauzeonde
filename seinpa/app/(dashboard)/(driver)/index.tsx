import React, { use, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { ShipmentApi, DriverApi } from '@api/api';
import { useSession } from '../../../contexts/AuthContext';

import { GoogleMap, Marker, Polyline, useJsApiLoader, MarkerClusterer } from "@react-google-maps/api";
import Maps from '../../../components/Maps';
import type { MarkerItem } from '@components/Maps.types';

interface DriverDelivery {
  id: string;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  packageType: string;
  customerName: string;
  amount: number;
}

export default function DriverDashboardScreen() {
  const { session } = useSession();
  const [isOnline, setIsOnline] = useState(false);

  //const { data: shipments = [], isLoading } = () => ShipmentApi.getAllByDriverId<DriverDelivery[]>({
     //driverId: session?.user?.id}){
      // Mock data for driver shipments
      //return [
      const { data: shipments = [], isLoading } = [
        {
          id: '1',
          status: 'assigned',
          pickupAddress: '123 Main St',
          deliveryAddress: '456 Oak Ave',
          packageType: 'Electronics',
          customerName: 'Jane Doe',
          amount: 25.99,
        },
      ];
  //  },
  //});
  useEffect(() => {
    checkDriverOnline();
  }, [session?.token]);

  const checkDriverOnline = async () => {
    try {
        await DriverApi.getOnline()
        .then(response =>{
          console.log("Driver online status:", response.data);
          setIsOnline(response.data.online);
        })
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const toggleOnlineStatus = async () => {
    await DriverApi.setOnline(!isOnline)
    .then(response => {
      console.log("the response:", response);
      setIsOnline(!isOnline);
    });
  };

  const center = { lat: 38.8951, lng: -77.0364 };
  const markers: MarkerItem[] = [
    { id: 1, position: center, title: "You" }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          {/*  */}
          <Text style={styles.title}>
            Welcome, <Text style={styles.subtitle}>{session?.user?.name || 'Driver'} 👋 Role: {session?.user?.role}</Text>
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Today's shipments</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$284.50</Text>
            <Text style={styles.statLabel}>Today's Earnings</Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Online Status</Text>
            <Switch
              value={isOnline}
              onValueChange={toggleOnlineStatus}
              trackColor={{ false: '#767577', true: '#10b981' }}
              thumbColor={isOnline ? '#fff' : '#f4f3f4'}
              testID="switch-online-status"
            />
          </View>
          <Text style={styles.statusText}>
            {isOnline ? 'You are online and available for shipments' : 'You are offline'}
          </Text>
        </View>
        { isOnline ? (
        <View style={styles.mapSection}>
          <Maps
            center={center}
            zoom={12} // used on web only
            markers={markers}
            googleMapsApiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}
          />
        </View>
        ) : null }
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active shipments</Text>
          
          {isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text>Loading shipments...</Text>
            </View>
          ) : shipments.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No active shipments</Text>
              <Text style={styles.emptySubtext}>
                {isOnline ? 'Waiting for new delivery assignments...' : 'Go online to receive shipments'}
              </Text>
            </View>
          ) : (
            shipments.map((delivery) => (
              <View key={delivery.id} style={styles.deliveryCard}>
                <View style={styles.deliveryHeader}>
                  <Text style={styles.deliveryId}>#{delivery.id}</Text>
                  <Text style={styles.deliveryAmount}>${delivery.amount.toFixed(2)}</Text>
                </View>
                
                <Text style={styles.customerName}>Customer: {delivery.customerName}</Text>
                <Text style={styles.packageType}>Package: {delivery.packageType}</Text>
                <Text style={styles.addressText} numberOfLines={1}>
                  From: {delivery.pickupAddress}
                </Text>
                <Text style={styles.addressText} numberOfLines={1}>
                  To: {delivery.deliveryAddress}
                </Text>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    testID={`button-accept-${delivery.id}`}
                  >
                    <Text style={styles.actionButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineButton}
                    testID={`button-decline-${delivery.id}`}
                  >
                    <Text style={styles.actionButtonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    padding: 10,
  },
  mapSection: {
    flex: 1,
    minHeight: 400,
    backgroundColor: '#01081fe0',
    borderColor: '#01081fe0',
    borderWidth: 3,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
    marginBottom: 24,
    marginHorizontal: 10,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    color: '#6b7280',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  
  statusCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusText: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
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
    textAlign: 'center',
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
  deliveryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  customerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  packageType: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});