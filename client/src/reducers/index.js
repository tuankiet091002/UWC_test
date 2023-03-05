import { combineReducers } from 'redux';

import user from './userReducer.js';
import auth from './authReducer.js';
import mcp from './mcpReducer.js';
import truck from './truckReducer.js';
import task from './taskReducer.js';
import chat from './chatReducer.js'

export const reducers = combineReducers({ user, auth, mcp, truck, task, chat });