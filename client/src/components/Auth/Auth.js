import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { signin, signup } from "../../actions/authAction"


const Auth = () => {
    const initialState = { name: '', username: '', password: '', role: ''};

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);

    const switchMode = () => {
        setIsSignup((prev) => !prev);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value || e.value });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            dispatch(signup(form, navigate));
        } else {
            dispatch(signin(form, navigate));
        }
    }

    return (
    <form style={{width:"50vw"}} onSubmit={handleSubmit}>
        <h1>{ isSignup ? 'Sign Up': 'Sign In' }</h1>
        {   isSignup && (
            <div class="form-group">
            <label htmlFor="#fname">Name</label>
            <input type="text" id="fname" class="form-control" name="name" onChange={handleChange}/>
            </div>
        )
        }
        <div class="form-group">
            <label htmlFor="#username">Username</label>
            <input type="text" id="usernme" class="form-control" name="username" onChange={handleChange}/>
        </div>
        <div class="form-group">
            <label htmlFor="#pass">Password</label>
            <input type="password" id="class" class="form-control" name="password" onChange={handleChange}/>
        </div>
        { isSignup && (<div class="form-group">
            <label htmlFor="role">Role</label>
            <select class="form-control" id="role" name = "role" default="" onChange={handleChange}>
                <option value=""></option>
                <option value="janitor">Janitor</option>
                <option value="collector">Collector</option>
                <option value="backofficer">Back Officer</option>
            </select>
        </div>)
        }
        <hr/>
        <button type="submit" class="btn btn-primary me-4">{isSignup ? 'Sign Up' : 'Sign In'}</button>
        <button type="button" class="btn btn-secondary" onClick={switchMode}>
            { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
        </button>
    </form>
    );
}

export default Auth;
