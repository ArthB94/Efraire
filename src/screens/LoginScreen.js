import React, { useState, useEffect,useContext } from 'react';
import { Text, View, Button, TextInput, Pressable } from 'react-native';
import styles from '../utils/styles';
import { showUsers, createTable, dropTable } from '../utils/queries'
import db from '../utils/db';
import { CustomButton } from '../utils/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalContext } from '../App';




export default function LoginScreen({ navigation }) {
  const [globalState, setGlobalState] = useContext(GlobalContext);
  const [user, setUser] = useState(globalState.user);

  useEffect(() => {
    getData()
    createTable('Users', 'ID INTEGER PRIMARY KEY AUTOINCREMENT, Name VARCHAR(20) UNIQUE, Age INTEGER, Password VARCHAR(20)')
  }, [])

  const getData = async () => {
    try {
      //await AsyncStorage.setItem('user', JSON.stringify({id:0,name:'',age:'',password:''}))
      const value = JSON.parse(await AsyncStorage.getItem('user'))
      setUser(value)
      db.transaction(async (tx) => {
        tx.executeSql(
          'SELECT * FROM Users WHERE Name = ? AND Password = ?',
          [value.name, value.password],
          async (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              for (i = 0; i < len; i++) {
                console.log("ID "+results.rows.item(0).ID+" Name: " + results.rows.item(i).Name + " Age: " + results.rows.item(i).Age + " Password: " + results.rows.item(i).Password);
              }
              await AsyncStorage.setItem('user', JSON.stringify(value));
              setGlobalState({ ...globalState, user: value })
              navigation.navigate('InApp')
            }
          }
        );
      });

    } catch (e) {
      console.log(e)
    }
  }

  const connection = async () => {
      try {
        db.transaction(async (tx) => {
          tx.executeSql(
            'SELECT * FROM Users WHERE Name = ? AND Password = ?',
            [user.name, user.password],
            async (tx, results) => {
              var len = results.rows.length;
              if (len > 0) {
                for (i = 0; i < len; i++) {
                  console.log("ID "+results.rows.item(0).ID+" Name: " + results.rows.item(i).Name + " Age: " + results.rows.item(i).Age + " Password: " + results.rows.item(i).Password);
                }
                await AsyncStorage.setItem('user', JSON.stringify({...user, id: results.rows.item(0).ID, age: results.rows.item(0).Age }));
                navigation.navigate('InApp', { user: {...user, id: results.rows.item(0).ID, age: results.rows.item(0).Age } })
              }
              else {
                alert('Username: '+user.name+' or password: '+' incorrect');
              }
            }
          );
        });
      }
      catch (e) {
        console.log(e);
      }
    
  };



  return (
  
    <View style={styles.body}>
      <Text style={styles.title}>Login</Text>
      <Text >Username</Text>
      <TextInput style={styles.textInput} onChangeText={text => setUser({...user,name:text})} value={user.name} />
      <Text >Password</Text>
      <TextInput style={styles.textInput} secureTextEntry={true} onChangeText={text => setUser({...user,password:text})} value={user.password} />
      <CustomButton style={styles.button} title='Login' onPress={()=>{ 
          if (user.name.length == 0 || user.password.length == 0){ 
          alert('Please fill all the fields')
        } 
        else {alert('Login') ,connection()}}}/>
      <CustomButton style={styles.button} title='CreatUser' onPress={() => { navigation.navigate('Signin', { user: user }) }} />
    </View>

  );
}