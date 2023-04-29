import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
       // justifyContent: 'center',
    },
    view: {
        flex: 1,
        width: '100%',
    },
    title: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        color: '#000',
        fontSize: 15,
    },
    textInput: {
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
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
    }
})
