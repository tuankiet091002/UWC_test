export default (state = { chats: [], currChat: [] }, action) => {
    switch (action.type) {
        case "GET_CHATS":
            return { ...state, chats: action.payload.result };
        case "GET_SINGLE_CHAT":
            return { ...state, currChat: { chat: action.payload.chat.result, messages: action.payload.messages.result } }
        case "SEND_MESSAGE":
            return { ...state, currChat: { ...state.currChat, messages: [...state.currChat.messages, action.payload.result] } }
        case "CREATE_CHAT":
            return { ...state, chats: [...state.chats, action.payload.result] }
        case "UPDATE_CHAT":
            return { ...state, chats: state.chats.map((chat) => (chat._id) == action.payload.result._id ? action.payload.result : chat), currChat: { chat: action.payload.result, messages: state.currChat.messages } }
        case "DELETE_CHAT":
            return { ...state, chats: state.chats.filter((chat) => chat._id !== action.payload.result._id) };
        default:
            return state;
    }
};