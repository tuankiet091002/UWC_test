import * as api from '../api/index.js';

export const getUsers = (query) => async (dispatch) => {
	try {
		const { data } = await api.getUsers(query);
        
		dispatch({ type: "GET_USERS", payload: data });
	} catch(error) {
		console.log(error);
  	}
};

export const getSingleUser = (id) => async (dispatch) => {
    try {
        const { data } = await api.getSingleUser(id);
        
        dispatch({ type: "GET_SINGLE_USER", payload: data });
    } catch(error) {
        console.log(error);
    }
}

export const deleteUser = (id) => async (dispatch) => {
	try {
		const { data } = await api.deleteUser(id);

		dispatch({ type: "DELETE_USER", payload: data });
	} catch(error) {
		console.log(error);
	}
};
