import React,{useEffect,useState} from 'react';
import { Text, View,TextInput } from 'react-native';
import styles from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomButton } from '../utils/components';
import db from '../utils/db';
import { updateData, } from '../utils/queries';


//fonction qui retourne la page du comte
export default function AccountScreen ({navigation,route}) {
  const[user,setUser] = useState(route.params.user)
  useEffect(() => {
  }, [])

  const disconnect = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('Login')
    }
    catch (e) {
      console.log(e);
    } 
  }
  const removeUser = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          'DELETE FROM Users WHERE ID = ?',
          [user.id]
        );
      });
      alert('User ' + user.name + ' removed successfully');
      navigation.navigate('Login')
    }
    catch (e) {
      console.log(e);
    }
  }
  const updateUser = async () => {
    // mettre a jour la base de donnée et route.
    try {
      db.transaction((tx) => {
          tx.executeSql(
              'UPDATE Users SET Name=?, Age=?, Password=? WHERE ID=? ' 
              , [user.name, user.age, user.password, user.id]
          )
      })
      alert('User ' + user.name + ' updated successfully');
      await AsyncStorage.setItem('user', JSON.stringify(user));
      console.log(JSON.stringify(user))
      navigation.navigate('Login')
  } catch (e) {
      console.log(e)
  }

  }

  return (
    <View style = {styles.body}>
      <View style = {[styles.view,{backgroundColor: '#00000011',}]} >
        <Text style = {styles.title}>Your account {route.params.rusername}</Text>
        <Text >Username</Text>
        <TextInput style={styles.textInput} onChangeText={text => setUser({...user,name:text})} value={user.name} />
        <Text >Age</Text>
        <TextInput style={styles.textInput} onChangeText={text => setUser({...user,age:text})} value={user.age.toString()} />
        <Text >Password</Text>
        <TextInput style={styles.textInput} onChangeText={text => setPassword(text)} value={user.password} />
      </View>
      <View style = {[styles.view,{backgroundColor: '#333',alignItems: 'center',}]} >
        <CustomButton style={styles.button} title='Disconnect' onPress={disconnect}/>
        <CustomButton style={styles.button} title='Delete Acount' onPress={removeUser}/>
        <CustomButton style={styles.button} title='Update Acount' onPress={updateUser}/>
      </View>
    </View>
  );
  }