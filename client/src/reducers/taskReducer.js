export default (state = { tasks: [] }, action) => {
    switch (action.type) {
        case "GET_TASKS":
        case "GET_SINGLE_TASK":
            return { ...state, tasks: action.payload.result };
        case "CREATE_TASK":
            return { ...state, tasks: [...state.tasks, action.payload.result] }
        case "UPDATE_TASK":
            return { ...state, tasks: state.tasks.map((task) => (task._id) == action.payload.result._id ? action.payload.result : task) }
        case "DELETE_TASK":
            return {...state, tasks: state.tasks.filter((task) => task._id !== action.payload.result._id)};
        default:
            return state;
    }
};