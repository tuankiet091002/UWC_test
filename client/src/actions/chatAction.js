import * as api from '../api/index.js';

export const getChats = (query) => async (dispatch) => {
    try {
        const { data } = await api.getChats(query);

        dispatch({ type: "GET_CHATS", payload: data });
    } catch (error) {
        console.log(error);
    }
};

export const getSingleChat = (id) => async (dispatch) => {
    try {
        const { data: chat } = await api.getSingleChat(id);

        const { data: messages } = await api.getMessages(id);

        dispatch({ type: "GET_SINGLE_CHAT", payload: { chat, messages } });
    } catch (error) {
        console.log(error);
    }
}

export const sendMessage = (id, form) => async (dispatch) => {
    try {
        const { data } = await api.sendMessage(id, form);

        dispatch({ type: "SEND_MESSAGE", payload: data });
    } catch (error) {
        console.log(error);
    }
};

export const createChat = (form) => async (dispatch) => {
    try {
        const { data } = await api.createChat(form);

        dispatch({ type: "CREATE_CHAT", payload: data });
    } catch (error) {
        console.log(error);
    }
};


export const updateChat = (id, form) => async (dispatch) => {
    try {
        const { data } = await api.updateChat(id, form);

        dispatch({ type: "UPDATE_CHAT", payload: data });
    } catch (error) {
        console.log(error);
    }
};


export const deleteChat = (id) => async (dispatch) => {
    try {
        const { data } = await api.deleteChat(id);

        dispatch({ type: "DELETE_CHAT", payload: data });
    } catch (error) {
        console.log(error);
    }
};
