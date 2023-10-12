// QuantityCounter.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const QuantityCounter = ({ quantity, onIncrement, onDecrement }) => {
  return (
    <View>
      <Button title="-" onPress={onDecrement} />
      <Text>{quantity}</Text>
      <Button title="+" onPress={onIncrement} />
    </View>
  );
};

export default QuantityCounter;
