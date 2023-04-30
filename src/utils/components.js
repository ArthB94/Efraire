import React from "react";
import { Text, View, Button, Pressable } from "react-native";
import styles from "../utils/styles";

import {LineChart} from 'react-native-charts-wrapper';


export const CustomButton = ({ style,title, onPress }) => {
    return (
        <Pressable onPress={onPress} style={({pressed}) =>[ pressed ? style.pressed :  style.unpressed, style]}>           
        {({pressed}) => (
          <Text style={style.text}>{pressed ? title+'!' : title}</Text>
        )}
      </Pressable>
    );
}



export const Graph = ({ style,title, dataSets }) => {
    return (
      <View style={{flex: 1,width: '100%',flex:1,padding: 20,borderRadius:10,backgroundColor:'#00000015'}}>
        <View style={{width:'100%',flex:1}}>
            <LineChart style={{flex: 1}} data={{dataSets:dataSets}} descriptionLabel = 'bite'/>
        </View>
      </View>
    );
  
}



