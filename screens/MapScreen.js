import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addPlace } from '../reducers/user';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';


export default function MapScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [currentPosition, setCurrentPosition] = useState(null);
  const [tempCoordinates, setTempCoordinates] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlace, setNewPlace] = useState('');
  const [allCity, setAllCity] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            setCurrentPosition(location.coords);
          });
      }
    })();
  }, []);

  const handleLongPress = (e) => {
    setTempCoordinates(e.nativeEvent.coordinate);
    setModalVisible(true);
  };

  const handleNewPlace = () => {
    
//////////////////////////////
try {
{
  const addPLace= async () => {
    //console.log(city_name)
    const response = await fetch(`https://back-my-location.vercel.app/places/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ myplace: newPlace, latitude : tempCoordinates.latitude , longitude : tempCoordinates.longitude, nickname: user.nickname }),
    })
   
    const CITY = await response.json()

    console.log(CITY.message)


  dispatch(addPlace({name: newPlace, latitude: tempCoordinates.latitude, longitude: tempCoordinates.longitude}));
  setNewPlace('');
  }

  addPLace()
  Keyboard.dismiss()


//////////////////////////////

    setModalVisible(false);}
}

catch (error){

  console.log("erreur l ajoute des villes depuis la map",  error)

}
    
  };

  const handleClose = () => {
    setModalVisible(false);
    setNewPlace('');
  };


  const getCity = async () => {
    //console.log("nickname avant ", user.nickname)
    try{
      const reponse = await fetch(`https://back-my-location.vercel.app/places/${user.nickname}`)
    //console.log("reponse", reponse)
    const allCities = await reponse.json()
    //console.log("AllCities",allCities)
    if (allCities.result)
      {
          setAllCity(allCities.places)
      }     
    }
    catch (error){

      console.log("erreur l ajout des villes en bdd depuis la map",  error)
    
    }
  }
  
  
  useEffect(() => {
    getCity()
  }, [user.places]);
  



  const markers = allCity?.map((data, i) => {
    return <Marker key={i} coordinate={{ latitude: data.latitude, longitude: data.longitude }} title={data.name} />;
  });

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput placeholder="New place" onChangeText={(value) => setNewPlace(value)} value={newPlace} style={styles.input} />
            <TouchableOpacity onPress={() => handleNewPlace()} style={styles.button} activeOpacity={0.8}>
              <Text style={styles.textButton}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleClose()} style={styles.button} activeOpacity={0.8}>
              <Text style={styles.textButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MapView onLongPress={(e) => handleLongPress(e)} mapType="hybrid" style={styles.map}>
        {currentPosition && <Marker coordinate={currentPosition} title="My position" pinColor="#fecb2d" />}
        {markers}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 150,
    borderBottomColor: '#ec6e5b',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: 150,
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: '#ec6e5b',
    borderRadius: 10,
  },
  textButton: {
    color: '#ffffff',
    height: 24,
    fontWeight: '600',
    fontSize: 15,
  },
});
