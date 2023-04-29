import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';

import { Text, View, Button } from 'react-native';
import styles from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../utils/db';


export default function HomeScreen({ route }) {
  const[user,setUser] = useState(route.params.user)
  
  useEffect(() => {

  }, [])


  return (
    <ScrollView>
      <View style={styles.body}>
        <Text style={styles.title}>Welcome {user.name} you are {user.age} !</Text>
      </View>
    </ScrollView>
  );
}
