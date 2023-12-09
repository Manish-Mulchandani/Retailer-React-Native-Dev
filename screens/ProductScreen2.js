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
import { Client, Databases } from 'appwrite';

const DATABASE_ID = '6532eaf0a394c74aeb32'
const COLLECTION_ID = '6532eafc7e2ef6e5f9fb'
const PROJECT_ID = '652fa3f6300f32d17993'

const client = new Client();

const databases = new Databases(client);

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

const ProductScreen = ({cart, setCart}) => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [zoomedUri, setZoomedUri] = useState(null);




  useEffect(() => {
    // Make a request to fetch the products
    const promise = databases.listDocuments(DATABASE_ID, COLLECTION_ID);

    promise
      .then(function (response) {
        if (response && response.documents) {
          setProducts(response.documents);
        }
      })
      .catch(function (error) {
        console.log(error); // Handle the error appropriately
      });
  }, []); // Empty dependency array to run the effect only once

  const handleIncrement = product => {
    setCart(prevCart => {
      const updatedCart = {...prevCart};
      if (updatedCart[product.$id]) {
        updatedCart[product.$id].quantity += 1;
      } else {
        updatedCart[product.$id] = {...product, quantity: 1};
      }
      return updatedCart;
    });
  };

  const handleDecrement = product => {
    setCart(prevCart => {
      const updatedCart = {...prevCart};
      if (updatedCart[product.$id] && updatedCart[product.$id].quantity > 1) {
        updatedCart[product.$id].quantity -= 1;
      } else {
        delete updatedCart[product.$id];
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
    product.Name.toLowerCase().includes(searchText.toLowerCase()),
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
        keyExtractor={item => item.$id}
        renderItem={({item}) => (
            <View>
          <View style={styles.cartItem}>
            {/* <Image
              source={{uri: item.image}} // Use the product's image URL from the API
              style={styles.productImage}
            /> */}
            <TouchableOpacity onPress={() => openImageModal(`${item.Image}&output=webp`)}>
              <Image
                source={{ uri: `${item.Image}&output=webp` }}
                style={styles.productImage}
              />
            </TouchableOpacity>
            <View style={styles.itemDetails}>
              <Text style={styles.productTitle}>{item.Name}</Text>
              <Text style={styles.productPrice}>
                Price: Rs.{item.Price.toFixed(2)}
              </Text>
              <Text style={[{fontSize: 14}, { color: item.Available ? 'green' : 'red' }]}>
        Available: {item.Available ? 'Yes' : 'No'}
      </Text>
            
            
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleDecrement(item)}>
                <View style={styles.roundButton}>
                  <Text style={styles.roundButtonText}>-</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.quantityText}>
                {cart[item.$id] ? cart[item.$id].quantity : 0}
              </Text>
              <TouchableOpacity onPress={() => handleIncrement(item)}>
                <View style={styles.roundButton}>
                  <Text style={styles.roundButtonText}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
            </View>
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
    backgroundColor: '#F5F5F5', // Set the background color
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 12,
    borderRadius: 8, // Add rounded corners
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white', // Set a white background
    borderRadius: 12, // Add rounded corners
    padding: 16,
    elevation: 2, // Add a subtle shadow (for Android)
    shadowColor: 'rgba(0, 0, 0, 0.2)', // Shadow color
    shadowOffset: { width: 0, height: 1 }, // Shadow offset
    shadowOpacity: 1, // Shadow opacity
  },
  productImage: {
    width: 90,
    height: 90,
    marginRight: 16,
    borderRadius: 8, // Make the image round
  },
  itemDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18, // Increase the font size
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16, // Increase the font size
    color: '#555', // Dark gray text color
  },
  quantityContainer: {
    marginTop: 8, // Slightly increase the top margin
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundButton: {
    width: 36,
    height: 36,
    borderRadius: 18, // Make the buttons round
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
    marginHorizontal: 20,
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
    borderRadius: 16, // Make the zoomed image round
  },
});


export default ProductScreen;
