import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import ShowSearchVideo from './components/ShowSearchVideo';
import AllVideo from './components/AllVideo';
import Home from './components/homePage/Home';
import VideoPlay from './components/videoPlay/VideoPlay';
import User from './components/User';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import Admin from './components/Admin';
import AuthService from './service/auth_service';
import ForgetPassword from './components/resetPassword/ForgetPassword';
import ResetPassword from './components/resetPassword/ResetPassword';
import SearchVideo from './components/SearchVideo';
import ChatroomClient from './components/websocket/Chat';
async function postAvatar({ image, description }) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('description', description);

    const result = await axios.post('/users/avatarImage', formData);
    return result.data;
}

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        let tempUser = AuthService.getCurrentUser();
        setCurrentUser(tempUser);
    }, [JSON.stringify(currentUser)]);

    const onChangeState = () => {
        setCurrentUser(null);
    };

    // const currentUser = AuthService.getCurrentUser();

    return (
        <BrowserRouter>
            <div className="App">
                <header className="App-header">
                    <div className="d-flex justify-content-between">
                        <div className="col-md-auto">
                            <NavLink className="navlink" to="/" >
                                Home
                            </NavLink>
                        </div>{' '}
                        &nbsp;
                        <div className="searchVideo">
                            <SearchVideo />
                        </div>
                        {currentUser && currentUser.isAdmin && (
                            //col-md-2 offset-md-1
                            <div className="navBar" style={{ width: 'auto' }}>
                                <NavLink className="navlink" to="/chatroom">
                                    Contact us
                                </NavLink>
                                <NavLink className="navlink" to="/admin">
                                    Admin
                                </NavLink>
                                <NavLink
                                    className="navlink"   
                                    to={`/users/${currentUser._id}`}
                                >
                                    {currentUser.email}
                                </NavLink>
                                <NavLink
                                    className="navlink"
                                    to="/"
                                    onClick={() => {
                                        AuthService.logout();
                                        window.location.href = '/';
                                    }}
                                >
                                    Logout
                                </NavLink>
                            </div>
                        )}
                        {currentUser && !currentUser.isAdmin && (
                            <div className="navBar" style={{ width: 'auto' }}>
                                <NavLink className="navlink" to="/chatroom">
                                    Contact us
                                </NavLink>
                                <NavLink
                                    className="navlink"
                                    to={`/users/${currentUser._id}`}
                                >
                                    {currentUser.email}
                                </NavLink>
                                <NavLink
                                    className="navlink"
                                    to="/"
                                    onClick={() => {
                                        AuthService.logout();
                                        window.location.href = '/';
                                    }}
                                >
                                    Logout
                                </NavLink>
                            </div>
                        )}
                        {!currentUser && (
                            <div className="navBar" style={{ width: 'auto' }}>
                                <NavLink className="navlink" to="/login">
                                    Login
                                </NavLink>
                                <NavLink className="navlink" to="/signup">
                                    Signup
                                </NavLink>
                            </div>
                        )}
                    </div>
                </header>
                <div className="App-body">
                    <br />
                    <Routes>
                        <Route index path="/" element={<Home />} />
                        <Route
                            index
                            path="/videoPlay/:videoId"
                            element={<VideoPlay onChangeState={onChangeState} />}
                        />
                        <Route path="/users/:id" element={<User />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/requestResetPassword"
                            element={<ForgetPassword />}
                        />
                        <Route
                            path="/user/resetPassword/:userEmail"
                            element={<ResetPassword />}
                        />
                        <Route
                            path="/videos/getAllVideosByTag/:tag/:type"
                            element={<AllVideo />}
                        />
                        <Route
                            path="/videos/getAllVideosBySearchName/:searchTerm"
                            element={<ShowSearchVideo />}
                        />
                        <Route path="/chatroom" element={<ChatroomClient />} />
                    </Routes>
                </div>
                <br />
                <br />
                <div>
                    <footer>
                        <p className="footer-text">Designed by Group 3</p>
                    </footer>
                </div>
                <br />
            </div>
        </BrowserRouter>
    );
}

export default App;
