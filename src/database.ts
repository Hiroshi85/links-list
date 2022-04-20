import mysql, {Pool, PoolConnection} from "mysql2";
import {database} from "./keys";

const poolSync: Pool = mysql.createPool(database);

poolSync.getConnection((err, connection: PoolConnection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST')
            console.error('DATABASE CONNECTION WAS CLOSED');
        
        if(err.code === 'ER_CON_COUNT_ERROR')
            console.error('DATABASE HAS TOO MANY CONNECTIONS');
        
        if (err.code === 'ECONNREFUSED')
            console.error('DATABASE CONNECTION WAS REFUSED');
        console.error(err.message);
    }

    if (connection){
        connection.release();
        console.log('DB is connected');
    }
    
    return;
})

const pool = poolSync.promise();
export default pool;