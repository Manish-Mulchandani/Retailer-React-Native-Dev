import {View, Text, useColorScheme} from 'react-native';
import React from 'react';
import ProductScreen from '../screens/ProductScreen';
import CartScreen from '../screens/CartScreen';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const StackNavigator = ({cart, setCart, phoneNumber}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const Tab = createBottomTabNavigator();
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
