// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import * as Location from 'expo-location';

// interface TrackingData {
//   id: string;
//   status: string;
//   pickupAddress: string;
//   deliveryAddress: string;
//   driverName: string;
//   estimatedArrival: string;
//   currentLocation: {
//     latitude: number;
//     longitude: number;
//   };
//   route: {
//     latitude: number;
//     longitude: number;
//   }[];
// }

// export default function ShipmentTrack({ route }: any) {
//   const deliveryId = route?.params?.deliveryId || '1';
//   const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);

//   useEffect(() => {
//     loadTrackingData();
//     getCurrentLocation();
//   }, []);

//   const getCurrentLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location permission is required to show your position on the map');
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({});
//       setUserLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//     } catch (error) {
//       console.error('Error getting location:', error);
//     }
//   };

//   const loadTrackingData = async () => {
//     try {
//       // In a real app, this would fetch from your API
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
//       // Mock tracking data
//       const mockData: TrackingData = {
//         id: deliveryId,
//         status: 'in_transit',
//         pickupAddress: '123 Main St, City',
//         deliveryAddress: '456 Oak Ave, City',
//         driverName: 'John Smith',
//         estimatedArrival: '2024-01-15T16:30:00Z',
//         currentLocation: {
//           latitude: 37.78825,
//           longitude: -122.4324,
//         },
//         route: [
//           { latitude: 37.78825, longitude: -122.4324 },
//           { latitude: 37.78925, longitude: -122.4314 },
//           { latitude: 37.79025, longitude: -122.4304 },
//           { latitude: 37.79125, longitude: -122.4294 },
//         ],
//       };
      
//       setTrackingData(mockData);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load tracking data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return '#f59e0b';
//       case 'in_transit':
//         return '#3b82f6';
//       case 'delivered':
//         return '#10b981';
//       case 'cancelled':
//         return '#ef4444';
//       default:
//         return '#6b7280';
//     }
//   };

//   const formatStatus = (status: string) => {
//     return status.replace('_', ' ').toUpperCase();
//   };

//   if (isLoading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loading}>
//           <ActivityIndicator size="large" color="#3b82f6" />
//           <Text>Loading tracking information...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (!trackingData) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.error}>
//           <Text style={styles.errorText}>Tracking data not available</Text>
//           <TouchableOpacity
//             style={styles.retryButton}
//             onPress={loadTrackingData}
//           >
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   const initialRegion = {
//     latitude: trackingData.currentLocation.latitude,
//     longitude: trackingData.currentLocation.longitude,
//     latitudeDelta: 0.01,
//     longitudeDelta: 0.01,
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView style={styles.content}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Track Delivery #{trackingData.id}</Text>
//           <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trackingData.status) }]}>
//             <Text style={styles.statusText}>{formatStatus(trackingData.status)}</Text>
//           </View>
//         </View>

//         <View style={styles.mapContainer}>
//           <MapView
//             style={styles.map}
//             initialRegion={initialRegion}
//             testID="map-view"
//           >
//             {/* Driver's current location */}
//             <Marker
//               coordinate={trackingData.currentLocation}
//               title="Driver Location"
//               description={`Driver: ${trackingData.driverName}`}
//               pinColor="#3b82f6"
//             />
            
//             {/* User's location if available */}
//             {userLocation && (
//               <Marker
//                 coordinate={userLocation}
//                 title="Your Location"
//                 pinColor="#10b981"
//               />
//             )}
            
//             {/* Route polyline */}
//             <Polyline
//               coordinates={trackingData.route}
//               strokeColor="#3b82f6"
//               strokeWidth={3}
//             />
//           </MapView>
//         </View>

//         <View style={styles.detailsContainer}>
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Driver:</Text>
//             <Text style={styles.detailValue}>{trackingData.driverName}</Text>
//           </View>
          
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>From:</Text>
//             <Text style={styles.detailValue}>{trackingData.pickupAddress}</Text>
//           </View>
          
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>To:</Text>
//             <Text style={styles.detailValue}>{trackingData.deliveryAddress}</Text>
//           </View>
          
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>ETA:</Text>
//             <Text style={styles.detailValue}>
//               {new Date(trackingData.estimatedArrival).toLocaleTimeString()}
//             </Text>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={styles.refreshButton}
//           onPress={loadTrackingData}
//           testID="button-refresh"
//         >
//           <Text style={styles.refreshButtonText}>Refresh Location</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//   },
//   content: {
//     flex: 1,
//   },
//   loading: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   error: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     color: '#6b7280',
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: '#3b82f6',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f2937',
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//   },
//   statusText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   mapContainer: {
//     height: 300,
//     margin: 20,
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   map: {
//     flex: 1,
//   },
//   detailsContainer: {
//     backgroundColor: '#fff',
//     margin: 20,
//     padding: 20,
//     borderRadius: 8,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f3f4f6',
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#6b7280',
//     fontWeight: '500',
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#1f2937',
//     fontWeight: '600',
//     flex: 1,
//     textAlign: 'right',
//   },
//   refreshButton: {
//     backgroundColor: '#3b82f6',
//     margin: 20,
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   refreshButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });