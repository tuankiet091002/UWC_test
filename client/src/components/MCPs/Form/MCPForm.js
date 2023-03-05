import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createMCP } from "../../../actions/mcpAction";

const MCPForm = ({ closeForm }) => {
    const dispatch = useDispatch();
    const initialState = { x: 0, y: 0, cap: 0, load: 0 }
    const [formData, setForm] = useState(initialState);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createMCP(formData))
        clearForm();
        closeForm();
    }

    const handleChange = (e) => {
        setForm({ ...formData, [e.target.name]: e.target.value || e.value });
    }

    const clearForm = () => {
        setForm(initialState);
    };

    return (
        <><div class="border border-primary p-3">
            <p class="h2 text-center">Location Information</p>
            <form autoComplete='off' onSubmit={handleSubmit}>
                <div class="form-group">
                    <label htmlFor="x">Hoành độ</label>
                    <input type="text" class="form-control"
                        name="x" value={formData.x} onChange={handleChange} />
                </div>

                <div class="form-group">
                    <label htmlFor="y">Tung độ</label>
                    <input type="text" class="form-control"
                        name="y" value={formData.y} onChange={handleChange} />
                </div>

                <div class="form-group">
                    <label htmlFor="x">Sức chứa tối đa</label>
                    <input type="text" class="form-control"
                        name="cap" value={formData.cap} onChange={handleChange} />
                </div>

                <div class="form-group">
                    <label htmlFor="x">Sức chứa hiện tại</label>
                    <input type="text" class="form-control"
                        name="load" value={formData.load} onChange={handleChange} />
                </div>
                <br />
                <button type="submit" class="btn btn-primary mx-5" >Submit <i class="fa fa-paper-plane"></i></button>
                <button type="reset" class="btn btn-danger" onClick={clearForm}>Clear <i class="fa-solid fa-trash"></i></button>
            </form>
        </div></>
    );
}

export default MCPForm;