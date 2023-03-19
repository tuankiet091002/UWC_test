
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from "socket.io";


import authRouter from './routes/authRoute.js';
import userRouter from "./routes/userRoute.js";
import mcpRouter from "./routes/mcpRoute.js";
import truckRouter from "./routes/truckRoute.js";
import taskRouter from "./routes/taskRoute.js";
import chatRouter from "./routes/chatRoute.js";
import messageRouter from "./routes/messageRoute.js";

const app = express();
dotenv.config();

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/mcp', mcpRouter);
app.use('/truck', truckRouter);
app.use('/task', taskRouter);
app.use('/chat', chatRouter);
app.use('/mess', messageRouter);

const CONNECTION_URL = process.env.MONGO_URL;
const PORT = 5000;

mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })


const server = app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
  

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    socket.on("setup", (user) => {
        console.log(`User ${user._id} connected`)
        socket.join(user._id.toString());
        socket.to(user._id.toString()).emit("connected")
    });

    socket.on("new message", (chat) => {
        if (!chat.users) return console.log("chat.users not defined");
        
        chat.users.forEach((user) => {
            socket.to(user._id.toString()).emit("message received", user._id);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
