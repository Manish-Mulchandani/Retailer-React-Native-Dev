// CartScreen.js
import React from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet } from 'react-native';

const CartScreen = ({ cart, setCart }) => {
  const cartItems = Object.values(cart);

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId]) {
        delete updatedCart[productId]; // Remove the item from the cart
      }
      return updatedCart;
    });
  };

  const handleIncrement = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId]) {
        updatedCart[productId].quantity += 1;
      }
      return updatedCart;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.cartTitle}>Cart Items</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image
              source={{ uri: item.image }} // Use the product's image URL from the API
              style={styles.productImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>Price: ${item.price.toFixed(2)}</Text>
              <View style={styles.quantityAndRemoveContainer}>
                <View style={styles.quantityContainer}>
                  <Button
                    title="-"
                    onPress={() => handleRemoveFromCart(item.id)}
                    style={styles.quantityButton}
                  />
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <Button
                    title="+"
                    onPress={() => handleIncrement(item.id)}
                    style={styles.quantityButton}
                  />
                </View>
                <Button
                  title="Remove"
                  onPress={() => handleRemoveFromCart(item.id)}
                  style={styles.removeFromCartButton}
                />
              </View>
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>Total: ${calculateTotal(cartItems)}</Text>
      <Button title="Place Order" /*onPress={() => /* Implement place order logic }*/ style={styles.placeOrderButton} />
    </View>
  );
};

const calculateTotal = (cartItems) => {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
  },
  quantityAndRemoveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20, // Make the buttons round
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  removeFromCartButton: {
    backgroundColor: 'red', // Customize the color as needed
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  placeOrderButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
  },
});

export default CartScreen;
