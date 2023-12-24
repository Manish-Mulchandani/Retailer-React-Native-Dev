import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Client, Account, ID} from 'appwrite';
import PhoneAuth from './screens/PhoneAuth';
import OTPPage from './screens/OTPPage';
import StackNavigator from './navigation/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [screen, setScreen] = useState('phone'); // 'phone' or 'otp'
  

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('652fa3f6300f32d17993'); // Replace with your Appwrite project ID

  const account = new Account(client);

  useEffect(() => {
    const loadPhoneNumber = async () => {
      try {
        const storedData = await AsyncStorage.getItem('phoneNumber');
        if (storedData) {
          const { number, timestamp } = JSON.parse(storedData);
          const expirationTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
          const currentTime = new Date().getTime();

          if (currentTime - timestamp < expirationTime) {
            setPhoneNumber(number);
            setScreen('page')
          } else {
            // Clear expired data
            AsyncStorage.removeItem('phoneNumber');
          }
        }
      } catch (error) {
        console.error('Error loading phone number:', error);
      }
    };

    loadPhoneNumber();
  }, []);

  return (
    <NavigationContainer>
      {screen === 'phone' ? (
        <PhoneAuth
          message={message}
          setMessage={setMessage}
          setUserId={setUserId}
          account={account}
          setScreen={setScreen}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
      ) : screen === 'otp' ? (
        <OTPPage
          message={message}
          setMessage={setMessage}
          account={account}
          setScreen={setScreen}
          userId={userId}
        />
      ) : (
        <StackNavigator
          phoneNumber={phoneNumber}
        />
      )}
    </NavigationContainer>
  );
};

export default App;
