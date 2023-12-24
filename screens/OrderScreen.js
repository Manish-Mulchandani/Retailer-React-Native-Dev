import { View, Text, useColorScheme } from 'react-native'
import React from 'react'

const OrderScreen = ({phoneNumber}) => {

    const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[{ backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <Text>{phoneNumber}</Text>
      <Text>Previous Orders:</Text>
      
    </View>
  )
}

export default OrderScreen