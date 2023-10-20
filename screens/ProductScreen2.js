// ProductScreen.js
import React, {useEffect, useState} from 'react';
import {
  TextInput,
  View,
  Text,
  Button,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {fetchProducts} from '../api';
import ImageZoom from 'react-native-image-pan-zoom';

const ProductScreen = ({cart, setCart}) => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [zoomedUri, setZoomedUri] = useState(null);




  useEffect(() => {
    fetchProducts()
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleIncrement = product => {
    setCart(prevCart => {
      const updatedCart = {...prevCart};
      if (updatedCart[product.id]) {
        updatedCart[product.id].quantity += 1;
      } else {
        updatedCart[product.id] = {...product, quantity: 1};
      }
      return updatedCart;
    });
  };

  const handleDecrement = product => {
    setCart(prevCart => {
      const updatedCart = {...prevCart};
      if (updatedCart[product.id] && updatedCart[product.id].quantity > 1) {
        updatedCart[product.id].quantity -= 1;
      } else {
        delete updatedCart[product.id];
      }
      return updatedCart;
    });
  };
  
  const openImageModal = (uri) => {
    setZoomedUri(uri);
  };

  const closeImageModal = () => {
    setZoomedUri(null);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search products..."
        onChangeText={text => setSearchText(text)}
        style={styles.searchInput}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
            <View>
          <View style={styles.cartItem}>
            {/* <Image
              source={{uri: item.image}} // Use the product's image URL from the API
              style={styles.productImage}
            /> */}
            <TouchableOpacity onPress={() => openImageModal(item.image)}>
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
              />
            </TouchableOpacity>
            <View style={styles.itemDetails}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>
                Price: Rs.{item.price.toFixed(2)}
              </Text>
            </View>
            </View>
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
      <Modal visible={zoomedUri !== null} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: zoomedUri }}
            style={styles.zoomedImage}
          />
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemDetails: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
//   productItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,

//   },

  productImage: {
    width: 70,
    height: 70,
    marginRight: 10,
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
    marginTop: -10,
    marginBottom: 15,
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
  zoomContainer: {
    width: 300,
    height: 200,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
  },
  zoomedImage: {
    width: 300,
    height: 300,
  },
});

export default ProductScreen;
