// CartScreen.js
import React from 'react';
import { Alert, View, Text, Button, FlatList, Image, StyleSheet } from 'react-native';
import { Client, Databases } from 'appwrite';
import 'react-native-get-random-values';
import {v4 as uuidv4} from "uuid"

const DATABASE_ID = '6532eaf0a394c74aeb32'
const COLLECTION_ID = '6533aad5270260d0d839'
const PROJECT_ID = '652fa3f6300f32d17993'

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

  const databases = new Databases(client);

//const ordersCollectionId = '6533aad5270260d0d839';

const CartScreen = ({ cart, setCart }) => {
  const cartItems = Object.values(cart);

  const handlePlaceOrder = () => {
    if (Object.keys(cart).length > 0) {
      // Display a simple notification
      const ordersData = cart

      
      
      let orderid = uuidv4()
      const addOrdersToAppwrite = () => {
        for (const orderID in ordersData) {
          const order = ordersData[orderID];
          console.log("first" + order)
          // Add each order to the orders collection
          const promise = databases.createDocument(
            DATABASE_ID,COLLECTION_ID,uuidv4(), {
              Order_id: orderid,
              Quantity: order.quantity,
              Name: order.Name,
              Image: order.Image,
              Price: order.Price
            }
          );
          console.log("second")
      
          promise.then(
            function (response) {
              console.log(response); // Success
            },
            function (error) {
              console.log(error); // Failure
            },
          );
      
        }
      };
      addOrdersToAppwrite()
      //console.log(cart)
      Alert.alert('Order Placed', 'Your order has been placed successfully');
    }
  };
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId]) {
        delete updatedCart[productId]; // Remove the item from the cart
      }
      return updatedCart;
    });
  };

  const handleDecrement = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId]) {
        if (updatedCart[productId].quantity > 1) {
          updatedCart[productId].quantity -= 1;
        } else {
          delete updatedCart[productId];
        }
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
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            {Image && <Image
              source={{ uri: item.Image }} // Use the product's image URL from the API
              style={styles.productImage}
            />}
            <View style={styles.itemDetails}>
              <Text style={styles.productTitle}>{item.Name}</Text>
              <Text style={styles.productPrice}>Price: Rs.{item.Price}</Text>
              <View style={styles.quantityAndRemoveContainer}>
                <View style={styles.quantityContainer}>
                  <Button
                    title="-"
                    onPress={() => handleDecrement(item.$id)}
                    style={styles.quantityButton}
                  />
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <Button
                    title="+"
                    onPress={() => handleIncrement(item.$id)}
                    style={styles.quantityButton}
                  />
                </View>
                <Button
                  title="Remove"
                  onPress={() => handleRemoveFromCart(item.$id)}
                  style={styles.removeFromCartButton}
                />
              </View>
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>Total: Rs.{calculateTotal(cartItems)}</Text>
      <Button title="Place Order" onPress={handlePlaceOrder} />
    </View>
  );
};

const calculateTotal = (cartItems) => {
  return cartItems.reduce((total, item) => total + item.Price * item.quantity, 0).toFixed(2);
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
