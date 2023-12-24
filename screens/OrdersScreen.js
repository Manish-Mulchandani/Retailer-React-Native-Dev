import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OrderScreenCheck from './OrderScreenCheck';
import OrderDetailsCheck from './OrderDetailsCheck';

const Stack = createStackNavigator();

const OrdersScreen = ({phoneNumber}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="OrderScreenCheck" options={{headerShown: false}}>
        {() => <OrderScreenCheck phoneNumber={phoneNumber}/>}
      </Stack.Screen>
      <Stack.Screen name="OrderDetailsCheck" component={OrderDetailsCheck} />
      {/* Add more screens within the Order Details navigator if needed */}
    </Stack.Navigator>
  );
};

export default OrdersScreen;

{/* <Tab.Screen name="Products" options={{headerShown: false}}>
        {() => <ProductScreen cart={cart} setCart={setCart} />}
      </Tab.Screen> */}