import * as api from '../api/index.js';

export const getTasks = () => async (dispatch) => {
    try {
        const { data } = await api.getTasks();
        console.log(data)
        dispatch({ type: "GET_TASKS", payload: data });
    } catch (error) {
        console.log(error);
    }
};

export const getSingleTask = () => async (dispatch) => {
    try {
        const { data } = await api.getSingleTask();

        dispatch({ type: "GET_SINGLE_TASK", payload: data });

    } catch (error) {
        console.log(error);
    }
};

export const createTask = (form) => async (dispatch) => {
    try {
        const { data } = await api.createTask(form);
        
        dispatch({ type: "CREATE_TASK", payload: data });
    } catch (error) {
        console.log(error);
    }
};

export const updateTask = (id, form) => async (dispatch) => {
    try {
        const { data: data } = await api.updateTask(id, formData);

        dispatch({ type: "UPDATE_TASK", payload: data });
    } catch (error) {
        console.log(error.message);
    }
};

export const deleteTask = (id) => async (dispatch) => {
    try {
        const { data } = await api.deleteTask(id);
   
        dispatch({ type: "DELETE_TASK", payload: data });
    } catch (error) {
        console.log(error.message);
    }
};


