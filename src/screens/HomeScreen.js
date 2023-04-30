import React, { useState, useEffect,useContext } from 'react';
import { ScrollView } from 'react-native';

import { Text, View, Button } from 'react-native';
import styles from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../utils/db';
import { CustomButton } from '../utils/components';
import { Graph } from '../utils/components';
import { GlobalContext } from '../App';


export default function HomeScreen({ route }) {
  const [globalState, setGlobalState] = useContext(GlobalContext);
  const user = globalState.user
  
  useEffect(() => {
    console.log('HomeScreen useEffect'+user);
  }, [])
  


  return (
    <ScrollView >
      <View style={{height: 500,
        padding: 20,}}>
      <View style={styles.body}>
      <View style={styles.view}>
        <Text style={styles.title}>Welcome { user.name} you are {user.age} !</Text>
      </View>
          <Graph style={{flex: 1,
            width: '100%',flex:1,
            padding: 20,borderRadius:10,backgroundColor:'#00000015'}}  dataSets={ [{label: "Mon Lable", values: [{x:1,y: 1}, {x:2, y: 2}, {x:3,y: 1.5},{x:4,y: 2.4},{x:5,y: 3.7}, {x:6, y: 2}, {x:6.1,y: 1},{x:6.7,y: 2}]}]}>
          </Graph>
      </View>
      </View>


    </ScrollView>
  );
}
