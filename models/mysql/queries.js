
 var mysql=require('mysql');
exports.execute=function(mysql_pool){
    
    return{
        save_new_room   : function(params,socket,callback){
            var params=Object.assign(params,{socket_id: socket.id});
            var sql=mysql.format("INSERT INTO rooms (room_no,user_id) VALUES(?,?)",[params.room_no,params.user_id]);
            mysql_pool.query(sql,function(err,result){
                if(err) console.log(err);
                //console.log('save() is ok: ',result);
                callback(socket);
            })
        },
        fetch_msg_history : function(params, socket,callback){
            
            var sql=mysql.format("SELECT * FROM messages WHERE room_id=?",[params.room_id]);
            mysql_pool.query(sql,function(err,result){
                if(err) console.log(err);
                //console.log('fetch_msg_history() is ok: ',result);
                callback(result);
            });
        },

        fetch_room_list : function(socket,callback){
            var sql=mysql.format("SELECT * FROM rooms");
            mysql_pool.query(sql,function(err,result){
                if(err) console.log(err);
                //console.log('fetch_room_list() is ok: ',result);
                callback(socket,result,'rooms');
            });
        },

        fetch_all_users: function(socket,callback){
            var sql=mysql.format("SELECT * FROM users");
            mysql_pool.query(sql,function(err,result){
                if(err) console.log(err);
               // console.log('fetch_all_users() is ok: ',result);
                callback( socket, result,'users' );
            });
        },
        save_message:function(params,socket,callback){
            var params=Object.assign(params,{socket_id: socket.id});
            var sql=mysql.format("INSERT INTO messages (user_id,room_id,msg) VALUES(?,?,?)",[params.user_id,params.room_id,params.msg]);
            mysql_pool.query(sql,function(err,result){
                if(err) console.log(err);
                //console.log('save_message() is ok: ',result);
                callback();
            });
        },

        log_in: function(params,socket,callback,alert_msg){
            console.log('log_in: ',params);
            var sql=mysql.format("SELECT * FROM users WHERE name=? and password=?",[params.name,params.password]);
            mysql_pool.query(sql,function(err,result){
                if(err) {
                    console.log(err);
                    //alert_msg(socket,msg="User name or password is wrong");
                }
                console.log('log_in() is ok: ',result);
                if(result.length){
                    
                    var sql=mysql.format("UPDATE users SET is_online=? WHERE name=? and password=? ",[true,params.name,params.password]);
                    mysql_pool.query(sql,function(err,result){
                        if(err) console.log(err);
                        callback(socket);
                    });
                }
                else{
                    alert_msg(socket,msg="Wrong username or password",1);
                }
                
            });
        },
        
        sing_in :function(params,socket,callback){
            
            var sql=mysql.format("INSERT INTO users (name,password,is_online) VALUES(?,?,?)",[params.name,params.password,true]);
            mysql_pool.query(sql,function(err,result){
                if(err) console.log(err);
                //console.log('sing_in() is ok: ',result);
                if(result){
                    callback(socket);
                }
            });

        },

        log_out : function(params,socket,callback){
            var sql=mysql.format("UPDATE users SET is_online=? WHERE name=?",[false,params.name]);    
            mysql_pool.query(sql,function(err,result){
                if(err) console.log(err);
                //console.log('log_out() is ok: ',result);
            });
        },



    }
}