exports.execute=function(schema_module){

    return{
        save_new_room:   function(params,socket,callback){
            var param=Object.assign(params,{socket_id: socket.id});
            try{
                
                var insert=new schema_module(param);
                insert.save(function(err,insert){
                    if(err) return console.error(err);
                    //console.log('save() is ok: ',insert);
                    callback(socket);
                });

            }
            catch(e){
                console.log('error on query module: save func',e);
            }
        },

        fetch_msg_history : function(params, socket,callback){
            try{
                schema_module.find({room_id:params.room_id},function(err,room_list){
                    if(err) return console.error(err);
                    if( !callback || callback == undefined ){
                        return room_list;
                    }else{
                        callback(  room_list );
                    }
                });
            }
            catch(e){
                console.log('error on query module: join func',e);
            }
        },

        fetch_room_list: function(socket,callback){
            
            try{
                
                schema_module.find({},function(err,room_list){
                    if(err) return console.error(err);
                    //console.log('fetch all() is ok: ',room_list);
                    //return room_list;
                    if( !callback || callback == undefined ){
                        return room_list;
                    }else{
                        callback(socket,  room_list,'rooms' );
                    }
                });


            }catch(e){
                console.log('error on query module: fetch list func:',e);

            }
        },
        
        fetch_all_users: function(socket,callback){
            try{
                schema_module.find({},function(err,result){
                    if(err) return console.error(err);
                    else callback( socket, result,'users' );
                })

            }
            catch(e){
                console.log('error on query module: fetch all users func:',e);
            }

        },

        save_message:function(params,socket,callback){
            var params=Object.assign(params,{socket_id: socket.id});

            try{
                var save_msg=new schema_module(params);
                save_msg.save(function(err,save_msg){
                    if(err) console.error(err);
                    callback();
                });
            }
            catch(e){
                console.log('error on query module: save msg func:',e);
            }
        },

        log_in: function(params,socket,callback,alert_msg){
            try{
                schema_module.find({name:params.name,password:params.password},function(err,result){
                    if(err)     console.error(err);
                    if(result.length) {
                        schema_module.findOneAndUpdate({name:params.name,password:params.password},{is_online:true},function(err,result2){
                            if(err) console.error(err);
                            callback(socket);
                        });
                    
                    }
                    else{
                        alert_msg(socket,msg="Wrong username or password",1);
                    }
                    
                });
            }
            catch(e){
                console.log('error on query module: sign in: ',e);
            }
        },

        sing_in:function(params,socket,callback){
            try{
                var save=new schema_module(params);
                save.save(function(err,save){
                    if(err) console.error(err);
                    else callback(socket);
                });
            }
            catch(e){
                console.log('error on query module: sign in: ',e);
            }
        },

        log_out:function(params,socket,callback){
            try{
                schema_module.findOneAndUpdate({name:params.name},{is_online:false},function(err,result){
                    if(err) console.error(err);
                    else callback(socket);
                });
            }
            catch(e){
                console.log('error on query module: sign in: ',e);
            }
        },

        change_status:function(params,callback){
            console.log('change_status in mongoose');
            try{
                schema_module.findOneAndUpdate({name:params.name,password:params.password},{is_online:true},function(err,result){
                    if(err) console.error(err);
                    else callback(result);
                });
            }
            catch(e){
                console.log('error on query module: change status: ',e);
            }
        }
    }
}
