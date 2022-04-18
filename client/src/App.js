import React from 'react';
import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

import AllVideo from './components/AllVideo';
import Home from './components/homePage/Home';
import VideoPlay from './components/videoPlay/VideoPlay';
import User from './components/User';

async function postAvatar({ image, description }) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('description', description);

    const result = await axios.post('/users/avatarImage', formData);
    return result.data;
}



function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <header className="App-header">
                    <nav>
                        <NavLink className="navlink" to="/">
                            Home
                        </NavLink>
                        <NavLink className="navlink" to="/videoPlay">
                            VideoPlay
                        </NavLink>
                    </nav>
                </header>
                <br />
                <div className="App-body">
                    <Routes>
                        <Route index path="/" element={<Home />} />
                        <Route index path="/videoPlay" element={<VideoPlay />}/>
                        <Route path="/users/:id" element={<User />} />
                        <Route
                            path="/videos/getAllVideosByTag/:tag"
                            element={<AllVideo />}
                        />
                    </Routes>
                </div>
                <br />
                <br />
                <div className="con">
                    <footer>
                        <p className="text-center text-white">Designed by Group 3</p>
                    </footer>
                </div>
                <br />
            </div>
        </BrowserRouter>
    );
}

export default App;
