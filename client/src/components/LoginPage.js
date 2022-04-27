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