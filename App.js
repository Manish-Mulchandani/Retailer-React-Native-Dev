import * as React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [cart, setCart] = React.useState({});

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Products" options={{headerShown: false}}>
          {() => <ProductScreen cart={cart} setCart={setCart} />}
        </Tab.Screen>
        <Tab.Screen name="Cart" options={{headerShown: false}}>
          {() => <CartScreen cart={cart} setCart={setCart} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
