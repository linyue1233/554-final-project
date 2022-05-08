import axios, { Axios } from 'axios';
import React, { useEffect } from 'react';
import '../App.css';
import AuthService from '../service/auth_service';
import verify from '../verify';

function LoginPage(){
    let email;
    let password;
    let body;

    const handleSubmit = async(e)=>{
        e.preventDefault();

        try {

            //check email
            if(!email) throw 'You must input a Email';
            verify.isString(email.value, 'email');
            verify.checkEmail(email.value);

            //check password
            if(!password) throw 'You must input a Password';
            verify.isString(password.value, 'password');
            verify.checkPassword(password.value);
            
            

            const {data} = await axios({
                method: 'POST',
                url: '/users/login',
                data: {
                    email: email.value,
                    password: password.value  
                }
            }); 

            if(data.authenticated) {
                const {data: user} = await axios.get('/users/currentUser');
                console.log(user);
                AuthService.setCurrentUser(user);
            }
            window.location.href = '/';
        } catch (e) {
            alert("Either email or password is wrong");
        }
        


    }

    useEffect(() => {
    
        async function checkState () {
            let currentUser = AuthService.getCurrentUser();
            let authStatus = await AuthService.checkAuth();
            if(authStatus) {
                console.log('Already logged in');
                window.location.href = '/';
            }else if(!authStatus && currentUser) {
                window.location.reload();
            }
        }

        checkState();
        
    }, []);


    const sendResetRequest = ()=>{
        window.location.href = "/requestResetPassword";
        return;
    }

    body = (
        <div className = 'loginForm'>
        <form className='form' id='create_user' onSubmit={handleSubmit}>
            
            <div className='mb-3'>
                <label>
                Email:
                    
                    <input className="form-control"
                        ref={(node)=>{
                            email = node;
                        }}
                    required
                    
                    />
                </label>
            </div>
            <br/>
            
            <div className='mb-3'>
                <label>
                Password:
                    
                    <input type="password" className="form-control"
                        ref={(node)=>{
                            password = node;
                        }}
                    required
                    
                    />
                </label>
            </div>
            <br/>
            
            
            
            <button className="btn btn-primary" type='submit'>
                Comfirm
            </button>
            
            <button className="btn btn-secondary" style= {{marginLeft:50}} onClick={sendResetRequest}>
                Reset Password
            </button>
            
            
        </form>
        </div>
        
    );

    return(
        <div>
            {body}
        </div>
    );

}


export default  LoginPage;