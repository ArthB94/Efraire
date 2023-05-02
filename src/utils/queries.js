import db from '../utils/db';

export const createTable = async (nameDB, variables) => {
    try {
        await db.transaction(async (tx) => {
            await tx.executeSql(
                'CREATE TABLE IF NOT EXISTS ' + nameDB + ' (' + variables + ')'
            );
        });
    } catch (e) {
        console.log(e)
    }
}
export const insertData = async (nameDB, variables, values) => {
    try {
        await db.transaction(async (tx) => {
            await tx.executeSql(
                'INSERT INTO ' + nameDB + ' (' + variables + ') VALUES (' + values + ')'
            );
        });
    }
    catch (e) {
        console.log(e)
    }
}
export const selectData = async (nameDB, variables, condition) => {
    try {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT ' + variables + ' FROM ' + nameDB + ' ' + condition,
                (tx, results) => {
                    var len = results.rows.length;
                    var data = [];
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        data.push(row);
                    }
                    return data
                })
        })
    } catch (e) {
        console.log(e)
    }
}
export const updateData = async (nameDB, updates, condition) => {
    //exemple:     UPDATE Users SET Name = Jean Age = 50 WHERE ID = 2;
    try {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE ' + nameDB + ' SET ' + updates + ' ' + condition
            )
        })
    } catch (e) {
        console.log(e)
    }
}
export const deleteData = async (nameDB, condition) => {
    try {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM ' + nameDB + ' ' + condition
            )
        })
    } catch (e) {
        console.log(e)
    }
}

export const showUsers = async () => {
    try{
        result=selectData('Users', '*', '')
        for(row in result) {
            console.log("Name: "+row.Name+" Age: "+row.Age+" Password: "+row.Password);
        }
    }
    catch(e){
        console.log(e)
    }

}
export const dropTable = async (nameDB) => {
    try {
        db.transaction((tx) => {
            tx.executeSql(
                'DROP TABLE ' + nameDB
            )
        })
    } catch (e) {
        console.log(e)
    }
}