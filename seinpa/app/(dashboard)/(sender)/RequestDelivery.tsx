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

interface CostBreakdown {
  baseCost: number;
  weightCost: number;
  distanceCost: number;
  serviceFee: number;
  tax: number;
  total: number;
}

interface Driver {
  id: string;
  name: string;
  rating: number;
  vehicleType: string;
  estimatedArrival: string;
  distance: string;
  profileImage?: string;
  deliveriesCount: number;
}

export default function RequestDeliveryScreen() {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isFindingDrivers, setIsFindingDrivers] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<CostBreakdown | null>(null);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [step, setStep] = useState(1); // 1: Details, 2: Cost & Preferences, 3: Driver Selection, 4: Confirmation
  
  const [formData, setFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    packageDescription: '',
    weight: '',
    dimensions: '',
    deliveryPriority: 'standard',
    scheduledPickup: '',
    specialInstructions: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const calculateCost = async () => {
    const weight = parseFloat(formData.weight || '0');
    const { pickupAddress, deliveryAddress } = formData;
    
    if (weight > 0 && pickupAddress && deliveryAddress) {
      setIsCalculating(true);
      try {
        // Simulate API call for cost calculation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const baseCost = 25;
        const weightCost = weight * 0.5;
        const distanceCost = 40; // Mock distance calculation
        const serviceFee = 8.99;
        
        // Priority multiplier
        const priorityMultiplier = formData.deliveryPriority === 'express' ? 1.5 : 1;
        const adjustedCosts = (baseCost + weightCost + distanceCost) * priorityMultiplier;
        
        const tax = adjustedCosts * 0.08;
        const total = adjustedCosts + serviceFee + tax;
        
        setEstimatedCost({
          baseCost,
          weightCost,
          distanceCost: distanceCost * priorityMultiplier,
          serviceFee,
          tax,
          total,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to calculate cost. Please try again.');
      } finally {
        setIsCalculating(false);
      }
    } else {
      Alert.alert('Missing Information', 'Please fill in weight and addresses to calculate cost.');
    }
  };

  const generateMockDrivers = (): Driver[] => {
    const driverNames = ['John Smith', 'Maria Garcia', 'David Wilson', 'Sarah Chen', 'Mike Johnson', 'Lisa Taylor', 'Robert Brown', 'Jennifer Lee'];
    const vehicleTypes = ['Pickup Truck', 'Van', 'Box Truck', 'Cargo Van', 'Flatbed Truck'];
    
    const numDrivers = Math.floor(Math.random() * 6) + 3; // 3-8 drivers
    const drivers: Driver[] = [];
    
    for (let i = 0; i < numDrivers; i++) {
      drivers.push({
        id: `driver_${i + 1}`,
        name: driverNames[Math.floor(Math.random() * driverNames.length)],
        rating: 4.0 + Math.random() * 1.0, // 4.0-5.0 rating
        vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        estimatedArrival: `${5 + Math.floor(Math.random() * 20)} min`, // 5-25 minutes
        distance: `${(Math.random() * 3 + 0.5).toFixed(1)} mi`, // 0.5-3.5 miles
        deliveriesCount: Math.floor(Math.random() * 500) + 50, // 50-550 deliveries
      });
    }
    
    // Sort by rating (highest first)
    return drivers.sort((a, b) => b.rating - a.rating);
  };

  const findAvailableDrivers = async () => {
    setIsFindingDrivers(true);
    try {
      // Simulate API call to find drivers
      // await new Promise(resolve => setTimeout(resolve, 2000));
      // const drivers = generateMockDrivers();
      const drivers : Driver[] = await AuthApi.findDrivers(formData);

      setAvailableDrivers(drivers);
    } catch (error) {
      Alert.alert('Error', 'Failed to find drivers. Please try again.');
    } finally {
      setIsFindingDrivers(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate required fields for step 1
      if (!formData.pickupAddress || !formData.deliveryAddress || !formData.packageDescription || !formData.weight) {
        Alert.alert('Missing Information', 'Please fill in all required fields');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!estimatedCost) {
        Alert.alert('Calculate Cost', 'Please calculate the delivery cost first');
        return;
      }
      if (availableDrivers.length === 0) {
        Alert.alert('Find Drivers', 'Please find available drivers first');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!selectedDriver) {
        Alert.alert('Select Driver', 'Please select a driver for your delivery');
        return;
      }
      setStep(4);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to create delivery
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((stepNumber) => (
        <View key={stepNumber} style={styles.stepWrapper}>
          <View style={[
            styles.stepCircle,
            step >= stepNumber ? styles.stepActive : styles.stepInactive
          ]}>
            <Text style={[
              styles.stepText,
              step >= stepNumber ? styles.stepTextActive : styles.stepTextInactive
            ]}>
              {stepNumber}
            </Text>
          </View>
          <Text style={styles.stepLabel}>
            {stepNumber === 1 ? 'Details' : 
             stepNumber === 2 ? 'Cost & Prefs' : 
             stepNumber === 3 ? 'Select Driver' : 'Confirm'}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
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
        <Text style={styles.label}>Package Description *</Text>
        <TextInput
          style={styles.input}
          value={formData.packageDescription}
          onChangeText={(value) => handleInputChange('packageDescription', value)}
          placeholder="e.g., Electronics, Furniture, Documents"
          testID="input-package-description"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Weight (lbs) *</Text>
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
        <Text style={styles.label}>Dimensions (L x W x H)</Text>
        <TextInput
          style={styles.input}
          value={formData.dimensions}
          onChangeText={(value) => handleInputChange('dimensions', value)}
          placeholder="e.g., 12 x 8 x 6 inches"
          testID="input-dimensions"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.form}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cost Calculation</Text>
        {estimatedCost ? (
          <View style={styles.costBreakdown}>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Base Cost:</Text>
              <Text style={styles.costValue}>${estimatedCost.baseCost.toFixed(2)}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Weight ({formData.weight} lbs):</Text>
              <Text style={styles.costValue}>${estimatedCost.weightCost.toFixed(2)}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Distance:</Text>
              <Text style={styles.costValue}>${estimatedCost.distanceCost.toFixed(2)}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Service Fee:</Text>
              <Text style={styles.costValue}>${estimatedCost.serviceFee.toFixed(2)}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Tax:</Text>
              <Text style={styles.costValue}>${estimatedCost.tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.costRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${estimatedCost.total.toFixed(2)}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noCalculation}>Click "Calculate Cost" to see pricing</Text>
        )}
        
        <TouchableOpacity
          style={[styles.calculateButton, isCalculating && styles.buttonDisabled]}
          onPress={calculateCost}
          disabled={isCalculating}
          testID="button-calculate-cost"
        >
          {isCalculating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.calculateButtonText}>Calculate Cost</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Delivery Preferences</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityContainer}>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                formData.deliveryPriority === 'standard' && styles.priorityActive
              ]}
              onPress={() => handleInputChange('deliveryPriority', 'standard')}
              testID="button-priority-standard"
            >
              <Text style={[
                styles.priorityText,
                formData.deliveryPriority === 'standard' && styles.priorityTextActive
              ]}>
                Standard
              </Text>
              <Text style={styles.prioritySubtext}>1-2 days</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.priorityButton,
                formData.deliveryPriority === 'express' && styles.priorityActive
              ]}
              onPress={() => handleInputChange('deliveryPriority', 'express')}
              testID="button-priority-express"
            >
              <Text style={[
                styles.priorityText,
                formData.deliveryPriority === 'express' && styles.priorityTextActive
              ]}>
                Express
              </Text>
              <Text style={styles.prioritySubtext}>Same day (+50%)</Text>
            </TouchableOpacity>
          </View>
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

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Available Drivers</Text>
        {availableDrivers.length > 0 ? (
          <View style={styles.driversInfo}>
            <Text style={styles.driversCount}>{availableDrivers.length} drivers available</Text>
            <Text style={styles.driversSubtext}>Ready to pick up your package</Text>
          </View>
        ) : (
          <Text style={styles.noDrivers}>Click "Find Available Drivers" to check availability</Text>
        )}
        
        <TouchableOpacity
          style={[styles.findDriversButton, isFindingDrivers && styles.buttonDisabled]}
          onPress={findAvailableDrivers}
          disabled={isFindingDrivers}
          testID="button-find-drivers"
        >
          {isFindingDrivers ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.findDriversButtonText}>Find Available Drivers</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDriverCard = (driver: Driver) => (
    <TouchableOpacity
      key={driver.id}
      style={[
        styles.driverCard,
        selectedDriver?.id === driver.id && styles.driverCardSelected
      ]}
      onPress={() => setSelectedDriver(driver)}
      testID={`driver-card-${driver.id}`}
    >
      <View style={styles.driverInfo}>
        <View style={styles.driverHeader}>
          <View style={styles.driverNameRow}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>★ {driver.rating.toFixed(1)}</Text>
            </View>
          </View>
          <Text style={styles.driverVehicle}>{driver.vehicleType}</Text>
        </View>
        
        <View style={styles.driverDetails}>
          <View style={styles.driverDetail}>
            <Text style={styles.driverDetailLabel}>Arrival:</Text>
            <Text style={styles.driverDetailValue}>{driver.estimatedArrival}</Text>
          </View>
          <View style={styles.driverDetail}>
            <Text style={styles.driverDetailLabel}>Distance:</Text>
            <Text style={styles.driverDetailValue}>{driver.distance}</Text>
          </View>
          <View style={styles.driverDetail}>
            <Text style={styles.driverDetailLabel}>Deliveries:</Text>
            <Text style={styles.driverDetailValue}>{driver.deliveriesCount}</Text>
          </View>
        </View>
      </View>
      
      {selectedDriver?.id === driver.id && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderStep3 = () => (
    <View style={styles.form}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Your Driver</Text>
        {availableDrivers.length > 0 ? (
          <View style={styles.driversContainer}>
            <Text style={styles.driversInstructions}>
              Choose from {availableDrivers.length} available drivers near you
            </Text>
            {availableDrivers.map(renderDriverCard)}
          </View>
        ) : (
          <Text style={styles.noDriversFound}>
            No drivers found. Please go back and find available drivers first.
          </Text>
        )}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.form}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Delivery Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>From:</Text>
          <Text style={styles.summaryValue}>{formData.pickupAddress}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>To:</Text>
          <Text style={styles.summaryValue}>{formData.deliveryAddress}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Package:</Text>
          <Text style={styles.summaryValue}>{formData.packageDescription}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Weight:</Text>
          <Text style={styles.summaryValue}>{formData.weight} lbs</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Priority:</Text>
          <Text style={styles.summaryValue}>
            {formData.deliveryPriority === 'express' ? 'Express (Same day)' : 'Standard (1-2 days)'}
          </Text>
        </View>
        
        {selectedDriver && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Driver:</Text>
            <Text style={styles.summaryValue}>
              {selectedDriver.name} (★ {selectedDriver.rating.toFixed(1)})
            </Text>
          </View>
        )}
        
        {estimatedCost && (
          <View style={[styles.summaryRow, styles.totalSummaryRow]}>
            <Text style={styles.summaryTotalLabel}>Total Cost:</Text>
            <Text style={styles.summaryTotalValue}>${estimatedCost.total.toFixed(2)}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}
            testID="button-back"
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Request Delivery</Text>
          <Text style={styles.subtitle}>
            {step === 1 ? 'Fill in package details' : 
             step === 2 ? 'Calculate cost and set preferences' : 
             step === 3 ? 'Choose your driver' :
             'Review and confirm your delivery'}
          </Text>
        </View>

        {renderStepIndicator()}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        <View style={styles.buttonContainer}>
          {step < 4 ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              testID={`button-next-step-${step}`}
            >
              <Text style={styles.nextButtonText}>
                {step === 1 ? 'Continue to Cost & Preferences' : 
                 step === 2 ? 'Continue to Select Driver' : 
                 'Continue to Review'}
              </Text>
            </TouchableOpacity>
          ) : (
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
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}
            testID="button-back-cancel"
          >
            <Text style={styles.cancelButtonText}>
              {step > 1 ? 'Back' : 'Cancel'}
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
    marginBottom: 10,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
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
  
  // Step Indicator
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepActive: {
    backgroundColor: '#3b82f6',
  },
  stepInactive: {
    backgroundColor: '#e5e7eb',
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepTextActive: {
    color: '#fff',
  },
  stepTextInactive: {
    color: '#9ca3af',
  },
  stepLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  
  // Form
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
  
  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  
  // Cost Breakdown
  costBreakdown: {
    marginBottom: 20,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  totalRow: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    paddingVertical: 12,
  },
  costLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  costValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  noCalculation: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // Priority Selection
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  priorityActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  priorityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 4,
  },
  priorityTextActive: {
    color: '#3b82f6',
  },
  prioritySubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
  
  // Drivers Info
  driversInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  driversCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  driversSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  noDrivers: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // Driver Selection
  driversContainer: {
    gap: 12,
  },
  driversInstructions: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  driverCard: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverCardSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  driverInfo: {
    flex: 1,
  },
  driverHeader: {
    marginBottom: 8,
  },
  driverNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  ratingContainer: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  driverVehicle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  driverDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  driverDetail: {
    alignItems: 'center',
  },
  driverDetailLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  driverDetailValue: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  selectedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noDriversFound: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginVertical: 20,
  },
  
  // Summary
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  totalSummaryRow: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  summaryTotalLabel: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  summaryTotalValue: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  
  // Buttons
  buttonContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  nextButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calculateButton: {
    backgroundColor: '#7c3aed',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  findDriversButton: {
    backgroundColor: '#0891b2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  findDriversButtonText: {
    color: '#fff',
    fontSize: 14,
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
  buttonDisabled: {
    opacity: 0.6,
  },
});