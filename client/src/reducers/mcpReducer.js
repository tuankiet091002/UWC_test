export default (state = {mcps: []}, action) => {
	switch (action.type) {
		case "GET_MCPS":
        case "GET_SINGLE_MCPS":
			return {...state, mcps: action.payload.result};
        case "CREATE_MCP":
            return {...state, mcps: [...state.mcps, action.payload.result]}
        case "UPDATE_MCP":
            return {...state, mcps: state.mcps.map((mcp) => (mcp._id) == action.payload.result._id ? action.payload.result : mcp)}
		case "DELETE_MCP":
			return {...state, mcps: state.mcps.filter((mcp) => mcp._id !== action.payload.result._id)};
		default:
			return state;
	}
};