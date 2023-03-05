import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getChats } from "../../actions/chatAction";
import Messages from "./Message/Messages.js"
import Popup from 'reactjs-popup'
import ChatForm from './Form/ChatForm.js'


const Chats = () => {
    const initialState = { name: '' };
    const dispatch = useDispatch();
    const { chats } = useSelector((state) => state.chat);
    const [searchQuery, setSearchQuery] = useState(initialState)
    const [currentChat, setChat] = useState(null);
    const [open, setOpen] = useState(false);
    const closeForm = () => setOpen(false);

    const handleChange = (e) => {
        setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });

    }
    const clear = () => {
        setSearchQuery(initialState);
    }

    useEffect(() => {
        dispatch(getChats(searchQuery));
    }, [searchQuery])

    return (<>
        <div class="d-flex flex-column flex-shrink-0 border border-right border-primary p-3" style={{ width: "280px", height: "100vh", float: "left" }}>
            <h1> Chat <span style={{float:"right"}}>
                <button type="button" class="btn btn-primary " onClick={() => setOpen(o => !o)}>
                    Create Chat
                </button>
                <Popup open={open} modal onClose={closeForm}>
                    <ChatForm closeForm={closeForm} />
                </Popup>
            </span></h1>
            <div class="input-group mb-3">
                <input type="text" class="form-control" name="name" value={searchQuery.name} onChange={handleChange} />
                <div class="input-group-append">
                    <span class="input-group-text"><i class="bi bi-x" role="button" onClick={clear} /></span>
                </div>
            </div>
            <ul class="list-group">
                {
                    chats.map(chat => <li class="list-group-item" key={chat._id} role="button" onClick={() => setChat(chat)}>
                        {chat.name}
                    </li>)
                }
            </ul>
        </div>
        {currentChat ? <Messages chat={currentChat} /> : <></>}
    </>)
}

export default Chats