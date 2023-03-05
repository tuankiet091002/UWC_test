import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Popup from 'reactjs-popup'
import { getTasks } from "../../actions/taskAction";

import Task from './Task/Task.js';
import TaskForm from './Form/TaskForm.js'

function Tasks() {
    const dispatch = useDispatch();
    const { tasks } = useSelector((state) => state.task)
    const [open, setOpen] = useState(false);
    const closeForm = () => setOpen(false);

    useEffect(() => {
        dispatch(getTasks());
    }, [dispatch]);


    return (
        <>
            <h1>Tasks List</h1>
            <div class="input-group mb-3">
                <button type="button" class="ms-3 btn btn-primary " onClick={() => setOpen(o => !o)}>
                    Add Task
                </button>
                <Popup  open={open} onClose={closeForm}>
                    <TaskForm closeForm={closeForm} />
                </Popup>

            </div>
            {!tasks.length ? <div class="spinner-border" role="status" /> :
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tài xế</th>
                            <th scope="col">Phương tiện</th>
                            <th scopr="col">Đoạn đường</th>
                            <th scope="col">Ngày giao</th>
                            <th scope="col">Ca</th>
                            <th scope="col">Điểm danh vào</th>
                            <th scope="col">Điểm danh ra</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => <Task idx={index} task={task} key={task._id} />)}
                    </tbody>
                </table>}

        </>)
}

export default Tasks