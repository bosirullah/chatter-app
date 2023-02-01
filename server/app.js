const express = require("express");
const port = process.env.PORT || 3000;
const http = require("http");
const formatMessage = require("../utils/messages");

const botName = "chatterBot"

const app = express();

const server = http.createServer(app);
const socketIo = require("socket.io");
const { format } = require("path");
const io = socketIo(server);
const {userJoin,getCurrentUser,userLeave,getRoomUsers,getAllUsers} = require("../utils/users");


app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/",(req,res) => {
    res.render("index");
});

app.get("/chat",(req,res)=>{
    res.render("chat");
})

const ids = [];

io.on("connection",(socket)=>{
    socket.on("joinRoom",({username,room,origin}) =>{
        const user = userJoin(socket.id,username,room,origin);
        socket.join(user.room);

        ids.push(user.id);
        io.to(user.room).emit("ids",ids);
        
        // let len = ids.length;
        if(ids.length>=2){
            if(ids[ids.length-1] !== ids[ids.length-2]){
                user.origin = "left";
            }
            else{
                user.origin = "right";
            }
        }

        //Welcomes a new user
        socket.emit("other-messages",formatMessage(botName,"Welcome to Chatter"));
        //Broadcasts a message whenever a user connects
        socket.broadcast
            //this will only broadcast to a specific room i.e user.room (whatever ther room user chooses)
            .to(user.room)
            .emit("other-messages",formatMessage(botName,`${user.username} has joined the chat`));

        // send users and room info
        io.to(user.room).emit("roomUsers",{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })

    //Listens for chat-message
    socket.on("chat-message",(msg) => {
        //emits to everyone
        const user = getCurrentUser(socket.id);
        
        const allUsers = getAllUsers();
        

        io.to(user.room).emit("chat-message",formatMessage(user.username,msg,user.origin));
    })
    
    //runs when a user disconnects
    socket.on("disconnect",()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit("other-messages",formatMessage(botName,`${user.username} has left the chat`));
            // send users and room info
            io.to(user.room).emit("roomUsers",{
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    })
})

server.listen(port,() => {
    console.log(`Server is running on port ${port} ....`);
});

