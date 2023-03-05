import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Popup from 'reactjs-popup'
import ChatForm from '../Form/ChatForm.js'

import io from "socket.io-client";

import { getSingleChat, sendMessage } from "../../../actions/chatAction";

var socket;
const setIo = (function () {
    const _io = io();
    return () => _io;
})()

const Messages = ({ chat }) => {
    const initialState = { content: '' }
    const dispatch = useDispatch();
    const [content, setContent] = useState(initialState)

    const user = JSON.parse(localStorage.getItem('profile'));
    const { currChat } = useSelector(state => state.chat);
    const [open, setOpen] = useState(false);
    const closeForm = () => setOpen(false);

    useEffect(() => {
        socket = setIo()
        socket.emit("setup", user);
        socket.on('connected', () => {
            console.log('socket connected')
        })
    }, []);

    useEffect(() => {
        dispatch(getSingleChat(chat._id))
    }, [chat, dispatch])



    useEffect(() => {
        socket?.on("message received", () => {
            dispatch(getSingleChat(chat._id))
        })
    })

    const handleChange = (e) => {
        setContent({ content: e.target.value });
    }

    const handleSend = (e) => {
        dispatch(sendMessage(chat._id, content))
        socket.emit("new message", chat);
        setContent(initialState)
    }

    return (<div>
        <div class="card">
            <div class="card-header">
                <div><span> Chat in {currChat?.chat?.name}</span>
                    <span style={{ float: "right" }}>
                        <button type="button" class="btn btn-primary " onClick={() => setOpen(o => !o)}>
                            Update Chat
                        </button>
                        <Popup open={open} modal onClose={closeForm}>
                            <ChatForm chat={chat} closeForm={closeForm} />
                        </Popup>
                    </span>
                </div>
            </div>
            <div class="card-body d-flex flex-column justify-content-center" data-bs-spy="sroll" style={{ position: "relative" }}>
                {currChat.messages?.map(mess =>
                    mess.sender == user._id ?
                        <p key={mess._id} class="text-wrap small p-2 ms-3 mb-1 rounded-3 align-self-end bg-primary">{mess.content}</p> :
                        <p key={mess._id} class="text-wrap small p-2 ms-3 mb-1 rounded-3 align-self-start bg-secondary">{mess.content}</p>
                )}
            </div>
            <div class="card-footer">
                <div class="input-group">
                    <div class="input-group-prepend">Avatar Here</div>
                    <textarea name="content" class="form-control" value={content.content} placeholder="Type your message..." onChange={handleChange}></textarea>
                    <div class="input-group-append">
                        <button class="btn btn-primary" onClick={handleSend}><i class="bi bi-arrow-right" /></button>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default Messages