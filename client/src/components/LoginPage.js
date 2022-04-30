import axios, { Axios } from 'axios';
import React, { useEffect } from 'react';
import '../App.css';
import AuthService from '../service/auth_service';

function LoginPage(){
    let email;
    let password;
    let body;

    const handleSubmit = async(e)=>{
        e.preventDefault();

        try {
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

    useEffect(async () => {
    
        let currentUser = AuthService.getCurrentUser();
        let authStatus = await AuthService.checkAuth();
        if(authStatus) {
            console.log('Already logged in');
            window.location.href = '/';
        }else if(!authStatus && currentUser) {
            window.location.reload();
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    body = (
        <div className = 'loginForm'>
        <form className='form' id='create_user' onSubmit={handleSubmit}>
            
            <div className='mb-3'>
                <label>
                Email:
                    
                    <input class="form-control"
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
                    
                    <input type="password" class="form-control"
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