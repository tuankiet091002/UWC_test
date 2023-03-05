import * as api from '../api/index.js';

export const getTrucks = (query) => async (dispatch) => {
    try {
        const { data } = await api.getTrucks(query ? query : '');

        dispatch({ type: "GET_TRUCKS", payload: data });
    } catch (error) {
        console.log(error);
    }
};

export const getSingleTrucks = (id) => async (dispatch) => {
    try {
        const { data } = await api.getSingleTruck(id);

        dispatch({ type: "GET_SINGLE_TRUCK", payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const createTruck = (form) => async (dispatch) => {
    try {
        const { data } = await api.createTruck(form);

        dispatch({ type: "CREATE_TRUCK", payload: data });
    } catch (error) {
        console.log(error);
    }
};


export const updateTruck = (id, form) => async (dispatch) => {
    try {
        const { data } = await api.updateTruck(id, form);

        dispatch({ type: "UPDATE_TRUCK", payload: data });
    } catch (error) {
        console.log(error);
    }
};


export const deleteTruck = (id) => async (dispatch) => {
    try {
        const { data } = await api.deleteTruck(id);

        dispatch({ type: "DELETE_TRUCK", payload: data });
    } catch (error) {
        console.log(error);
    }
};
