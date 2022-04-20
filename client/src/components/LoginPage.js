import axios, { Axios } from 'axios';
import React from 'react';
import '../App.css';

function LoginPage(){
    let email;
    let password;
    let body;

    const handleSubmit = async(e)=>{
        e.preventDefault();

        try {
            await axios({
                method: 'POST',
                url: '/users/login',
                data: {
                    email: email.value,
                    password: password.value  
                }
            }); 
            window.location.href = '/';
        } catch (e) {
            alert("Either email or password is wrong");
        }
        


    }

    body = (
        <form className='form' id='create_user' onSubmit={handleSubmit}>
            
            <div className='form-group'>
                <label>
                Email:
                    <br/>
                    <input
                        ref={(node)=>{
                            email = node;
                        }}
                    required
                    
                    />
                </label>
            </div>
            <br/>
            
            <div className='form-group'>
                <label>
                Password:
                    <br/>
                    <input type="password"
                        ref={(node)=>{
                            password = node;
                        }}
                    required
                    
                    />
                </label>
            </div>
            <br/>
            
            
            <br/>
            <br/>
            <br/>
            <button className='button' type='submit'>
                Comfirm
            </button>
        </form>
    );

    return(
        <div>
            {body}
        </div>
    );

}


export default  LoginPage;