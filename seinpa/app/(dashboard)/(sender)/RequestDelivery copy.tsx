import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RequestDelivery() {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    packageType: '',
    weight: '',
    specialInstructions: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.pickupAddress || !formData.deliveryAddress || !formData.packageType) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would make an API call to create the delivery request
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      Alert.alert(
        'Success',
        'Delivery request submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit delivery request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Request Delivery</Text>
          <Text style={styles.subtitle}>Fill in the details for your delivery</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pickup Address *</Text>
            <TextInput
              style={styles.input}
              value={formData.pickupAddress}
              onChangeText={(value) => handleInputChange('pickupAddress', value)}
              placeholder="Enter pickup address"
              testID="input-pickup-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Delivery Address *</Text>
            <TextInput
              style={styles.input}
              value={formData.deliveryAddress}
              onChangeText={(value) => handleInputChange('deliveryAddress', value)}
              placeholder="Enter delivery address"
              testID="input-delivery-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Package Type *</Text>
            <TextInput
              style={styles.input}
              value={formData.packageType}
              onChangeText={(value) => handleInputChange('packageType', value)}
              placeholder="e.g., Electronics, Furniture, Documents"
              testID="input-package-type"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={formData.weight}
              onChangeText={(value) => handleInputChange('weight', value)}
              placeholder="Enter approximate weight"
              keyboardType="numeric"
              testID="input-weight"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Special Instructions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.specialInstructions}
              onChangeText={(value) => handleInputChange('specialInstructions', value)}
              placeholder="Any special handling instructions"
              multiline
              numberOfLines={4}
              testID="input-instructions"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            testID="button-submit-request"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Request</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            testID="button-cancel"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: 'bold',
  },
});