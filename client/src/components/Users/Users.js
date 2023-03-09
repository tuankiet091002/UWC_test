import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUsers } from "../../actions/userAction";
import User from './User/User.js'

const Users = () => {
    const initialState = {name: ''};
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.user);
    const [searchQuery, setSearchQuery] = useState(initialState)

    useEffect(() => {
        dispatch(getUsers(searchQuery));   
    }, [dispatch, searchQuery])

    const handleChange = (e) => {
        setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value});
        
    }
    const clear = () => {
        setSearchQuery(initialState);
    }
    
    return (
    <>
        <h1>Employees List</h1>
        <div class="input-group mb-3" style={{width:"50vw"}}>
        <input type="text" class="form-control" name="name" value={searchQuery.name} onChange={handleChange}/>
            <div class="input-group-append">
                <span class="input-group-text"><i class="bi bi-x" role="button" onClick={clear}/></span>
            </div>
        </div>
        {!users.length ? <div class="spinner-border" role="status"/> :
        <table class="table">
        <thead>
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
            </tr>
        </thead>
        <tbody>
            {users.map((user) => <User user={user} key={user._id}/>)}
        </tbody>
        </table>}     
    </>)
};

export default Users;