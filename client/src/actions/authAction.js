import * as api from '../api/index.js';

export const signin = (formData, router) => async (dispatch) => {
  	try {
    	const { data } = await api.signin(formData);

    	dispatch({ type: "SIGN", payload: data });

    	router('/');
  	} catch (error) {
    	console.log(error);
  	}
};

export const signup = (formData, router) => async (dispatch) => {
  	try {
    	const { data } = await api.signup(formData);
        
    	dispatch({ type: "SIGN", payload: data });
		
    	router('/');
  	} catch (error) {
    	console.log(error);
  	}
};

export const logout = (router) => async (dispatch) => {
	try {
	  	const { data } = await api.logout();

	  	dispatch({ type: "LOGOUT", payload: data });
        
	  	router('/');
	} catch (error) {
	    console.log(error);
	}
};