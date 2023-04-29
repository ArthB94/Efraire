import SQLite from 'react-native-sqlite-storage';

export default SQLite.openDatabase(
    {
      name: 'MainDB',
      location: 'default',
    },
    () => {},
    error => {
      console.log("tema l'erreur de battard" + error);
    }
  );
  