import React, { useState, useEffect, useContext } from 'react';
import { ScrollView } from 'react-native';

import { Text, View} from 'react-native';
import styles from '../utils/styles';
import db from '../utils/db';
import { CustomButton } from '../utils/components';
import { Graph } from '../utils/components';
import { GlobalContext } from '../App';

//----------------------------------------------BLE--------------------------------------------------
import useBLE from '../utils/useBLE';
import { set } from 'react-native-reanimated';

//----------------------------------------------BLE--------------------------------------------------

export default function HomeScreen({ route }) {
  const [globalState, setGlobalState] = useContext(GlobalContext);
  const user = globalState.user
  const [dataSets, setDataSets] = useState([{ label: "", values: [{ x: 0, y: 0 }] },{ label: "", values: [{ x: 0, y: 0 }] }])
  const [load, reload] = useState(false)
  //----------------------------------------------BLE--------------------------------------------------
  const { requestPermissions, scanForDevices, allDevices, connectToDevice, data,setData } = useBLE();
  const openModal = async () => {
    requestPermissions((isGranted) => {
      if (isGranted) {
        scanForDevices();
        //affiche tous les devices.name
        allDevices.forEach((device) => console.log('device:'+ device.name + '  ' + device.id));

      }
    });
  };

  //----------------------------------------------BLE--------------------------------------------------

  
  useEffect(() => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit'});
    const formattedTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    var thisdata = [0,0]
    if (data[0] == 0) {
      thisdata[0] = dataSets[0].values[dataSets[0].values.length - 1].y
      thisdata[1] = data[1]
      console.log('data[0]:'+data[0]);
    }
    if(data[1] == 0){
      thisdata[1] = dataSets[1].values[dataSets[1].values.length - 1].y
      thisdata[0] = data[0]
      console.log('data[1]:'+data[1]);
    }
    const newdata = [user.id, formattedDate,formattedTime , thisdata[0], thisdata[1]]
    console.log('data: '+ newdata);
    addData(newdata)
    getData()
    console.log("useEffect");
    
  }, [data,load]);


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
              var data = [[], []]
              for (i = 0; i < len; i++) {
                const date = maDate(results.rows.item(i).Date, results.rows.item(i).Heure)
                const x = date.second + 60 * date.minute + 3600 * date.hour
                data[0].push({ x: x, y: results.rows.item(i).pollution25 })
                data[1].push({ x: x, y: results.rows.item(i).pollution10 })
              }
              setDataSets([{ label: "pm 2.5", values: data[0],},{ label: "pm 10", values: data[1]}])


              

            }
            else {
              setDataSets([{ label: "", values: [{ x: 0, y: 0 }] }])
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

  const maDate = (formattedDate, formattedTime) => {
    const newdate = {
      year: parseInt(formattedDate.split('/')[0]),
      month: parseInt(formattedDate.split('/')[1]),
      day: parseInt(formattedDate.split('/')[2]),
      hour: parseInt(formattedTime.split(':')[0]),
      minute: parseInt(formattedTime.split(':')[1]),
      second: parseInt(formattedTime.split(':')[2])
    }
    return newdate
  }
  const addData = async (data) => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          'INSERT INTO Data (UserID, Date, Heure, pollution25, pollution10) VALUES (?,?,?,?,?)',
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
    
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          'DELETE FROM Data WHERE UserID = ?', [user.id]
        );
      });
    }
    catch (e) { }
    reload(!load)
  }
  var result = 0

  return (
    /*
    ceci est un commentaire*/
    <ScrollView >
      <View style={{
        height: 1000,
        padding: 10,
        paddingBottom: 100,
        backgroundColor: 'white'
      }}>
        <View style={{ ...styles.body, paddingTop: 20 }}>
          <View style={{ ...styles.view, alignItems: 'center', flex: 0, paddingBottom: 50 }}>
            <Text style={{ ...styles.title, }}>Welcome {user.name}!</Text>
          </View>
          <Graph style={{ ...styles.graph, height: 400 }} dataSets={ dataSets}       //teste de fonctionnement du graph
          >
          </Graph>
          <CustomButton style={styles.button} onPress={dropData} title={'dropData'}></CustomButton>

          <CustomButton style={{ ...styles.button, text: { ...styles.button.text } }} onPress={openModal} title={'scan'}></CustomButton>
          <Text style={styles.text}>
            My device: {allDevices != null && allDevices.length > 0 ?
              allDevices?.map((device) => (
                <Text style={styles.text} key={device.id}>
                  {device.name}
                </Text>
              ))
              : <Text> no device</Text>
            }

          </Text>
          {allDevices.length > 0 && (
            <>
              <CustomButton style={{ ...styles.button, text: { ...styles.button.text } }} onPress={() => connectToDevice(allDevices[0])} title={'Connect'}></CustomButton>
            </>
          )}

        </View>
      </View>
    </ScrollView>
  );
}
