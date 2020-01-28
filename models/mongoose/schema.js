var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/test_db');
var Schema=mongoose.Schema;


var MessageUserSchema = new Schema({
    user_id     :   String,
    user_type   :   String,
    device_uuid :   String,
    UUID        :   String,
    socket_id   :   String,
    active_type :   {type:Number, default:1},
    login_type  :   String,
    logout_time :   String,
    reg_date    :   String,
    room_id     :   String,
    msg         :   String,
});

var MessageRoomSchema= new Schema({
    user_id     :   String,
    user_type   :   String,
    socket_id   :   String,
    room_no     :   {type:String, default:'0'},
    reg_date    :   String,
});

var UserDataSchema = new Schema({
    name        :   {type:String, unique:true,required:true},
    password    :   String,
    is_online   :   {type:Boolean,default:true},
    reg_date    :   String,
})




//test schema
var userTestSchema= new Schema({
    name: String,
    username: String,
    /* username:{
        type: String,required:true, unique:true
    }, */
    password:{type: String,required: true },
    admin: Boolean,
    location: String,
    meta: {
        age: Number,
        website: String
    },
    created_at: Date,
    updated_at: Date
});

//extra functions
userTestSchema.methods.dudify=function(){
    this.name=this.name+'-dude';
    return this.name;
}

userTestSchema.pre('save',function(next){
    var currentDate=new Date();
    this.updated_at=currentDate;
    if(!this.created_at)
        this.created_at=currentDate;
    next();
});

MessageRoomSchema.pre('save',function(next){
    
    this.reg_date=new Date();
    next();
    
});
MessageUserSchema.pre('save',function(next){
    
    this.reg_date=new Date();
    next();
    
});
UserDataSchema.pre("save",function(next){
    this.reg_date=new Date();
    next();
})


const MessageUserSchema_m   = mongoose.model('MessageUserSchema',MessageUserSchema);
const MessageRoomSchema_m   = mongoose.model('MessageRoomSchema',MessageRoomSchema);
const UserDataSchema_m      = mongoose.model('UserDataSchema',UserDataSchema);



/* module.exports.getMessageUserSchema=function(){return MessageUserSchema_m};
module.exports.getMessageRoomSchema=function(){return MessageRoomSchema_m}; */

  exports.schema_list=function(mongoose){
    return {
        getMessageUserSchema : function(){
            return MessageUserSchema_m;
        },
        getMessageRoomSchema : function(){
            return MessageRoomSchema_m;
        },
        getUserDataSchema    : function(){
            return UserDataSchema_m;
        }
    }
}  