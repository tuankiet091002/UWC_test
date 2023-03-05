export default  (state = { auth: null }, action) => {
	switch (action.type) {
		case "SIGN":
			localStorage.setItem('profile', JSON.stringify({...action.payload.result}));
            localStorage.setItem('token', JSON.stringify(action.payload.token));
			return {...state, auth: action.payload.result}
		case "LOGOUT":
			localStorage.clear();
			return { ...state, auth: null};
		default:
			return state;
	}
};
