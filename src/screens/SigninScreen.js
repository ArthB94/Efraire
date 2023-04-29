import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import styles from '../utils/styles';
import db from '../utils/db';
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomButton } from '../utils/components';



export default function SinginScreen({ navigation ,route}) {
    const[user,setUser] = useState(route.params.user)
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
            <Text >Username</Text>
            <TextInput style={styles.textInput} onChangeText={name => setUsername(name)} value={user.name} />
            <Text >Age</Text>
            <TextInput style={styles.textInput} onChangeText={age => setAge(age)} value={user.age} />
            <Text >Password</Text>
            <TextInput style={styles.textInput} secureTextEntry={true} onChangeText={password => setPassword(password)} value={user.password} />
            <CustomButton style={styles.button} title='Signin' onPress={setData}/>
        </View>
    );
}