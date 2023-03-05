import React from 'react'
import { useDispatch } from 'react-redux';

import { deleteTask } from '../../../actions/taskAction';

const Task = ({ idx, task }) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteTask(task._id));
    }
    return (
        <tr role="button">
            <td>{idx}</td>
            <td>
                {task.collector.name}
            </td>
            <td>
                {task.truck}
            </td>
            <td>
                {task.path.map(x => x._id).join("->")}
            </td>
            <td>
                {new Date(task.date).toLocaleDateString()}
            </td>
            <td>
                {task.shift}
            </td>
            <td>
                {task.checkIn ? new Date(task.checkIn).toLocaleString() : "Not check in"}
            </td>
            <td>
                {task.checkOut ? new Date(task.checkOut).toLocaleString() : "Not check out"}
            </td>
            <td>
                {task.state}
            </td>
            <td><button class="btn btn-danger" onClick={handleDelete}><i class="bi bi-trash-fill" /></button></td>
        </tr>
    )
}

export default Task