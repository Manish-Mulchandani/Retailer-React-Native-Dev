// components/PhoneAuth.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ID } from 'appwrite';

const PhoneAuth = ({
  message,
  setMessage,
  setUserId,
  account,
  setScreen,
  phoneNumber,
  setPhoneNumber,
}) => {
  async function createPhoneSession() {
    try {
      const sessionToken = await account.createPhoneSession(
        ID.unique(),
        "+91"+phoneNumber
      );
      setUserId(sessionToken.userId);
      setMessage('Verification code sent.');
      setScreen('otp'); // Switch to the OTP screen
    } catch (error) {
      setMessage('Error creating phone session');
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Number Verification</Text>
      <Text style={styles.message}>{message}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        value={phoneNumber}
        keyboardType="numeric"
        onChangeText={(text) =>
          setPhoneNumber(text)
        }
      />
      <Button
        title="Send Verification Code"
        onPress={createPhoneSession}
        disabled={phoneNumber.length !== 10}
      />
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

export default PhoneAuth;
