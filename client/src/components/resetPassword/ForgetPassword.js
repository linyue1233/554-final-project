import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import '../../css/ResetPassword.css';
import { Box } from '@mui/material';
import axios from 'axios';



function ForgetPassword() {
    const [userEmail, setUserEmail] = useState("");

    const onSubmit = event => {
        event.preventDefault();
        if (userEmail.trim() === "") {
            alert("Your email is invalid.");
            return;
        }
        // check email format
        let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        let checkForm = reg.test(userEmail);
        if(!checkForm) {
            alert("Your email is invalid.");
            setUserEmail("")
            return;
        }
        const params = { 'userEmail': userEmail };
        axios.post('/users/requestResetPassword',params).then(res=>{
            alert("Please check your email to reset your password.");
        }).catch(err=>{
            alert("Your email may doesnt exist. Please try again.");
            console.log(err.message);
        })
        setUserEmail("");
    };

    return (
        <div className="password-body">
            <Box className="formContainer">
                <form onSubmit={onSubmit}>
                    <h1>Forget Password</h1>
                    <p>Input your email to reset your password</p>
                    <label for="sendEmail">Email:</label> &nbsp; &nbsp; 
                    <input id ="sendEmail" type="text" placeholder="Your email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required></input>
                    <br></br>
                    <button type="submit" className="btn btn-primary resetButton" >Send</button>
                </form>

            </Box>
        </div>

    )
}



export default ForgetPassword;
