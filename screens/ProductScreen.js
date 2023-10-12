// ProductScreen.js
import React, { useEffect, useState } from 'react';
import { TextInput,View, Text, Button, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchProducts } from '../api';

const ProductScreen = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchProducts()
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleIncrement = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[product.id]) {
        updatedCart[product.id].quantity += 1;
      } else {
        updatedCart[product.id] = { ...product, quantity: 1 };
      }
      return updatedCart;
    });
  };

  const handleDecrement = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[product.id] && updatedCart[product.id].quantity > 1) {
        updatedCart[product.id].quantity -= 1;
      } else {
        delete updatedCart[product.id];
      }
      return updatedCart;
    });
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search products..."
        onChangeText={(text) => setSearchText(text)}
        style={styles.searchInput}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image
              source={{ uri: item.image }} // Use the product's image URL from the API
              style={styles.productImage}
            />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>Price: ${item.price.toFixed(2)}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleDecrement(item)}>
                <View style={styles.roundButton}>
                  <Text style={styles.roundButtonText}>-</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.quantityText}>
                {cart[item.id] ? cart[item.id].quantity : 0}
              </Text>
              <TouchableOpacity onPress={() => handleIncrement(item)}>
                <View style={styles.roundButton}>
                  <Text style={styles.roundButtonText}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  productItem: {
    marginBottom: 20,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20, // Make the buttons round
    borderWidth: 1,
    borderColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButtonText: {
    fontSize: 20,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 20, // Increase the margin for separation
  },
});

export default ProductScreen;
