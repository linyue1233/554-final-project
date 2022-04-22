import axios, { Axios } from 'axios';
import React from 'react';
import '../App.css';

//username, email, password, avatar
function SignupPage(){
    let username;
    let password;
    let email;
    let avatar;
    let body;
    let newAvatar;


    const handlefile = async (e)=>{
        const formData = new FormData();
        //console.log(e.target.files[0]);
        formData.append("avatar", e.target.files[0] );
        newAvatar = await axios.post('/users/avatarImage',formData);
        
        newAvatar = newAvatar.data.imagePath;
        //const formData = new FormData();
        //formData.append("avatar", e.target.files[0] );
        
        //newAvatar = "https://benchmoon-554.s3.amazonaws.com/1649987446046-WechatIMG915.jpeg";
    }
    
    const handleSubmit = async(e) =>{
        e.preventDefault();

        try {
            await axios({
                method: 'POST',
                url: '/users/signup',
                data: {
                    username: username.value,
                    password: password.value,
                    email: email.value,
                    avatar: newAvatar
                }
            }); 
           window.location.href = '/login';
        } catch (e) {
            alert(e);
        }
            
    }


    body = (
        <form className='form' id='create_user' onSubmit={handleSubmit}>
            <div className='form-group'>
                <label>
                Username:
                    <br/>
                    <input
                        ref={(node)=>{
                            username = node;
                        }}
                    required
                    autoFocus={true}
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
                Avatar:
                    <br/>
                    <input type="file" id='chooseAvatar'
                    onChange={handlefile}
                        ref={(node)=>{
                            avatar = node;
                        }}
                    
                    
                    />
                </label>
            </div>
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

export default  SignupPage;