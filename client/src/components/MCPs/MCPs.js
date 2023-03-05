import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Popup from 'reactjs-popup'

import { getMCPs } from "../../actions/mcpAction";
import MCP from './MCP/MCP.js'
import MCPForm from './Form/MCPForm'

const MCPs = () => {
    const dispatch = useDispatch();
    const { mcps } = useSelector((state) => state.mcp);
    const [open, setOpen] = useState(false);  
    const closeForm = () => setOpen(false);

    useEffect(() => {
        dispatch(getMCPs());
    }, [dispatch]);

    return (
    <>
        <h1>MCPs List</h1>
        <div class="input-group mb-3">
            <button type="button" class="ms-3 btn btn-primary " onClick={() => setOpen(o => !o)}>
                Add Location
            </button>
            <Popup open={open} modal onClose={closeForm}>
                <MCPForm closeForm={closeForm}/>
            </Popup>

        </div>
        {!mcps.length ? <div class="spinner-border" role="status"/> : 
        <table class="table">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">X</th>
                <th scope="col">Y</th>
                <th scope="col">Load</th>
                <th scope="col">Capacity</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
        {mcps.map((mcp) => <MCP mcp={mcp} key={mcp._id}/>)}
        </tbody>
        </table>}   
    </>)
}

export default MCPs