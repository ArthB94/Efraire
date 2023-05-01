import React, { useState, useEffect,useContext } from 'react';
import { Text, View, Button, TextInput, Pressable } from 'react-native';
import styles from '../utils/styles';
import { showUsers, createTable, dropTable } from '../utils/queries'
import db from '../utils/db';
import { CustomButton } from '../utils/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalContext } from '../App';
import { useFocusEffect } from '@react-navigation/native';




export default function LoginScreen({ navigation }) {
  const [globalState, setGlobalState] = useContext(GlobalContext);
  const [user, setUser] = useState(globalState.user);

  useEffect(() => {
    fetchData();
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  ); 

  const fetchData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const savedUser = JSON.parse(userJson);
      console.log('useEffect savedUser ' + JSON.stringify(savedUser));
      setGlobalState({...globalState,user:savedUser});
      setUser(savedUser);
      // Appel de la fonction de connexion
      if (savedUser.id != -1){
      await connection(savedUser);
    }
    } catch (e) {
      console.log(e);
    }
  };

   
  

  const connection = async (user) => {
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
                const state = {...user, id: results.rows.item(0).ID, age: results.rows.item(0).Age }
                setGlobalState({...globalState,user:state})
                await AsyncStorage.setItem('user', JSON.stringify(state));
                navigation.navigate('InApp', { user: state })
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
        else {alert('Login') ,connection(user)}}}/>
      <CustomButton style={styles.button} title='CreatUser' onPress={() => { navigation.navigate('Signin', { user: user }) }} />
    </View>

  );
}