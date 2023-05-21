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
      <View style={style}>
        <View style={{width:'100%',flex:1,borderColor:'black'}}>
            <LineChart style={{flex: 1}} 
            data={{dataSets:dataSets}} 
            descriptionLabel = {title}
            />
        </View>
      </View>
    );
  
}

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // red
      strokeWidth: 2,
    },
    {
      data: [60, 80, 70, 65, 82, 56],
      color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // green
      strokeWidth: 2,
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const LineChartExample = () => {
  return (
    <LineChart
      data={data}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
    />
  );
};

export default LineChartExample;



  



