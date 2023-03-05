import * as api from '../api/index.js';

export const getMCPs = () => async (dispatch) => {
	try {
		const { data } = await api.getMCPs();

		dispatch({ type: "GET_MCPS", payload: data });
	} catch(error) {
		console.log(error);
  	}
};

export const getSingleMCP = (id) => async (dispatch) => {
    try {
        const { data } = await api.getSingleMCP(id);
        
        dispatch({ type: "GET_SINGLE_MCP", payload: data });
    } catch(error) {
        console.log(error);
    }
}

export const createMCP = (form) => async (dispatch) => {
	try {
		const { data } = await api.createMCP(form);

		dispatch({ type: "CREATE_MCP", payload: data });
	} catch(error) {
		console.log(error);
  	}
};


export const updateMCP = (id, form) => async (dispatch) => {
	try {
		const { data } = await api.updateMCP(id, form);

		dispatch({ type: "UPDATE_MCP", payload: data });
	} catch(error) {
		console.log(error);
	}
};


export const deleteMCP = (id) => async (dispatch) => {
	try {
		const { data } = await api.deleteMCP(id);

		dispatch({ type: "DELETE_MCP", payload: data });
	} catch(error) {
		console.log(error);
	}
};
