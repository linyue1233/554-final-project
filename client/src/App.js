import React from 'react';
import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

import AllVideo from './components/AllVideo';
import Home from './components/homePage/Home';
import VideoPlay from './components/videoPlay/VideoPlay';
import User from './components/User';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import Admin from './components/Admin';

import SearchVideo from './components/SearchVideo';


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
                        <NavLink className="navlink" to="/videoPlay/1e625977-ca18-416c-88bf-475a66bd0ba1">
                            VideoPlay
                        </NavLink>
                        <NavLink className="navlink" to="/login">
                            Login</NavLink>
                        <NavLink className="navlink" to="/signup">
                            Signup
                        </NavLink>
                    </nav>
                    <SearchVideo/>
                </header>
                <br />
                <div className="App-body">
                    <Routes>
                        <Route index path="/" element={<Home />} />
                        <Route index path="/videoPlay/:videoId" element={<VideoPlay />}/>
                        <Route path="/users/:id" element={<User />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route
                            path="/videos/getAllVideosByTag/:tag/:type"
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
