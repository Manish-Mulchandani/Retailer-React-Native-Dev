// components/OTPPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const OTPPage = ({ message, setMessage, account, setScreen, userId }) => {
  const [verificationCode, setVerificationCode] = useState('');

  async function updatePhoneSession() {
    try {
      await account.updatePhoneSession(userId, verificationCode);
      setMessage('Phone session updated successfully. User is authenticated.');
      setScreen('authenticated'); // Switch to the Authenticated screen
    } catch (error) {
      setMessage('Error updating phone session');
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Code</Text>
      <Text style={styles.message}>{message}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Verification Code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="numeric"
      />
      <Button title="Verify Code" onPress={updatePhoneSession} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007BFF',
  },
  message: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#007BFF',
    borderWidth: 2,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
  },
});

export default OTPPage;
