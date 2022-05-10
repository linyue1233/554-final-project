import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import '../../css/ResetPassword.css';
import { Box } from '@mui/material';
import axios from 'axios';




function ResetPassword() {
    const { userEmail } = useParams();
    const [newPassword, setNewPassword] = useState(null);
    const [repeatedPassword, setRepeatedPassword] = useState(null);
    const [code, setCode] = useState(null);
    const [loading, setLoading] = useState(true);

    async function checkUserToken() {
        const params = { "userEmail": userEmail };
        axios.post('/users/checkUserReset', params).then(res => {
            setLoading(false);
        }).catch(err => {
            setLoading(true);
        })
    }

    useEffect(() => {
        checkUserToken();
    }, [userEmail])

    const returnReset = () => {
        window.location.href = "/requestResetPassword";
        return;
    }

    const onSubmit = event => {
        event.preventDefault();
        if (newPassword.trim() === "" || repeatedPassword.trim() === "") {
            alert("You should input your password.");
            return;
        }
        if (newPassword.toLowerCase().trim() != newPassword.toLowerCase().trim().replace(/\s+/g, '')) {
            alert("Password cannot have spaces");
            return;
        }
        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }
        if (newPassword.trim() !== repeatedPassword.trim()) {
            alert("Your new password is not same as repeated password.");
            return;
        }
        const params = { 'userEmail': userEmail, "code": code, "newPassword": newPassword };
        axios.post('/users/resetPassword', params).then(res => {
            setLoading(false);
            alert("Reset Password successfully, we will return login page.");
            window.location.href = "/login";
            return;
        }).catch(err => {
            console.log(err.message);
            setCode("");
            alert("Your code is not right.");
        })
    }

    if (loading) {
        return (
            <div className="password-body">
                <Box className="formContainer">
                    Your toekn has expired, please send email again
                    <br></br>
                    <button className="btn btn-primary resetButton" onClick={returnReset}>Return</button>
                </Box>
            </div>
        )
    } else {
        return (
            <div className="password-body">
                <Box className="formContainer">
                    <form onSubmit={onSubmit}>
                        <h1>Forget Password</h1>
                        <p>Reset your password</p>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <label for="newPassword">NewPassword:</label>
                        &nbsp;&nbsp;
                        <input id="newPassword" type="password" placeholder="input password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required></input>
                        <br></br>
                        <div className="repeatedLable">
                            <label for="repeatPassword" >RepeatPassword:</label> &nbsp;&nbsp;
                            <input type="password" id="repeatPassword" placeholder="repeat password" value={repeatedPassword} onChange={(e) => setRepeatedPassword(e.target.value)} required></input>
                            <br></br>
                        </div>
                        <div className="repeatedLable">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label for="code">Code:</label> &nbsp;&nbsp;
                            <input type="text" id="code" placeholder="input your code" value={code} onChange={(e) => setCode(e.target.value)} required></input>
                            <br></br>
                        </div>
                        <button type="submit" className="btn btn-primary resetButton" >Submit</button>
                    </form>

                </Box>
            </div>)

    }

}



export default ResetPassword;