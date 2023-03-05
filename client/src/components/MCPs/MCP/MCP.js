import React from 'react';
import { useDispatch } from 'react-redux';

import  { deleteMCP } from '../../../actions/mcpAction';

const User = ({mcp}) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteMCP(mcp._id));
    }

    return (
    <>
        <tr role="button">
            <td>{ mcp._id }</td>
            <td>{ mcp.x }</td>
            <td>{ mcp.y }</td>
            <td>{ mcp.load.$numberDecimal }</td>
            <td>{ mcp.cap }</td>
            <td><button class="btn btn-danger" onClick={handleDelete}><i class="bi bi-trash-fill"/></button></td>
        </tr>
    </>)
};

export default User;