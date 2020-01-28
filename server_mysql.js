var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var queries=require('./models/mysql/queries');
var pool_module=require('./models/mysql/pool');
var mysql_pool=pool_module.get_pool(mysql);

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('models',path.join(__dirname, 'models'));
app.set('view engine', 'ejs');
app.set('port', 8000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', function(req, res) {
    res.render('index');
 });



const httpsServer = http.createServer(app);

httpsServer.listen(app.get('port'), function(req,res){
    console.log('running server on port: '+app.get('port'));
    console.log('Socket IO server has been started');
}); 

var io = require('socket.io').listen(httpsServer);
var imessage_io = io.of('/imessage');

//to store room and user data
var rooms=[];
var users=[];

imessage_io.on('connection',function(socket){
     
    update_rooms(socket);
    update_users(socket);

   

    socket.on('room:create',function(param){
        
        console.log('someone created room: '+param.room_no);
        queries.execute(mysql_pool).save_new_room(param,socket,update_rooms);
       
    });

    socket.on('user:create',function(param){

        console.log('user created : '+param);
        queries.execute(mysql_pool).sing_in(param,socket,update_users);
    });

    socket.on('user:login',function(param){
        console.log('user login: ',param);
        socket.username=param.name;
        queries.execute(mysql_pool).log_in(param,socket,update_users,alert_msg);
    });

    socket.on('user:logout',function(param){
        console.log('user logout ',param);
        queries.execute(mysql_pool).log_out(param,socket,update_users);
    });

    socket.on('room:open',function(param){
        console.log('room is opening: ',param);
    
        var url='/chat?room='+param.room_name+'&user='+param.user_name;
        
        socket.emit('room:redirect',encodeURI(url));

    });

    //socket from chat.ejs
    socket.on('room:start',function(param){
        if(param.room_id&&param.user_id) {
            queries.execute(mysql_pool).fetch_msg_history(param,socket,function(data){
                if(data){
                    
                    if(socket.room) socket.leave(socket.room_id);   
                    socket.join(param.room_id);
                    socket.room=param.room_id;
                    socket.username=param.user_id;
                    //print all previous messages
                    socket.emit('msg:history',data);
                    //broadcast alert of joining message to all users in current room
                    imessage_io.in(param.room_id).emit('room:alert','<b>\''+param.user_id+'\'</b> has joined this room');
                }
            });
        }
    });
 
    socket.on('msg:msg_fetch',function(param){
        if(param.room_id){
            
        }
    });
    socket.on('msg:send',function(param){
        console.log('received new msg: ',param);
         
        if(param.room_id&&param.msg&&param.user_id){
             
            queries.execute(mysql_pool).save_message(param,socket,function(data){
                console.log('new msg saved: ');
                imessage_io.in(param.room_id).emit('msg:last',param);
            });
        }
    });
    socket.on('msg:broadcast',function(param){
        if(param.name&&param.msg){
            imessage_io.emit('msg:broadcast',{name:param.name,msg:param.msg});
        }
    });

    socket.on('disconnect',function(param){

        console.log('leaving: ',socket.username);
        imessage_io.in(socket.room).emit('room:alert','<b>\''+socket.username+'\'</b> has left from this room');

    });
    
    
});

function update_rooms(socket){
    console.log('update_rooms');
    try{
        queries.execute(mysql_pool).fetch_room_list(socket,store_callback_data);
    }
    catch(e) {console.log(e);}    
}
function update_users(socket){
    try{
        queries.execute(mysql_pool).fetch_all_users(socket,store_callback_data);
    }
    catch(e){console.log(e);}    
}
function alert_msg(socket,msg){
    console.log('alert_msg(): ',msg);
    if(msg){
        socket.emit('alert',{msg:msg,code:code});
    }
}

function store_callback_data(socket,data,type){
    
    if(data){
        switch(type){
            case 'rooms':
                rooms=[];
                for(row in data){       
                    rooms.push(data[row].room_no);
                }
                //socket.emit('room:room_list',data); 

                imessage_io.emit('room:room_list',data); //broadcast room update
                break;
            case 'users':
                users=[];
                for(row in data){
                    var obj={};
                    obj[data[row].name]=data[row].is_online;
                    users.push(obj);
                }   
                imessage_io.emit('user:user_list',data);
                break;
    
        }
        //console.log('rooms: ',rooms);
        //console.log('users: ',users);
    }

}

app.get('/chat',function(req,res){
    var room_name=req.query.room;
    var user_name=req.query.user;
  
    res.render('chat',{room_name:room_name,user_name:user_name});

});

app.post('/signin',function(req,res){
    var name=req.body.name;
    var password=req.body.password;
    console.log('name: '+name+'\npass: '+password);
    var send_param={
        name:name,
        password:password,
    }
    queries.execute(mysql_pool).sing_in(send_param,function(socket){
        //console.log(data);
        update_rooms(socket);
        update_users(socket);
        //res.json(data);
    });
});

app.post('/login',function(req,res){
    var name=req.body.name;
    var password=req.body.password;
    console.log('name: '+name+'\npass: '+password);
    var send_param={
        name:name,
        password:password,
    }
    queries.execute(mysql_pool).log_in(send_param,function(socket){
        update_rooms(socket);
        update_users(socket); 
    })
});

app.post('/logout',function(req,res){
    var name=req.body.name;
    queries.execute(mysql_pool).log_out({name:name},function(data){
        res.json(data);
    });

});

 

