import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Multiselect from 'multiselect-react-dropdown';

import { getUsers } from '../../../actions/userAction';
import { createChat, updateChat } from '../../../actions/chatAction'

const ChatForm = ({ chat, closeForm }) => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const initialState = chat != null ? { name: chat.name, users: chat.users.filter(x => x._id != user._id) } 
                                        : { name: '', users: [] };
    const [form, setForm] = useState(initialState);

    useEffect(() => {
        dispatch(getUsers({ name: '' }))
    }, [])

    let { users } = useSelector(state => state.user)
    users = users.filter(x => x._id != user._id)

    const handleSubmit = (e) => {
        e.preventDefault();
        if (chat)
            dispatch(updateChat(chat._id, form));
        else
            dispatch(createChat(form));
        clearForm();
        closeForm();
    }
    const clearForm = () => {
        setForm(initialState);
    };

    return (
        <><div class="border border-primary p-3">
            <p class="h2 text-center">Chat Form</p>
            <form autoComplete='off' onSubmit={handleSubmit}>
                <div class="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" class="form-control"
                        name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>

                <div class="form-group">
                    <label htmlFor="users">User</label>
                    <Multiselect
                        options={users} // Options to display in the dropdown
                        selectedValues={form.users} // Preselected value to persist in dropdown
                        onSelect={(e) => setForm({ ...form, users: e })} // Function will trigger on select event
                        onRemove={(e) => setForm({ ...form, users: e })} // Function will trigger on remove event
                        displayValue="name" // Property name to display in the dropdown options
                        showCheckbox="true"
                    />
                </div>

                <br />
                <button type="submit" class="btn btn-primary me-5" >Submit <i class="fa fa-paper-plane"></i></button>
                <button type="reset" class="btn btn-danger" onClick={clearForm}>Clear <i class="fa-solid fa-trash"></i></button>
            </form>
        </div></>
    )
}

export default ChatForm