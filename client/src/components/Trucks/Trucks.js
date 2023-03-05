import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Popup from 'reactjs-popup'

import { getTrucks } from "../../actions/truckAction";
import Truck from './Truck/Truck.js'
import TruckForm from './Form/TruckForm'

const Trucks = () => {
    const dispatch = useDispatch();
    const { trucks } = useSelector((state) => state.truck);
    const [open, setOpen] = useState(false);  
    const closeForm = () => setOpen(false);

    useEffect(() => {
        dispatch(getTrucks());
    }, [dispatch]);

    return (
    <>
        <h1>Trucks List</h1>
        <div class="input-group mb-3">
            <button type="button" class="ms-3 btn btn-primary " onClick={() => setOpen(o => !o)}>
                Add Truck
            </button>
            <Popup open={open} modal onClose={closeForm}>
                <TruckForm closeForm={closeForm}/>
            </Popup>

        </div>
        {!trucks.length ? <div class="spinner-border" role="status"/> : 
        <table class="table">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Driver</th>
                <th scope="col">X</th>
                <th scope="col">Y</th>
                <th scope="col">Load</th>
                <th scope="col">Capacity</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
        {trucks.map((truck) => <Truck truck={truck} key={truck._id}/>)}
        </tbody>
        </table>}   
    </>)
}

export default Trucks