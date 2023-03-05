import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Multiselect from 'multiselect-react-dropdown';

import { getUsers } from '../../../actions/userAction';
import { getMCPs } from '../../../actions/mcpAction';
import { getTrucks } from '../../../actions/truckAction';
import { createTask } from '../../../actions/taskAction';

const TaskForm = ({ closeForm }) => {
    const initialState = { collector: '', truck: '', janitor: [], path: [], date: '', shift: '' };
    const dispatch = useDispatch();
    const [form, setForm] = useState(initialState);
    
    const { users } = useSelector(state => state.user)
    let collectors = users.filter(emp => emp.role == "collector")
    const [janitors, setJanitors] = useState(users.filter(emp => emp.role == "janitor"))
    const { mcps } = useSelector(state => state.mcp)
    const { trucks } = useSelector(state => state.truck)


    useEffect(() => {
        dispatch(getUsers({ available: true, mcp: null, truck: null }));
        dispatch(getTrucks({ path: null }));
        dispatch(getMCPs());
    }, []);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value || e.value });
    }

    const clearForm = () => {
        setForm(initialState);
        setJanitors(users.filter(emp => emp.role == "janitor"));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form)
        const submitJanitor = form.janitor.map(loc => !loc ? [] : loc.map(jan => jan._id))
        const submitPath = form.path.map(mcp => mcp._id)
        const submitDate = form.date + " GMT+0700"
        
        dispatch(createTask({ ...form, janitor: submitJanitor, path: submitPath, date: submitDate }));
        clearForm();
        closeForm();
    }


    return (
        <><div class="bg-light border border-primary p-3">
            <h1>Task Form</h1>
            <form onSubmit={handleSubmit}>
                <div class="form-group">
                    <label htmlFor="emp">Collector</label>
                    <select class="form-control" id="emp" name="collector" value={form.collector} onChange={handleChange}>
                        <option label=" "></option>
                        {collectors.map(collector => <option value={collector._id} key={collector._id}>{collector.name}</option>)}
                    </select>
                </div>
                <div class="form-group">
                    <label htmlFor="truck">Truck</label>
                    <select class="form-control" id="emp" value={form.truck} name="truck" onChange={handleChange}>
                        <option label=" "></option>
                        {trucks.map(truck => <option value={truck._id} key={truck._id}>{truck._id}</option>)}
                    </select>
                </div>
                <div class="form-group">
                    <label htmlFor="path">Working Route</label>
                    <Multiselect
                        options={mcps} // Options to display in the dropdown
                        selectedValues={''} // Preselected value to persist in dropdown
                        onSelect={(e, k) => {
                            setForm({ ...form, path: [...form.path, k] })
                        }} // Function will trigger on select event
                        onRemove={(e, k) => {
                            // console.log(prevFormJan)
                            console.log(form.janitor)
                            let index;
                            for (const i in form.path) {
                                if (form.path[i]?._id == k._id)
                                    index = i;
                            }
                            var newJan = structuredClone(form.janitor);
                            newJan[index] = []
                            console.log([...janitors, ...form.janitor[index]])
                            setJanitors([...janitors, ...form.janitor[index]])

                            setForm({ ...form, path: form.path.map(x => (x && x._id != k._id) ? x : null), janitor: newJan})
                        }} // Function will trigger on remove event
                        displayValue="_id" // Property name to display in the dropdown options
                        showCheckbox="true"
                    />
                </div>
                <div class="form-group">
                    <label htmlFor="janitor">Select Janitor:</label>
                    {
                        form.path.map((mcp, idx) => mcp ? <div key={idx}>
                            <span class="text-info">For MCP: {mcp._id}</span>
                            <Multiselect
                                options={janitors} // Options to display in the dropdown
                                selectedValues={''} // Preselected value to persist in dropdown
                                onSelect={(e) => {
                                    console.log(idx)
                                    for (const i in e) {
                                        setJanitors(janitors.filter(t => t._id != e[i]._id))
                                    }
                                    let t = form.janitor;
                                    t[idx] = e;
                                    setForm({ ...form, janitor: t })
                                }} // Function will trigger on select event
                                onRemove={(e, f) => {
                                    setJanitors([...janitors, f]);
                                    let t = form.janitor;
                                    t[idx] = e;
                                    setForm({ ...form, janitor: t })
                                }} // Function will trigger on remove event
                                displayValue="name" // Property name to display in the dropdown options
                                showCheckbox="true"
                            />
                        </div> : <></>)}
                </div>
                <div class="form-group">
                    <label htmlFor="date" >Date</label>
                    <input type="date" class="form-control" id="date" value={form.date} name="date" onChange={handleChange} />
                </div>
                <div class="form-group">
                    <label htmlFor="shift">Shift</label>
                    <select class="form-control" id="shift" value={form.shift} name="shift" onChange={handleChange} >
                        <option label=" "></option>
                        <option value="1">7h-9h</option>
                        <option value="2">10h-12h</option>
                        <option value="3">13h-15h</option>
                        <option value="4">16h-18h</option>
                    </select>
                </div>
                <br />
                <button type="submit" class="btn btn-primary me-3">Submit</button>
                <button type="button" onClick={clearForm} class="btn btn-danger">Reset</button>
            </form>
        </div></>)
}

export default TaskForm