const users = [];

// Join user to chat
function userJoin(id,username,room,origin){
    const user = {id,username,room,origin};
    users.push(user);
    return user;
}

//Get current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

//Get all users
function getAllUsers(){
    return users;
}



// user leaves chat
function userLeave(id){
    // for each user we want to find the user.id is equal to the id that is passed in that will give us the index
    const index = users.findIndex(user => user.id === id);
    if( index !== -1){
        return users.splice(index,1)[0];
    }
}

// Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getAllUsers
}