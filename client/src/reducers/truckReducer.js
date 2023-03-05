export default (state = {trucks: []}, action) => {
	switch (action.type) {
		case "GET_TRUCKS":
        case "GET_SINGLE_TRUCK":
			return {...state, trucks: action.payload.result};
        case "CREATE_TRUCK":
            return {...state, trucks: [...state.trucks, action.payload.result]}
        case "UPDATE_TRUCK":
            return {...state, trucks: state.trucks.map((truck) => (truck._id) == action.payload.result._id ? action.payload.result : truck)}
		case "DELETE_TRUCK":
			return {...state, trucks: state.trucks.filter((truck) => truck._id !== action.payload.result._id)};
		default:
			return state;
	}
};