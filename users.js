const WHITE = "WHITE";
const BLACK = "BLACK";
const uniqueId = require("uniqid");

// const users = [];

const rooms = []; //{users, game, isStarted, random, id}
const roomBoardState = {};

const addUser = ({ id, room, random }) => {
    let name = WHITE;
    let roomId = room || uniqueId();
    roomId = roomId.trim();
    if (random === "true") {
        console.log("random");
        let availableRoom = rooms.find((v) => !v.started && v.random);
        if (availableRoom) {
            // const existingUser = availableRoom.users.find((user) => user.name === name);
            name = BLACK;
            const user = { id, name, room: availableRoom.id };
            availableRoom.users.push(user);
            availableRoom.started = true;
            return { user };
        } else {
            const user = { id, name, room: roomId };
            rooms.push({
                users: [user],
                started: false,
                id: roomId,
                random: true,
            });
            return { user };
        }
    }
    if (room) {
        const roomObj = rooms.find((r) => r.id === room);
        if (!roomObj) {
            const user = { id, name, room: roomId };
            rooms.push({
                users: [user],
                started: false,
                id: roomId,
                random: false,
            });
            return { user };
        }
        if (roomObj.users.length >= 2)
            return { error: "Game is currently going" };
        name = roomObj.users.some((v) => v.name === WHITE) ? BLACK : WHITE;
        const user = { id, name, room: roomObj.id };
        roomObj.users.push(user);
        roomObj.started = true;
        return { user };
    } else {
        const user = { id, name, room: roomId };
        rooms.push({
            users: [user],
            started: false,
            id: roomId,
            random: true,
        });
        console.log(rooms);
        return { user };
    }
};
const removeUser = (id) => {
    const roomIndex = rooms.findIndex((room) =>
        room.users.some((v) => v.id === id)
    );
    if (roomIndex === -1) return;
    const index = rooms[roomIndex].users.findIndex((user) => user.id === id);

    if (rooms[roomIndex].users.length === 1) {
        console.log("delete room state");
        delete roomBoardState[rooms[roomIndex].id];
        return rooms.splice(roomIndex, 1)[0].users[index];
    }
    const user = { ...rooms[roomIndex].users[index] };
    return rooms[roomIndex].users.splice(index, 1)[0];

    // if (index !== -1) {
    //     if (users.filter((u) => users[index].room === u.room).length === 1) {
    //         console.log('delete room state');
    //         delete roomBoardState[users[index].room];
    //     }

    // }
};

const getUser = (id) => {
    const roomIndex = rooms.findIndex((room) =>
        room.users.some((v) => v.id === id)
    );
    console.log(rooms);
    console.log(id);
    console.log(rooms[0].users);
    console.log(roomIndex);
    if (roomIndex === -1) return;
    const index = rooms[roomIndex].users.findIndex((user) => user.id === id);
    return rooms[roomIndex].users[index];
};
// const getUsersInRoom = () => {
//     return users.filter((user) => user.room === room);
// };

const startGame = (initialBoardState, room) => {
    roomBoardState[room] = initialBoardState;
};

const updateBoardState = (boardState, room) => {
    console.log("updated");
    roomBoardState[room] = boardState;
};

const getGameState = (room) => {
    return roomBoardState[room];
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    startGame,
    getGameState,
    updateBoardState,
};
