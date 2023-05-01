import 'react-native-gesture-handler';
import React,{useState} from 'react';
import  Connection  from './screens/LoginScreen';
import  SinginScreen from './screens/SigninScreen';
import  HomeScreen  from './screens/HomeScreen';
import  AccountScreen  from './screens/AccountScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack =  createStackNavigator();
const Drawer = createDrawerNavigator();
export const GlobalContext = createContext();

//cette fonction retourne la page 'InApp' qui correspond aux pages 'Home' et 'Account' apres la connection
function InApp({route}){
  return(
    <Drawer.Navigator edgeWidth = {500} drawerStatusBarAnimation={'slide'}  >
      <Drawer.Screen name="Home" component={HomeScreen} initialParams = {route.params}/>
      <Drawer.Screen name="Account" component={AccountScreen} initialParams = {route.params}/>
    </Drawer.Navigator>
    
  )
}
//cette fonction et la première loadé par l'application et elle retourne la page 'Login' qui correspond à la page de connection et signin pour creer un compte
function App() {  

  const [globalState, setGlobalState] = useState({user: {id:-1,name:'',age:'',password:''},});

  return (
    <>
    <NavigationContainer>
    <GlobalContext.Provider value={[globalState, setGlobalState]}>
      <Stack.Navigator screenOptions={{header:()=> null}}  initialRouteName="Login"  > 
        <Stack.Screen name="Login" component={Connection} />
        <Stack.Screen name="Signin" component={SinginScreen} />
        <Stack.Screen name="InApp" component={InApp} />
      </Stack.Navigator>
      </GlobalContext.Provider>
    </NavigationContainer></>
  );  
}

export default App;
