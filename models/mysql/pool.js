 
/* var connection=mysql.createConnection({
    host        :   'remotemysql.com',
    user        :   '5CjE1VKLC7',
    password    :   'BUIPQz3VnN',
    database    :   '5CjE1VKLC7',

});

connection.connect(function(err){
    if(err) console.error(err);
    else    console.log('mysql is connected');

}); */



exports.get_pool=function(mysql){
    var pool    = mysql.createPool({
        connectionLimit :   50,
        host            :   'remotemysql.com',
        user            :   '5CjE1VKLC7',
        password        :   'BUIPQz3VnN',
        database        :   '5CjE1VKLC7',
        debug           :   false,
    });
    pool.on('connection',function(connection){
        console.log('mysql pool is connected (ID): ',connection.threadId);
    });
    pool.on('acquire', function (connection) {
        console.log('****Connection is acquired (ID): ',connection.threadId);
    });
    pool.on('release', function (connection) {
        console.log('****Connection %d released', connection.threadId);
    });
    return pool;
}