import axios, { Axios } from 'axios';
import React, { useState, useEffect } from 'react';
import '../App.css';
import verify from '../verify';
import AuthService from '../service/auth_service';
//username, email, password, avatar
function SignupPage() {
    let username;
    let password;
    let email;
    let avatar;
    let body;
    let newAvatar;

    const handlefile = async (e) => {
        try {
            const formData = new FormData();
            //console.log(e.target.files[0]);
            formData.append('avatar', e.target.files[0]);
            newAvatar = await axios.post('/users/avatarImage', formData);

            newAvatar = newAvatar.data.imagePath;
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(newAvatar);

        try {
            //check username
            if (!username) throw 'You must input a Username';
            verify.isString(username.value, 'username');
            verify.checkUsername(username.value);

            //check password
            if (!password) throw 'You must input a Password';
            verify.isString(password.value, 'password');
            verify.checkPassword(password.value);

            //check email
            if (!email) throw 'You must input a Email';
            verify.isString(email.value, 'email');
            verify.checkEmail(email.value);

            //check avatar
            if (!newAvatar) throw 'You must provide a proper Avatar';
            await axios({
                method: 'POST',
                url: '/users/signup',
                data: {
                    username: username.value,
                    password: password.value,
                    email: email.value,
                    avatar: newAvatar,
                },
            });
            window.location.href = '/login';
        } catch (e) {
            if (e.response) {
                alert(e.response.data.message);
            } else {
                alert(e);
            }
        }
    };

    useEffect(() => {
        async function checkState() {
            let currentUser = AuthService.getCurrentUser();
            let authStatus = await AuthService.checkAuth();
            if (authStatus) {
                console.log('Already logged in');
                window.location.href = '/';
            } else if (!authStatus && currentUser) {
                window.location.reload();
            }
        }

        checkState();
    }, []);

    body = (
        <div className="container">
            <div className="row justify-content-md-center">
                <form className="col-md-auto" id="create_user" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>
                            Username:
                            <br />
                            <input
                                className="form-control"
                                ref={(node) => {
                                    username = node;
                                }}
                                required
                                autoFocus={true}
                            />
                        </label>
                    </div>

                    <div className="mb-3">
                        <label>
                            Password:
                            <br />
                            <input
                                type="password"
                                className="form-control"
                                ref={(node) => {
                                    password = node;
                                }}
                                required
                            />
                        </label>
                    </div>

                    <div className="mb-3">
                        <label>
                            Email:
                            <br />
                            <input
                                className="form-control"
                                ref={(node) => {
                                    email = node;
                                }}
                                required
                            />
                        </label>
                    </div>

                    <div className="mb-3">
                        <label>
                            Avatar:
                            <br />
                            <input
                                type="file"
                                id="chooseAvatar"
                                className="form-control"
                                onChange={handlefile}
                                ref={(node) => {
                                    avatar = node;
                                }}
                            />
                        </label>
                    </div>
                    <br />

                    <button className="btn btn-primary" type="submit">
                        Comfirm
                    </button>
                </form>
            </div>
        </div>
    );

    return <div>{body}</div>;
}

export default SignupPage;
