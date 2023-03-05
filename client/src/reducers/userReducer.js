export default (state = {users: []}, action) => {
	switch (action.type) {
		case "GET_USERS":
        case "GET_SINGLE_USER":
			return {...state, users: action.payload.result};
        case "UPDATE_USER":
            return {...state, users: state.users.map((user) => (user._id) == action.payload.result._id ? action.payload.result : user)}
		case "DELETE_USER":
			return {...state, users: state.users.filter((user) => user._id !== action.payload.result)};
		default:
			return state;
	}
};