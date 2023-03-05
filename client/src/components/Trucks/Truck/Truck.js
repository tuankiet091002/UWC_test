import React from 'react';
import { useDispatch } from 'react-redux';

import  { deleteTruck } from '../../../actions/truckAction';

const User = ({truck}) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteTruck(truck._id));
    }

    return (
    <>
        <tr role="button">
            <td>{ truck._id }</td>
            <td>{ truck.driver?.name }</td>
            <td>{ truck.x.$numberDecimal }</td>
            <td>{ truck.y.$numberDecimal }</td>
            <td>{ truck.load.$numberDecimal }</td>
            <td>{ truck.cap }</td>
            <td><button class="btn btn-danger" onClick={handleDelete}><i class="bi bi-trash-fill"/></button></td>
        </tr>
    </>)
};

export default User;