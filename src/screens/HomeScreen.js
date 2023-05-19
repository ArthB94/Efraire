import React, { useState, useEffect, useContext } from 'react';
import { ScrollView } from 'react-native';

import { Text, View, Button } from 'react-native';
import styles from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../utils/db';
import { CustomButton } from '../utils/components';
import { Graph } from '../utils/components';
import { GlobalContext } from '../App';
import { selectData } from '../utils/queries';



export default function HomeScreen({ route }) {
  const [globalState, setGlobalState] = useContext(GlobalContext);
  const user = globalState.user
  const [dataSets, setDataSets] = useState([])
  const [load, reload] = useState(false)
  

  useEffect(() => {
    //dropData()
    var time = maDate(new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit'}),new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    var randomH = Math.random()/4 - (1/8);
    var randomM = Math.random() - 1/2;
    var randomS = Math.random() * 2 - 1;
    var randomNumber = randomS + randomM + randomH;
    const intervalId = setInterval(() => {
      const formattedDate = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit'});
      const formattedTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newDate = maDate(formattedDate,formattedTime)
      
      if (time.hour != newDate.hour) {
        const random = Math.random()/60 - (1/120);
        randomH = random ;
        time = newDate
      }
      if (time.minute != newDate.minute){
        const random = Math.random()/2 - 1/4;
        randomM = random  + randomH;
        time = newDate
      }
      if (time.second != newDate.second) {  
        const random = Math.random() * 2 - 1;
        randomS += random + randomM+ randomH ;
        time = newDate
      }
      
      console.log("randomS "+randomS+"\nrandomM "+randomM+"\nrandomH "+randomH);
      randomNumber = Math.floor(Math.random() * 100) + 1 + randomS + 100;
      const data =[user.id, formattedDate,formattedTime , randomNumber]
      addData(data)
      getData()  
    }, 1000);
    return () => clearInterval(intervalId);
    //trygetdata()
  },[]);

  /* const trygetdata = async () => {
    //console.log("i "+i);
    var randomH = Math.random()/4 - (1/8);
    var randomM = Math.random() - 1/2;
    var randomS = Math.random() * 2 - 1;
    var randomNumber = randomS + randomM + randomH;
    var data = []
    for (i = 0; i < 100000; i++) {
      console.log("i "+i);
      if (i%1000==0 ) {
        console.log("--------------------------------"+i);
        const random = Math.random()/60 - (1/120);
        randomH = random ;
      }
      if (i%60==0){
        console.log("--------------------------------"+i);
        const random = Math.random()/2 - 1/4;
        randomM = random  + randomH;
      }
      if (i%1==0) {  
        const random = Math.random() * 2 - 1;
        randomS += random + randomM+ randomH ;
      }
      randomNumber =  randomS;
      data.push({x: i, y: randomNumber })
    } 
    setDataSets([{ label: "Valeur pour le mois de ", values: data }])
  }*/

  const getData = async () => {
    console.log("getData");
    try {
      db.transaction(async (tx) => {
        tx.executeSql(
          'SELECT * FROM Data WHERE UserID = ? ',
          [user.id],
          async (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              var data = []
              for (i = 0; i < len; i++) {
                const date = maDate(results.rows.item(i).Date,results.rows.item(i).Heure)
                data.push({x: date.second + 60 * date.minute + 3600 * date.hour, y: results.rows.item(i).pollution })
              }
              setDataSets([{ label: "Valeur pour le mois de ", values: data }])
            }
            else {
              setDataSets([{ label: "Valeur pour le mois de ", values: [{x:0,y:0}] }])
              console.log("No data");
              
            }
          }
        );
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  const maDate = (formattedDate,formattedTime)=>{
    const newdate ={
      year:parseInt(formattedDate.split('/')[0]),
      month:parseInt(formattedDate.split('/')[1]),
      day:parseInt(formattedDate.split('/')[2]),
      hour:parseInt(formattedTime.split(':')[0]),
      minute:parseInt(formattedTime.split(':')[1]),
      second:parseInt(formattedTime.split(':')[2]) } 
    return newdate
  }
  const addData = async (data) => {
    try {
      await db.transaction(async (tx) => {
          await tx.executeSql(
              'INSERT INTO Data (UserID, Date, Heure, pollution) VALUES (?,?,?,?)',
              data
          );
      });
    console.log('Data added ' + JSON.stringify(data));
  }
  catch (e) {
      console.log(e);
  }
}

const dropData = async () => {
  reload(!load)
  try {
    await db.transaction(async (tx) => {
        await tx.executeSql(
            'DELETE FROM Data WHERE UserID = ?', [user.id]
        );
    });}
    catch (e) {}
  }


  return (
    <ScrollView >
      <View style={{
        height: 800,
        padding: 10,
        paddingBottom: 100,
        backgroundColor:'white'}}>
        <View style={{...styles.body,paddingTop:20}}>
          <View style={{...styles.view,alignItems:'center',flex: 0,paddingBottom:50}}>
            <Text style={{...styles.title,}}>Welcome {user.name}!</Text>
          </View>
          <Graph style={{...styles.graph,height: 400}} dataSets={dataSets}>
          </Graph>
          <CustomButton style={{...styles.button,text: {...styles.button.text}}} onPress={addData} title={'adddata'}></CustomButton>
          <CustomButton style={styles.button} onPress={dropData} title={'dropData'}></CustomButton>
        </View>
      </View>
    </ScrollView>
  );
}
