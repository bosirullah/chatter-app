const socket = io();
const chatMessages = $(".chat-messages");
const textMsg = $("#msg");  
const roomName = $(".room-name");
const usersList = $("#userList");

//Get username and room from URL
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});

// join chatroom
socket.emit("joinRoom",{username,room,origin});

// Get room and users
socket.on("roomUsers",({room,users}) =>{
    outputRoomName(room);
    outPutUsers(users);
})


$("#chat-form").on("submit",(e)=>{
    //when we submit a form it automatically submits to a file so to prevent that from happening we use preventDefault().
    //it prevents the default behaviour
    e.preventDefault();
    //textMsg.val() gets the value of input field entered by a user.
    //if the value is empty i.e user hasn't typed anything or typing a new message then only enter the if condition
    if(textMsg.val()){
        //now we are sending the messsage to the server using 'emit' and gave it a name chat-message and sending
        // the message entered by the user
        socket.emit('chat-message',textMsg.val());

        //making the value empty , so that user can type a new message.
        textMsg.val("");
    }
})

socket.on("other-messages",(msg)=>{
    chatMessages.append(
        `
            <div class="other-message">
                <p class="meta">${msg.username} <span> ${msg.time} </span></p>
                <p class="text"> ${msg.text}</p>
            </div>
        `
    )
})

socket.on('chat-message', function(msg) {

    console.log(msg.origin);
    if(msg.origin === "left"){
        chatMessages.append(
            `
                <div class="message-me">
                    <p class="meta">${msg.username} <span> ${msg.time} </span></p>
                    <p class="text"> ${msg.text}</p>
                </div>
            `
        ) 
        msg.origin = "right";
    }
    else{
        chatMessages.append(
            `
                <div class="message-other">
                    <p class="meta">${msg.username} <span> ${msg.time} </span></p>
                    <p class="text"> ${msg.text}</p>
                </div>
            `
        )
        msg.origin = "left";
    }
    
    // window.scrollTo(0, document.body.scrollHeight);
});

// Add room name to DOM
function outputRoomName(room){
    roomName.text(room);
}

// Add users to DOM
function outPutUsers(users){
    usersList.html(
        `${users.map(user => `<li>${user.username}</li>`).join('')}`
    );    
}

$(".leave").on("click",()=>{
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = "/";
    }
})

