// CartScreen.js
import React, { useEffect, useState } from 'react';
import { Alert, View, Text, Button, FlatList, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Client, Databases } from 'appwrite';
import 'react-native-get-random-values';
import {v4 as uuidv4} from "uuid"
import Clipboard from '@react-native-clipboard/clipboard';

const DATABASE_ID = '6532eaf0a394c74aeb32'
const COLLECTION_ID = '6533aad5270260d0d839'
const PROJECT_ID = '652fa3f6300f32d17993'

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

  const databases = new Databases(client);

const CartScreen = ({ cart, setCart }) => {
  const cartItems = Object.values(cart);
  const [idToCopy, setIdToCopy] = useState('Place Order before Copying OrderId')
  //const [isModalVisible, setModalVisible] = useState(false);

  // const handleCopyId = async () => {
  //   Clipboard.setString('Hello')
  //   console.log(idToCopy)
  //   const text= await Clipboard.getString();

  //   setModalVisible(false); // Close the pop-up after copying
  // };

  const handleCopyId = () => {
    Clipboard.setString(idToCopy);
    console.log('ID copied to clipboard');
    Alert.alert('ID Copied', 'ID Copied. Send this to the Wholesaler');
  }

  const handlePlaceOrder = () => {
    if (Object.keys(cart).length > 0) {
      // Display a simple notification
      const ordersData = cart

      
      
      let orderid = uuidv4()
      setIdToCopy(orderid)
      //setModalVisible(true)
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
      //setModalVisible(true)
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
              source={{ uri: `${item.Image}&output=webp` }} // Use the product's image URL from the API
              style={styles.productImage}
              resizeMode='contain'
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
      <View style={styles.buttonContainer}>
      <Button style={styles.placeOrderButton} title="Place Order" onPress={handlePlaceOrder} />
      <Button style={styles.placeOrderButton} title="Copy ID" onPress={handleCopyId} />
      </View>
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
    backgroundColor: '#F5F5F5', // Set the background color
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Dark text color
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    elevation: 2, // Add a subtle shadow (for Android)
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8, // Make the image round
  },
  itemDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222', // Slightly darker text color
  },
  productPrice: {
    fontSize: 16,
    color: '#555', // Dark gray text color
  },
  quantityAndRemoveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  removeFromCartButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8, // Make the button round
    color: 'white', // Text color
    fontWeight: 'bold',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  placeOrderButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8, // Make the button round
    color: 'white', // Text color
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Use 'space-between' to add space between the buttons
    marginTop: 20, // Adjust the margin as needed
  },
  
});



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   cartTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   cartItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   productImage: {
//     width: 80,
//     height: 80,
//     marginRight: 10,
//   },
//   itemDetails: {
//     flex: 1,
//   },
//   productTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   productPrice: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   quantityAndRemoveContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   quantityButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20, // Make the buttons round
//   },
//   quantityText: {
//     fontSize: 16,
//     marginHorizontal: 10,
//   },
//   removeFromCartButton: {
//     backgroundColor: 'red', // Customize the color as needed
//   },
//   total: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//   },
//   placeOrderButton: {
//     marginTop: 10,
//     backgroundColor: '#007BFF',
//   },
// });

export default CartScreen;
