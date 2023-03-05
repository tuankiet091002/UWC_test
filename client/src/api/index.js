import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('token'))}`;
    }
    return req;
});

export const getUsers = (query) => API.get(`/user?${Object.keys(query).map(prop => `${prop}=${query[prop]}`).join('&&')}`);
export const getSingleUser = (id) => API.get(`/user/${id}`);
export const updateUser = (id, form) => API.patch(`/user/${id}`, form)
export const deleteUser = (id) => API.delete(`/user/${id}`);

export const signup = (form) => API.post('auth/signup', form);
export const signin = (form) => API.post('auth/signin', form);
export const logout = () => API.get('auth/logout');


export const getMCPs = () => API.get(`/mcp`);
export const getSingleMCP = (id) => API.get(`/mcp/${id}`);
export const createMCP = (form) => API.post('/mcp', form);
export const updateMCP = (id, form) => API.patch(`/mcp/${id}`, form)
export const deleteMCP = (id) => API.delete(`/mcp/${id}`);


export const getTrucks = (query) => API.get(`/truck?${Object.keys(query).map(prop => `${prop}=${query[prop]}`).join('&&')}`);
export const getSingleTruck = (id) => API.get(`/truck/${id}`);
export const createTruck = (form) => API.post('/truck', form);
export const updateTruck = (id, form) => API.patch(`/truck/${id}`, form)
export const deleteTruck = (id) => API.delete(`/truck/${id}`);



export const getTasks = () => API.get(`/task`);
export const getSingleTask = (id) => API.get(`/task/${id}`);
export const createTask = (form) => API.post('/task', form);
export const updateTask = (id, form) => API.patch(`/task/${id}`, form)
export const checkTask = (id, form) => API.post(`task/${id}`, form)
export const deleteTask = (id) => API.delete(`/task/${id}`);




export const getChats = (query) => API.get(`/chat?name=${query.name}`);
export const getSingleChat = (id) => API.get(`/chat/${id}`);
export const getMessages = (id) => API.get(`/mess/chat/${id}`);
export const sendMessage = (id, form) => API.post(`/mess/chat/${id}`, form);
export const createChat = (form) => API.post('/chat', form);
export const updateChat = (id, form) => API.patch(`/chat/${id}`, form)
export const deleteChat = (id) => API.delete(`/chat/${id}`);