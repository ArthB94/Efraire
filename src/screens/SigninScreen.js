import React from 'react';
import { useState, useEffect ,useContext} from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import styles from '../utils/styles';
import db from '../utils/db';
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomButton } from '../utils/components';
import { GlobalContext } from '../App';



export default function SinginScreen({ navigation }) {
    const [globalState, setGlobalState] = useContext(GlobalContext);
    const[user,setUser] = useState(globalState.user);
    const isInDB = async () => {
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM Users WHERE Name = ?',
                    [username],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            return true
                        }
                        else {
                            return false
                        }
                    }
                )
            })
        } catch (e) {
            console.log(e)
        }
    }

    const setData = async () => {
        if (user.name.length == 0 || user.password.length == 0 || user.age.length == 0) {
            alert('Please fill all the fields');
        }
        else if( isInDB() == true) {
            alert('Username already exist');
        }
        else {
            try {
                await db.transaction(async (tx) => {
                    await tx.executeSql(
                        'INSERT INTO Users (Name, Age, password) VALUES (?,?,?)',
                        [user.name, user.age, user.password]
                    );
                });
                alert('User ' + user.name + ' added successfully');
                await AsyncStorage.setItem('user', JSON.stringify(user));
                setGlobalState({ ...globalState, user: user })
                console.log('setData user ' + JSON.stringify(globalState));
                navigation.navigate('Login')
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    return (
        <View style={styles.body}>
            <Text style={styles.title}>Signin</Text>
            <Text style={styles.text}>Username</Text>
            <TextInput style={styles.textInput} onChangeText={name => setUser({...user,name:name})} value={user.name} />
            <Text style={styles.text}>Age</Text>
            <TextInput style={styles.textInput} onChangeText={age => setUser({...user,age:age})} value={user.age.toString()} />
            <Text style={styles.text}>Password</Text>
            <TextInput style={styles.textInput} secureTextEntry={true} onChangeText={password => setUser({...user,password:password})} value={user.password} />
            <CustomButton style={styles.button} title='Signin' onPress={setData}/>
        </View>
    );
}