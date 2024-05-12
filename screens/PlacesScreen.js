import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View, 
  Keyboard,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { addPlace, removePlace } from '../reducers/user';

export default function PlacesScreen() {


  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [city, setCity] = useState('');
  const [allCity, setAllCity] = useState([]);



  const handleSubmit = () => {

    try {
    if (city.length === 0) {
      return;
    }

  const addCity = async (city) => {

    
    //console.log(city_name)
    const response = await fetch(`https://back-my-location.vercel.app/places/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: city, nickname: user.nickname }),
    })
    // .then(response => response.json())
    
    //console.log("reponse du Add", reponse) 
    const CITY = await response.json()

    const newPlace = {
            name: CITY.newMarker.city,
            latitude: CITY.newMarker.latitude,
            longitude: CITY.newMarker.longitude,
          };

          dispatch(addPlace(newPlace));
          setCity('');
        ;
  ////////////////////////////////////////////
      // fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`)
      //   .then((response) => response.json())
      //   .then((data) => {
      //     const firstCity = data.features[0];
          
      //     const newPlace = {
      //       name: firstCity.properties.city,
      //       latitude: firstCity.geometry.coordinates[1],
      //       longitude: firstCity.geometry.coordinates[0],
      //     };

      //     dispatch(addPlace(newPlace));
      //     setCity('');
      //   });
  }

  addCity(city)
  Keyboard.dismiss()
    }

    catch (error){

      console.log("erreur l ajout des villes ",  error)
    
    }

};


const handledelete = (name) => {

  try{
  const deleteCity = async (name) => {
    //console.log(city_name)

    const response = await fetch(`https://back-my-location.vercel.app/places/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: name, nickname: user.nickname }),
    })
 
    const CITY = await response.json()
      console.log(CITY.message)
      dispatch(removePlace(name))
  }

  deleteCity(name)

}
catch (error){

  console.log("erreur la de la suppression des villes ",  error)

}
  
}

const showCity = async () => {

  try{
  //console.log("nickname avant ", user.nickname)
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

    console.log("erreur la de la recuperation des villes ",  error)
  
  }
}


useEffect(() => {
  showCity()
}, [user.places]);

    
//console.log("user.places", user.places)


//console.log("user ", user)
//console.log("Allcities ", allCity)

  const places = allCity.map((data, i) => {
    return (
      <View key={i} style={styles.card}>
        <View>
          <Text style={styles.name}>{data.city}</Text>
          <Text>LAT : {Number(data.latitude).toFixed(3)} LON : {Number(data.longitude).toFixed(3)}</Text>
        </View>
        <FontAwesome name='trash-o' onPress={() => handledelete(data.city)} size={25} color='#ec6e5b' />
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{user.nickname}'s places</Text>

      <View style={styles.inputContainer}>
        <TextInput placeholder="New city" onChangeText={(value) => setCity(value)} value={city} style={styles.input} />
        <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.textButton}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {places}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 20,
  },
  scrollView: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  input: {
    width: '65%',
    marginTop: 6,
    borderBottomColor: '#ec6e5b',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: '30%',
    alignItems: 'center',
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
