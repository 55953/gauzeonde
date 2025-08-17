// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { CardField, useStripe } from '@stripe/stripe-react-native';
// import { useNavigation } from '@react-navigation/native';

// export default function PaymentScreen({ route }: any) {
//   const navigation = useNavigation<any>();
//   const stripe = useStripe();
//   const [isLoading, setIsLoading] = useState(false);
//   const [cardComplete, setCardComplete] = useState(false);
  
//   // Mock data - in real app, this would come from route params
//   const deliveryDetails = route?.params?.deliveryDetails || {
//     id: '1',
//     amount: 25.99,
//     pickupAddress: '123 Main St',
//     deliveryAddress: '456 Oak Ave',
//     packageType: 'Electronics',
//   };

//   const handlePayment = async () => {
//     if (!stripe || !cardComplete) {
//       Alert.alert('Error', 'Please complete the card details');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // In a real app, you would:
//       // 1. Create payment intent on your server
//       // 2. Confirm payment with Stripe
//       // 3. Handle the result
      
//       // Mock payment process
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       Alert.alert(
//         'Payment Successful',
//         `Your payment of $${deliveryDetails.amount.toFixed(2)} has been processed successfully.`,
//         [
//           {
//             text: 'OK',
//             onPress: () => navigation.goBack(),
//           },
//         ]
//       );
//     } catch (error) {
//       Alert.alert('Payment Failed', 'Please try again or use a different payment method.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView style={styles.content}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Payment</Text>
//           <Text style={styles.subtitle}>Complete your delivery payment</Text>
//         </View>

//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryTitle}>Delivery Summary</Text>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Delivery ID:</Text>
//             <Text style={styles.summaryValue}>#{deliveryDetails.id}</Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Package Type:</Text>
//             <Text style={styles.summaryValue}>{deliveryDetails.packageType}</Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>From:</Text>
//             <Text style={styles.summaryValue} numberOfLines={1}>
//               {deliveryDetails.pickupAddress}
//             </Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>To:</Text>
//             <Text style={styles.summaryValue} numberOfLines={1}>
//               {deliveryDetails.deliveryAddress}
//             </Text>
//           </View>
//           <View style={[styles.summaryRow, styles.totalRow]}>
//             <Text style={styles.totalLabel}>Total Amount:</Text>
//             <Text style={styles.totalValue}>${deliveryDetails.amount.toFixed(2)}</Text>
//           </View>
//         </View>

//         <View style={styles.paymentCard}>
//           <Text style={styles.paymentTitle}>Payment Details</Text>
//           <CardField
//             postalCodeEnabled={true}
//             placeholders={{
//               number: '4242 4242 4242 4242',
//             }}
//             cardStyle={styles.cardField}
//             style={styles.cardFieldContainer}
//             onCardChange={(cardDetails) => {
//               setCardComplete(cardDetails.complete);
//             }}
//             testID="card-field"
//           />
//         </View>

//         <TouchableOpacity
//           style={[styles.payButton, (!cardComplete || isLoading) && styles.buttonDisabled]}
//           onPress={handlePayment}
//           disabled={!cardComplete || isLoading}
//           testID="button-pay"
//         >
//           {isLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.payButtonText}>
//               Pay ${deliveryDetails.amount.toFixed(2)}
//             </Text>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.cancelButton}
//           onPress={() => navigation.goBack()}
//           testID="button-cancel"
//         >
//           <Text style={styles.cancelButtonText}>Cancel</Text>
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
//     padding: 20,
//   },
//   header: {
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6b7280',
//   },
//   summaryCard: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 8,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   summaryTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 16,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f3f4f6',
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: '#6b7280',
//   },
//   summaryValue: {
//     fontSize: 14,
//     color: '#1f2937',
//     fontWeight: '500',
//     flex: 1,
//     textAlign: 'right',
//   },
//   totalRow: {
//     borderBottomWidth: 0,
//     borderTopWidth: 2,
//     borderTopColor: '#e5e7eb',
//     marginTop: 8,
//     paddingTop: 16,
//   },
//   totalLabel: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1f2937',
//   },
//   totalValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#10b981',
//   },
//   paymentCard: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 8,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   paymentTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 16,
//   },
//   cardFieldContainer: {
//     height: 50,
//     marginVertical: 8,
//   },
//   cardField: {
//     backgroundColor: '#f9fafb',
//     borderColor: '#d1d5db',
//     borderWidth: 1,
//     borderRadius: 8,
//     fontSize: 16,
//   },
//   payButton: {
//     backgroundColor: '#3b82f6',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   payButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   cancelButton: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: '#6b7280',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });