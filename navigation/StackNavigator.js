import {View, Text, useColorScheme} from 'react-native';
import React, {useEffect, useState} from 'react';
import ProductScreen from '../screens/ProductScreen';
import CartScreen from '../screens/CartScreen';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StackNavigator = ({phoneNumber}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [cart, setCart] = useState({});

  const Tab = createBottomTabNavigator();

  useEffect(() => {
    const loadCartData = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart !== null) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Error loading cart data:', error);
      }
    };

    loadCartData();
  }, []);

  useEffect(() => {
    const saveCartData = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart data:', error);
      }
    };

    saveCartData();
  }, [cart]);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Products" options={{headerShown: false}}>
        {() => <ProductScreen cart={cart} setCart={setCart} />}
      </Tab.Screen>
      <Tab.Screen name="Cart" options={{headerShown: false}}>
        {() => (
          <CartScreen cart={cart} setCart={setCart} phoneNumber={phoneNumber} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default StackNavigator;
