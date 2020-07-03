const WHITE = 'WHITE';
const BLACK = 'BLACK';
const uniqueId = require('uniqueid');

const users = [];
const roomBoardState = {};

const addUser = ({id, room}) => {
    let name = WHITE;
    let roomId = room.trim().toLowerCase() || uniqueId();
    const existingUser = users.find((user) => user.room ===roomId && user.name === name);
    if(existingUser) name = BLACK;
    // room = room.trim().toLowerCase();
    let roomUsers = users.filter((user)=> user.room ===roomId);

    if(roomUsers.length>=2){
        return {error: 'Game has already started!!!'};
    }

    const user = {id, name, room: roomId};

    users.push(user);
    return {user};


};
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    // console.log(users.filter((u)=> users[index].room===u.room ));
    // console.log(users.filter((u)=> users[index].room===u.room ));
    // console.log(index);


    if(index !== -1){
        if(users.filter((u)=> users[index].room===u.room ).length === 1) {
            console.log('delete room state');
            delete roomBoardState[users[index].room];
        }
        return users.splice(index, 1)[0];
    }

};


const getUser = (id) => {
    return users.find((user) => user.id === id)
};
const getUsersInRoom = () => {
    return users.filter((user)=>user.room===room);
};

const startGame = (initialBoardState, room)=>{
    roomBoardState[room] = initialBoardState;

};

const updateBoardState = (boardState, room)=>{
    console.log('updated');
    roomBoardState[room] = boardState;
};

const getGameState = (room)=>{
    return roomBoardState[room];
};



module.exports = {addUser, removeUser, getUser, getUsersInRoom, startGame, getGameState, updateBoardState};