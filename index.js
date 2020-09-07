const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 80;
const router = require("./router");

const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    startGame,
    getGameState,
    movePiece,
    updateBoardState,
} = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
    console.log("We have a new connection");

    socket.on("join", ({ room, random }, callback) => {
        const { error, user } = addUser({ id: socket.id, room: room, random });
        // console.log(user, error);

        if (error) {
            callback({ error });
            return socket.disconnect(true);
        }

        socket.emit("connected", {
            player: user.name,
            room: user.room,
            boardState: getGameState(user.room),
        });
        socket.emit("message", { user: "admin", text: "Welcome to the game!" });
        socket.broadcast.to(user.room).emit("message", {
            user: "admin",
            text: `User ${user.name} has joined the game!`,
        });
        socket.join(user.room);

        callback({});
    });

    socket.on("sendMessage", (message, callback) => {
        console.log("send message");
        const user = getUser(socket.id);
        if (user) {
            io.to(user.room).emit("message", {
                user: user.name,
                text: message,
            });
        }

        callback();
    });

    socket.on("startGame", (initialBoardState, callback) => {
        const user = getUser(socket.id);
        // if(getGameState(user.room)) callback(getGameState(user.room));
        // else
        startGame(initialBoardState, user.room);
    });

    socket.on("move", (moveData, callback) => {
        console.log("move");
        const user = getUser(socket.id);
        console.log(user);
        if (user) {
            // movePiece(moveData.position, moveData.destination, moveData.whoMoves, user.room);
            io.to(user.room).emit("move", moveData);
        }

        callback();
    });

    socket.on("updateBoardState", (boardState, callback) => {
        const user = getUser(socket.id);
        updateBoardState(boardState, user.room);
    });

    socket.on("disconnect", () => {
        let user = removeUser(socket.id);
        console.log("user left");
        if (user)
            io.to(user.room).emit("message", {
                user: "admin",
                text: `User ${user.name} has left the game!`,
            });
    });
});
app.use(express.static("public"));
app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
