import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent:'flex-start',
        paddingTop: 100,

    },
    view: {
        flex: 1,
        width: '100%',
        textDecorationColor: 'black',
    },
    title: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        color: 'black',
        fontSize: 15,
    },
    textInput: {
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        color: 'black',
    },
    button: {
        padding: 7,
        borderRadius: 5,
        margin: 5,
        height: 40,
        width: 200,
        pressed:{
            backgroundColor: '#004',
        },
        unpressed:{
            backgroundColor: '#006',
        },
        text: {
            fontSize: 15,
            color: '#fff',
            textAlign: 'center',
        },
    },
    graph:{
         width: '100%', 
         padding: 20,
         borderRadius: 10, 
         margin: 20,
         borderWidth: 0.5,
         borderColor: 'black',
         backgroundColor: 'white', 
          }
    

})
