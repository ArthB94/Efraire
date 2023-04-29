import React from "react";
import { Text, View, Button, Pressable } from "react-native";
import styles from "../utils/styles";


export const CustomButton = ({ style,title, onPress }) => {
    return (
        <Pressable onPress={onPress} style={({pressed}) =>[ pressed ? style.pressed :  style.unpressed, style]}>           
        {({pressed}) => (
          <Text style={style.text}>{pressed ? title+'!' : title}</Text>
        )}
      </Pressable>
    );
}

