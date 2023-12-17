import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Client, Account, ID} from 'appwrite';
import PhoneAuth from './screens/PhoneAuth';
import OTPPage from './screens/OTPPage';
import StackNavigator from './navigation/StackNavigator';

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [screen, setScreen] = useState('phone'); // 'phone' or 'otp'
  const [cart, setCart] = React.useState({});

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('652fa3f6300f32d17993'); // Replace with your Appwrite project ID

  const account = new Account(client);

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
          cart={cart}
          setCart={setCart}
          phoneNumber={phoneNumber}
        />
      )}
    </NavigationContainer>
  );
};

export default App;
