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

    getData()  
   

    //console.log('HomeScreen useEffect' + JSON.stringify(dataSets) );
  },[load]);

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
                //console.log("ID " + results.rows.item(i).ID + " UserID: " + results.rows.item(i).UserID + " Date: " + results.rows.item(i).Date + " pollution: " + results.rows.item(i).pollution);
                const date = maDate(results.rows.item(i).Date,results.rows.item(i).Heure)
                data.push({x: date.second+60*date.minute+3600*date.hour, y: results.rows.item(i).pollution })
                console.log("data " + JSON.stringify({data,date}));
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
    const newdatestring={year:formattedDate.split('/')[0],month:formattedDate.split('/')[1],day:formattedDate.split('/')[2],hour:formattedTime.split(':')[0],minute:formattedTime.split(':')[1],second:formattedTime.split(':')[2]}
    console.log(JSON.stringify(newdatestring))
    const newdate ={year:parseInt(formattedDate.split('/')[0]),month:parseInt(formattedDate.split('/')[1]),day:parseInt(formattedDate.split('/')[2]),hour:parseInt(formattedTime.split(':')[0]),minute:parseInt(formattedTime.split(':')[1]),second:parseInt(formattedTime.split(':')[2]) } 
    console.log("newdate= "+JSON.stringify(newdate))
    return newdate
}
  const addData = async () => {
    reload(!load)
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const formattedDate = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit'});
    const formattedTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const data =[user.id, formattedDate,formattedTime , randomNumber]
    try {
      await db.transaction(async (tx) => {
          await tx.executeSql(
              'INSERT INTO Data (UserID, Date, Heure, pollution) VALUES (?,?,?,?)',
              data
          );
      });
      
      console.log('Data aded ' + JSON.stringify(data));
      
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
            //data
        
        );
    });}
    catch (e) {}
  }




  return (
    <ScrollView >
      <View style={{
        height: 500,
        padding: 20,
      }}>
        <View style={styles.body}>
          <View style={styles.view}>
            <Text style={styles.title}>Welcome {user.name} you are {user.age} !</Text>
          </View>
          <Graph style={{
            flex: 1,
            width: '100%', flex: 1,
            padding: 20, borderRadius: 10, backgroundColor: '#00000015'
          }} dataSets={dataSets}>
          </Graph>
          <CustomButton style={{...styles.button,text: {...styles.button.text}}} onPress={addData} title={'adddata'}></CustomButton>
          <CustomButton style={styles.button} onPress={dropData} title={'dropData '+user.id}></CustomButton>
        </View>
      </View>


    </ScrollView>
  );
}
