# socket-io-single-group-broadcast-chat-app

Sample of single / multi chat application using socket io 

Features:
  - log in / sign in / log out
  - single or group chat
  - show previous of all messages on current chatroom
  - alert when user join or leave from chatroom (current chatroom)
  - alert when user send broadcast/emergency message (all chatroom)
  - auto update user list and room list (after new user/room has been created)
  - store messages, rooms, usernames and passwords in database

Storages used (for messages, names of users and groups)
  - session storage (for user names)
  - database (for room , user names, messages)


Database used in this project:
  - Mysql (pool)
  - Mongodb (mongoose)
  
  
Database config files:
  - Mysql:    /models/mysql/pool.js
  - MongoDB:  /models/mongoose/schema.js
  
  
Run following scripts if you are using:
  - mysql database: server_mysql.js
  - mongoose database: server_mongoose.js
  

