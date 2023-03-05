import React, { useEffect } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from "./components/Navbar/Navbar.js"
import Home from "./components/Home/Home.js"
import Users from './components/Users/Users.js';
import Auth from './components/Auth/Auth.js';
import MCPs from "./components/MCPs/MCPs.js";
import Trucks from "./components/Trucks/Trucks.js";
import Tasks from "./components/Tasks/Tasks.js"
import Chats from "./components/Chats/Chats.js"
import Map from "./components/Map/Map.js"

const App = () => {
    return (
        <BrowserRouter>
            <div class="row justify-content-start">
                <div class="col-auto">
                    <Navbar />
                </div>
                <div class="col">
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/auth" element={<Auth />} />
                        <Route exact path="/users" element={<Users />} />
                        <Route exact path="/mcps" element={<MCPs />} />
                        <Route exact path="/trucks" element={<Trucks />} />
                        <Route exact path="/tasks" element={<Tasks />} />
                        <Route exact path="/map" element={<Map />} />
                        <Route exact path="/chats" element={<Chats />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
};

export default App;

